local seconds = Config.AlarmLength

local AlertTypes = { -- לא לגעת בזה
    ["missiles"] = 1,
    ["hostileAircraftIntrusion"] = 2,
}

local function ArrayLength(ar)
    local count = 0
    for k,v in pairs(ar) do
        count+=1
    end
    return count
end

CreateThread(function()
    local firing = false
    local waitTime = math.ceil(Config.AlertScanTime * 1000)
    
    if(waitTime <= 1) then
        error("Scan Time is too low")
        return
    end
    while true do
        Wait(waitTime)
        PerformHttpRequest("https://redalert.me/alerts", function(err, text, headers) 
            if(err ~= 200) then
                error(string.format("ERROR, we couldn't get the data ERROR Type: %s.", err))
                return
            end
            if text then
                cjson = json.decode(text)
                if cjson then
                    local rtv = {}
                    local ostime = os.time()
                    for k, v in pairs(cjson) do
                        if v['threat'] and AlertTypes[v['threat']] then
                            local alertTime = os.date("*t", v['date'])
                            
                            if ostime - os.time(alertTime) <= seconds then
                                rtv[v['area']] = AlertTypes[v['threat']]
                            end
                        end
                    end
                    if ArrayLength(rtv) ~= 0 then
                        if not firing then
                            firing = true
                        end
                        TriggerClientEvent('private_missilealerts', -1, rtv)
                    else
                        if firing then
                            TriggerClientEvent('private_missilealerts', -1, {})
                            firing = false;
                        end
                    end
                end
            end
        end)
        
    end
end)
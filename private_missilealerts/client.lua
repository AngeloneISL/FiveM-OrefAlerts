local lastdata = {}
local noAlerts = false

local function ArrayLength(table)
    local count = 0
    for _ in pairs(table) do
        count = count + 1
    end
    return count
end

RegisterNetEvent('private_missilealerts', function(data) 
    if noAlerts then return end
    if ArrayLength(data) ~= 0 then
        if json.encode(lastdata) ~= json.encode(data) then
            lastdata = data
            if(Config.AlertSound) then
                SendNUIMessage({type = "playSound"})
            end
        end
    else
        lastdata = {}
    end
    SendNUIMessage({type = "alerts", alerts = data}) 
end)



RegisterNUICallback("getSettings", function(_,cb)
    cb({cities = Config.Cities, imagescreen = Config.ImageScreen, alertSide = Config.AlertSide, animationTime = Config.AnimationTime})
end)


RegisterCommand('oref',function()
    SendNUIMessage({
        type = "openMenu",
    })
    SetNuiFocus(true,true)
end, false)

RegisterNUICallback("blockalerts", function(_,cb)
    noAlerts = not noAlerts
    cb(noAlerts)
    if noAlerts then
        lastdata = {}
        SendNUIMessage({type = "alerts", alerts = {}}) 
    end
end)

RegisterNUICallback("close", function(_,cb)
    cb("ok")
    SetNuiFocus(false,false)
end)
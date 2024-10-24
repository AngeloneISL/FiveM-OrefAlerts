local lastdata = {}
local noAlerts = false
RegisterNetEvent('israel-alerts', function(data) 
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

function ArrayLength(table)
    local count = 0
    for _ in pairs(table) do
        count = count + 1
    end
    return count
end

RegisterNUICallback("getSettings", function(_,cb)
    cb({imagescreen = Config.ImageScreen, alertSide = Config.AlertSide, animationTime = Config.AnimationTime})
end)




RegisterCommand("noalerts",function()
    noAlerts = not noAlerts
    print(string.format("Alerts State: %s",noAlerts and "Off" or "On"))
    if noAlerts then
        lastdata = {}
        SendNUIMessage({type = "alerts", alerts = {}}) 
    end
end)
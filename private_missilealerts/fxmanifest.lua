fx_version 'cerulean'
games { 'gta5' }

author 'Original Idea by barbaroNN, Re-Programmed by Angelone'
description 'Notifies your players about incoming missile attacks on israel'
version '1.0.0'

lua54 'yes'

server_script 'server.lua'
client_script 'client.lua'

shared_scripts({
    'config.lua',
})

ui_page "html/index.html"
files{
    'html/images/*.png',
    'html/images/*.gif',
    'html/style.css',
    'html/sounds/alert.ogg',
    'html/sounds/emergency_sound.mp3',
    'html/index.html',
    'html/script.js',
}
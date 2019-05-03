//Discord
const Discord = require('discord.js');
const Client = new Discord.Client();
const ConfigDiscord = require('./app/controller/configDiscordController');
//Youtube
const getYoutubeID = require('get-youtube-id');
const youtubeInfo = require('youtube-info');
const youtubeApiKey = require('./config/youtubeApi.json').apiKey;
const ytdl = require('ytdl-core');
const request = require('request');

//JSON - provisório
const tokenDiscord = require('./config/discordApi.json').token;

let configDiscord = new ConfigDiscord();

var queue = [];
var isPlaying = false;
var dispatcher = null;
var voiceChannel = null;
var skipRequest = 0;
var skippers = [];
var args = null;
var member = null;

async function init() {
    // await configDiscord.getById(1).then(successCallback, failureCallback);
    Client.login(tokenDiscord);
}

init();

Client.on('ready', () => {
    console.log(`Logado como ${Client.user.tag}`);
    Client.user.setActivity("Sendo desenvolvido");
});

Client.on('message', msg => {
    member = msg.member;
    args = msg.content.split(' ').slice(1).join(" ");

    if (msg.content.toLowerCase() == `ping`)
        msg.reply(`pong`);
    else if (msg.content.startsWith("!"))
        processarComandos(msg);
});

function successCallback(result) {
    configDiscord = result;
}

function failureCallback(error) {
    console.log("Deu erro:" + error);
}

function processarComandos(message) {
    let mensagem = '';
    let comandoFormatado = message.content.toLowerCase().substring(1).split(' ').slice(0);

    if (message.content.startsWith("!")) {
        switch (comandoFormatado[0]) {
            case "music":
                console.log('tamanho da fila', queue.length)
                if (queue.length > 0 || isPlaying) {
                    getID(args, function (id) {
                        addtoQueue(id);
                        youtubeInfo(id, function (error, videoInfo) {
                            if (error) throw error
                            message.reply(`Adicionou na fila: ` + videoInfo.title);
                        })
                    })
                } else {
                    isPlaying = true;
                    getID(args, function (id) {
                        queue.push("placeholder");
                        playMusic(id, message);
                        youtubeInfo(id, function (error, videoInfo) {
                            if (error) throw error
                            message.reply(`Está tocando agora: ` + videoInfo.title);
                        })
                    })
                }
                break;
            case "skip":
                message.reply('Pula não seu corno!')
                removeQueue(message);
                break;
            default:
                mensagem = 'Comando não encontrado';
        }
    }
    return mensagem;
}

function playMusic(id, message) {
    console.log(`tamanho da fila`, queue);
    voiceChannel = message.member.voiceChannel;

    voiceChannel.join().then(function (connection) {
        stream = ytdl("https://www.youtube.com/watch?v=" + id, {
            filter: 'audioonly'
        });

        skipRequest = 0;
        skippers = [];

        dispatcher = connection.playStream(stream);

        dispatcher.on('end', function () {
            console.log('ENTROU NO END')
            skipRequest = 0;
            skippers = [];
            queue.shift();
            if (queue.length === 0) {
                queue = [];
                isPlaying = false;
            } else {
                playMusic(queue[0], message);
            }
        })
    });
}

function getID(str, callback) {
    if (isYoutube(str)) {
        callback(getYoutubeID(str));
    } else {
        searchVideo(str, function (id) {
            callback(id);
        })
    }
}

function addtoQueue(strId) {
    if (isYoutube(strId)) {
        queue.push(getYoutubeID(strId));
    } else {
        queue.push(strId);
    }
}

function removeQueue(message) {
    console.log('removeu acionado')
    if (queue.length != 0 || queue[0] != undefined) {
        console.log(`esta tocando`, isPlaying);
        console.log('musica id', queue[0]);
        voiceChannel.leave();
        isPlaying = true;
        playMusic(queue[0], message);
    } else {
        message.reply('Não tem música pra pular não fi!')
    }
}

function isYoutube(str) {
    return str.toLowerCase().indexOf("youtube.com") > -1;
}

function searchVideo(query, callback) {
    request("https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=" + encodeURIComponent(query) + "&key=" + youtubeApiKey, function (error, response, body) {
        var json = JSON.parse(body);

        callback(json.items[0].id.videoId);
    });
}





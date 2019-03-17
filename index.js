const Discord = require('discord.js');
const Client = new Discord.Client();
const ConfigDiscord = require('./app/controller/configDiscordController');

let configDiscord = new ConfigDiscord();

async function init() {
    await configDiscord.getById(1).then(successCallback, failureCallback);
    Client.login(configDiscord.token);
}

init();

Client.on('ready', () => {
    console.log(`Logado como ${Client.user.tag}`);
    Client.user.setActivity("Sendo desenvolvido");
});

Client.on('message', msg => {
    if (msg.content.toLowerCase() == `ping`)
        msg.reply(`pong`);
    else if (msg.content.startsWith("!"))
        msg.reply(processarComandos(msg.content));

});

function successCallback(result) {
    configDiscord = result;
}

function failureCallback(error) {
    console.log("Deu erro:" + error);
}

function processarComandos(comando) {
    let mensagem = '';
    if (comando.startsWith("!")) {
        switch (comando.toLowerCase().substring(1)) {
            case "sad":
                mensagem = 'Fica triste não';
                break;
            default:
                mensagem = 'Comando não encontrado';
        }
    }
    return mensagem;
}





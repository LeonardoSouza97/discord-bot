const Discord = require('discord.js');
const Client = new Discord.Client();
const ConfigDiscord = require('./app/controller/configDiscordController');

let configDiscord = new ConfigDiscord();

async function init(){
   await configDiscord.getById(1).then(successCallback, failureCallback);
   Client.login(configDiscord.token);
}

init();

Client.on('ready', () => {
    console.log(`Logado como ${Client.user.tag}`);
});

Client.on('message', msg => {
    // console.log(`conteudo`, msg.content);
    if (msg.content == `ping`)
        msg.reply(`pong`);

});

function successCallback(result) {
    configDiscord = result;
  }
  
  function failureCallback(error) {
    console.log("It failed with " + error);
  }





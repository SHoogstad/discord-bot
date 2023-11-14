const {GatewayIntentBits, Events, Client, Collection, codeBlock,  } = require( 'discord.js')
const { token } = require('./config.json')

const client = new Client({
    intents:
        Object.keys(GatewayIntentBits).map((a) => {
            return GatewayIntentBits[a]
        }),
});

const prefix = '!'; 

const fs = require('fs'); 
const { send } = require('process');
const { profile } = require('console');

client.commands = new Collection
require(`./handlers/command_handler/handler`)(client, Client);
require(`./handlers/event_handler/handler`)(client);


// client.on('guildMemberAdd', guildMember =>{
//     let welcomeRole = guildMember.guild.roles.cache.find(role => role.name === 'Recruits');

//     guildMember.roles.add(welcomeRole)
// });

client.login(token);
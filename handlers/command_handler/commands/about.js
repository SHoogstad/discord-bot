const { EmbedBuilder } = require("discord.js");

module.exports = { 
    name: 'about' , 
    description: 'about',
    execute(client, message, cmd, args) {1
        let embed = new EmbedBuilder()
        .setColor('#e42643')
        .setTitle('About this bot')
        .setDescription('This is a open source bot made By Hoogstaddie\n\n with feautures: \n'
            + `- Play Music via Youtube \n`
            + `- Play music via local files with youtube as backUp`);

        message.channel.send({ embeds: [embed] });
    }

}
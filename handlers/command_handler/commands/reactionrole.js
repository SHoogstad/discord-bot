const { EmbedBuilder } = require("discord.js");

module.exports = { 
    name: 'reactionrole' , 
    description: 'reaction role message!',
    async execute(client, message, args, Discord) { 
        const channel = '842115411688423464'
        const Azurlanerole = message.guild.roles.cache.find(role => role.name === 'azur lane')
        const CrimsonAxesrole = message.guild.roles.cache.find(role => role.name === 'crimson axes')
        const AzurLaneEmoji = '👍' ; 
        const CrimsonAxesEmoij = '🤫' ; 

        
        let embed = new EmbedBuilder()
            .setColor('#e42643')
            .setTitle('Choose a team to play on!')
            .setDescription('Choosing a team will allow you to interact with your teammates!\n\n'
                + `${AzurLaneEmoji} for azur lane\n`
                + `${CrimsonAxesEmoij} for crimson axes`);

        let messageEmbed = await message.channel.send({ embeds: [embed] });
        messageEmbed.react(AzurLaneEmoji);
        messageEmbed.react(CrimsonAxesEmoij); 
        
        client.on('messageReactionAdd', async(reaction, user) => {
            if(reaction.message.partial) await reaction.Message.fetch();
            if(reaction.partial) await reaction.fetch();
            if(user.bot) return;
            if(!reaction.message.guild) return;

            if (reaction.message.channel.id == channel) {
                if (reaction.emoji.name === AzurLaneEmoji) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(Azurlanerole);
                }
                if (reaction.emoji.name === CrimsonAxesEmoij) {
                    await reaction.message.guild.members.cache.get(user.id).roles.add(CrimsonAxesrole);
                }
            } else {
                return;
            }
        });

        
    }



}
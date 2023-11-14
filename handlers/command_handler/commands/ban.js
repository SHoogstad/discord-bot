module.exports = {
    name: 'ban',
    description: 'ban command',
    execute(client, message, cmd, args, Discord) {
        const member = message.mentions.users.first();
    

        if(message.member.roles.cache.has('841973097049620481')) {
            const memberTarget = message.guild.members.cache.get(member.id);
            memberTarget.ban();
            message.channel.send("user has been banned")

        } else{
            message.channel.send("you couldn't ban that member contact a staff member")
        }
    }

}
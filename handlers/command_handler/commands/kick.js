module.exports = {
    name: 'kick',
    description: 'kick command',
    execute(client, message, cmd, args, Discord) {
        const member = message.mentions.users.first();
        if(message.member.roles.cache.has('841973097049620481')){
            const memberTarget = message.guild.members.cache.get(member.id);
            memberTarget.kick();
            message.channel.send("user has been kicked")

        }else{
            message.channel.send("you couldn't kick that member contact a staff member")
        }
    }

}
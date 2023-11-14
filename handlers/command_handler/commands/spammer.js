module.exports = {
    name: 'spammer',
    description: 'a spammer that spams the given user',
    execute(args, message)
    {
        message.delete()
        
        message.channel.mention()
    }
}

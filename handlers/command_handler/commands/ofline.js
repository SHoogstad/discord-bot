

module.exports = { 
    name: 'ofline' , 
    description: 'sets the bot ofline',
    execute(client, message, cmd, args, Discord) {
        
        client.destroy()
    }
}
module.exports = { 
    name: 'robin' , 
    description: 'robin',
    execute(client, message, args) { 
        message.channel.send('robin is a tryhard')
        message.react("👍");
    }
}
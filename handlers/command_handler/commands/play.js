// todo fix queue, clean up yt-search
const ytdl = require('ytdl-core');
const ytSearch = require('yt-search');
const fs = require('fs');

const { join } = require("path");
const MusicDir = join(__dirname, 'music');


const { joinVoiceChannel, createAudioResource, createAudioPlayer, AudioPlayerStatus, VoiceConnectionStatus } = require('@discordjs/voice');
const queue = new Map();

const player = createAudioPlayer();
let resource = {};
let connection = {};

module.exports = {
    name: 'play',
    description: 'Advanced music bot',
    alias: ['skip', 'stop'],
    async execute(client, message, cmd, args) {
        const voice_channel = message.member.voice.channel;
        if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
        const permissions = voice_channel.permissionsFor(message.client.user);
        if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
        if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');

        
        const server_queue = queue.get(message.guild.id);

       
        if (cmd === 'play') {
            if (!args.length) return message.channel.send('You need to send the second argument!');
            let song = {};

            if(!fs.existsSync()) {
                if (ytdl.validateURL(args[0])) {
                    const song_info = await ytdl.getInfo(args[0]);
                    song = { title: song_info.videoDetails.title, url: song_info.videoDetails.video_url }
                } else {
                    
                    const video_finder = async (query) => {
                        const video_result = await ytSearch(query);
                        return (video_result.videos.length > 1) ? video_result.videos[0] : null;
                    }

                    const video = await video_finder(args.join(' '));
                    if (video){
                        const stream = ytdl(video.url, {
                            filter: "audioonly",
                            fmt: "mp3",
                            highWaterMark: 1 << 62,
                            liveBuffer: 1 << 62,
                            dlChunkSize: 0, //disabling chunking is recommended in discord bot
                            bitrate: 128,
                            quality: "lowestaudio",
                       });

                        resource = createAudioResource(stream, {
                            inlineVolume: true,
                            metadata: {
                                title: video.title, url: video.url, youtube: true,
                            }
                        })

                    } else {
                        message.channel.send('Error finding video.');
                    }
                }

            } else {
                console.log('test')
                 resource = createAudioResource(join(MusicDir, args.join(' ')), {
                    inlineVolume: true,
                    metadata: {
                        title: args,
                        youtube: false,
                    },
                });
            }

           
            if (!server_queue) {
                const queue_constructor = {
                    voice_channel: voice_channel,
                    text_channel: message.channel,
                    connection: null,
                    songs: []
                }
                
                queue.set(message.guild.id, queue_constructor);
    
                try {
                     connection = joinVoiceChannel({
                        channelId: message.member.voice.channel.id,
                        guildId: message.channel.guild.id,
                        adapterCreator: message.channel.guild.voiceAdapterCreator,
                    });
                    
                    
                    queue_constructor.songs.push(resource);


                    queue_constructor.connection = connection;
                    video_player(message.guild, queue_constructor.songs[0], connection);
                } catch (err) {
                    queue.delete(message.guild.id);
                    message.channel.send('There was an error connecting!');
                    throw err;
                }
            } else {
        
                server_queue.songs.push(resource);
                
                if(resource.metadata.youtube === true){
                return message.channel.send(`🌐 **${resource.metadata.title}** added to queue!`);

                }else{
                    return message.channel.send(`💻 **${resource.metadata.title}** added to queue!`);

                }

            }

        }

        else if(cmd === 'skip') skip_song(message, server_queue, connection);
        else if(cmd === 'stop') stop_song(message, server_queue, connection);
    }
    
}

const video_player = async (guild, song, connection) => {
    const song_queue = queue.get(guild.id);

    if (!song) {
        connection.on(VoiceConnectionStatus.destroy, () => {
            return
        });
        connection.destroy();
        queue.delete(guild.id);
        return;
    }

    song.volume.setVolume(1);
    player.play(song)

    connection.subscribe(player);
    player.on('error', error => {
        console.log(error);
    });

    await song_queue.text_channel.send(`🎶 Now playing **${song.metadata.title}**`)

    player.on(AudioPlayerStatus.Idle, () => {
        console.log('The audio player has started ildeling!');
        song_queue.songs.shift()
        video_player(guild, song_queue.songs[0], connection)
    });
}

const skip_song = (message, server_queue, connection) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');

    if(!server_queue){
        return message.channel.send(`There are no songs in queue 😔`);
    }

    server_queue.songs.shift()

    if(server_queue.songs.length <= 0){
        return message.channel.send(`There are no songs in queue 😔 continuing current song`);
    }

    player.pause()
    video_player(message.guild, server_queue.songs[0], connection)
}

const stop_song = (message, server_queue, connection) => {
    if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
    server_queue.songs = [];
    player.stop()

    return message.channel.send(`shutting music player down`)
}
import Bot from '../../Client'
import { Message, MessageEmbed, Util } from 'discord.js'
import Command from '../../structures/Command';

export default new class PlayCommand extends Command {

    public constructor() {
        super('play',
            PlayMusic,
            0,
            ['add', 'p'],
            ['EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD'],
            'play (link | keywords)');
    }

}

async function PlayMusic(msg: Message, args: string[]) {
    if (args.length < 1) return;

    const voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) return msg.channel.send(Bot.createEmbed(':x: You need to be in a voice channel in order to use this command'));

    const player = Bot.music.create({
        guild: msg.guild.id,
        voiceChannel: msg.member.voice.channel.id,
        textChannel: msg.channel.id,
    });

    if (player.state !== "CONNECTED") player.connect();

    if (player.voiceChannel !== voiceChannel.id) return msg.channel.send(Bot.createEmbed(':x: You need to be connected in the same voice channel as me to use this command'));

    if (!player.voiceState) return;

    let video_url = args[0].split('&');

    if (video_url[0].match(/^https?:\/\/(((www|m)\.)youtube.com)\/playlist(.*)$/)) {
        let res = await Bot.music.search(args.join(), msg.author);

        if (res.loadType === 'LOAD_FAILED') return msg.channel.send(Bot.createEmbed(':x: An unexpected error occurred.'));
        if (!res.tracks) return msg.channel.send(Bot.createEmbed(':x: An unexpected error occurred.'));

        player.queue.add(res.tracks);

        let playlist = res.playlist;

        if (playlist)
            await msg.channel.send(Bot.createEmbed(null, `📄Playlist: **${playlist.name}**`, null, { name: 'Add to the queue:' }));
    } else {
        let res = await Bot.music.search(args.join(' '), msg.author);

        if (res.loadType === 'LOAD_FAILED') return msg.channel.send(Bot.createEmbed(':x: An unexpected error occurred.'));
        if (!res.tracks) return msg.channel.send(Bot.createEmbed(':x: An unexpected error occurred.'));

        if (player.queue.includes(res.tracks[0])) return msg.channel.send(Bot.createEmbed('Song already in the queue!'));

        player.queue.add(res.tracks[0]);

        await msg.channel.send(Bot.createEmbed(null, `[${res.tracks[0].title}](${res.tracks[0].uri})`, null, { name: 'Add to the queue' }, res.tracks[0].thumbnail));
        Bot.log.info({ msg: 'music added to queue', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name }, song: { name: Util.escapeMarkdown(res.tracks[0].title), url: res.tracks[0].uri } });
    }

    if (!player.playing && !player.paused && !player.queue.size) player.play()
};
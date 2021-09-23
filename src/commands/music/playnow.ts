import Bot from '../../Client'
import { Message, Util } from 'discord.js'
import Command from '../../structures/Command';
import PermLevels from '../../structures/PermLevels';

export default new class PlayNowCommand extends Command {

    public constructor() {
        super('playnow',
            PlayNowMusic,
            PermLevels.DJ,
            ['pn'],
            ['EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD'],
            'playnow (link | keywords)');
    }

}

async function PlayNowMusic(msg: Message, args: string[]) {
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

    if (!voiceChannel.joinable) {
        player.destroy();
        return msg.channel.send(Bot.createEmbed(`:x: I can't connect to \`${voiceChannel.name}\` :(`));
    }

    let video_url = args[0].split('&');

    if (!video_url[0].match(/^https?:\/\/(((www|m)\.)youtube.com)\/playlist(.*)$/)) {
        let res = await Bot.music.search(args.join(' '), msg.author);

        let icon = '';
        if (res.tracks[0].uri.startsWith("https://www.youtube.com"))
            icon = "<:youtube:890514824071639130> ";
        else if (res.tracks[0].uri.startsWith("https://soundcloud.com"))
            icon = "<:soundcloud:890514824151310356> ";

        if (!res.tracks) return msg.channel.send(":x: An unexpected error occurred.");

        if (player.queue.includes(res.tracks[0])) return msg.channel.send(Bot.createEmbed(':x: Song already in the queue!'));

        player.queue.add(res.tracks[0], 0);
        player.stop();

        await msg.channel.send(Bot.createEmbed(null, `${icon}[${res.tracks[0].title}](${res.tracks[0].uri})`, null, { name: 'Playing now' }, res.tracks[0].thumbnail));
        Bot.log.info({ msg: 'playnow', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name }, song: { name: Util.escapeMarkdown(res.tracks[0].title), url: res.tracks[0].uri } });
    }

    if (!player.playing) player.play();
};
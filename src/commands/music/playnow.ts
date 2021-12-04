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
    if (!voiceChannel) return msg.channel.send(Bot.createEmbed(':x: You must be in a voice channel in order to use this command'));

    const player = Bot.music.create({
        guild: msg.guild.id,
        voiceChannel: msg.member.voice.channel.id,
        textChannel: msg.channel.id,
        selfDeafen: true
    });

    if (player.state !== "CONNECTED") {
        player.connect();
        player.stop();
    }

    if (player.voiceChannel !== voiceChannel.id) return msg.channel.send(Bot.createEmbed(':x: You must be connected in the same voice channel as me to use this command'));

    if (!voiceChannel.joinable) {
        player.destroy();
        return msg.channel.send(Bot.createEmbed(`:x: I can't connect to \`${voiceChannel.name}\` :(`));
    }

    let video_url = args[0].split('&');

    if (!video_url[0].match(/^https?:\/\/(((www|m)\.)youtube.com)\/playlist(.*)$/)) {
        let res = await Bot.music.search(args.join(' '), msg.author);

        if (res.exception)
            return msg.channel.send(Bot.createEmbed(":x: An error occured :(", res.exception.message));

        let icon = '';
        if (res.tracks[0].uri) {
            if (res.tracks[0].uri.startsWith("https://www.youtube.com"))
                icon = "<:bot_youtube:916021328883118080> ";
            else if (res.tracks[0].uri.startsWith("https://soundcloud.com"))
                icon = "<:bot_soundcloud:916021329688416267> ";
        }

        if (!res.tracks) return msg.channel.send(":x: An unexpected error occurred.");

        if (player.queue.find(value => value.title === res.tracks[0].title) || player.queue.current?.title === res.tracks[0].title) return msg.channel.send(Bot.createEmbed(':warning: Song already in the queue!', 'Use -loop or -loopq if you wanna loop songs'));

        player.queue.add(res.tracks[0], 0);
        player.stop();

        await msg.channel.send(Bot.createEmbed(null, `${icon}[${res.tracks[0].title}](${res.tracks[0].uri})`, null, { name: 'Playing now' }, `https://img.youtube.com/vi/${res.tracks[0].identifier}/mqdefault.jpg`));
        Bot.log.info({ msg: 'playnow', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name }, song: { name: Util.escapeMarkdown(res.tracks[0].title), url: res.tracks[0].uri } });
    }

    if (!player.playing && !player.paused && !player.queue.size) {
        player.play();
        player.pause(false);
    }
};
import Bot from '../../Client'
import { Message, MessageEmbed, Util } from 'discord.js'
import Command from '../../structures/Command';
import PermLevels from '../../structures/PermLevels';

export default new class NowPlayingCommand extends Command {

    public constructor() {
        super('nowplaying',
            NowPlaying,
            PermLevels.Everyone,
            ['np'],
            ['EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD'],
            'nowplaying');
    }

}

async function NowPlaying(msg: Message) {
    const player = Bot.music.players.get(msg.guild.id);

    if (!player.playing && player.queue.length === 0)
        return msg.channel.send(Bot.createEmbed(null, ":x: I'm not playing anything right now!"));

    let song = player.queue['current'];

    let desc = `[${Util.escapeMarkdown(song.title)}](${song.uri})`;
    let footer;

    if (!song.isStream) {
        let songDuration = new Date(song.duration).toISOString().substr(11, 8);
        let time = new Date(player.position).toISOString().slice(11, 19)
        footer = `${time} / ${songDuration}`;
    } else
        footer = '🔴 Livestream';

    let loo = player.trackRepeat || false
    if (loo) footer += " ・ 🔂 Looping this song";

    let looqueue = player.queueRepeat || false
    if (looqueue) footer += " ・ 🔁 Looping the queue";

    msg.channel.send(Bot.createEmbed(':cd: Now Playing', desc, footer, null, song.thumbnail));
    Bot.log.info({ msg: 'nowplaying', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } })
};
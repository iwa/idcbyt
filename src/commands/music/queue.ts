import Bot from '../../Client'
import { Message, MessageEmbed, Util } from 'discord.js'
import Command from '../../structures/Command';
import PermLevels from '../../structures/PermLevels';

export default new class QueueCommand extends Command {

    public constructor() {
        super('queue',
            Queue,
            PermLevels.Everyone,
            ['q'],
            ['EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD'],
            'queue');
    }

}

async function Queue(msg: Message) {
    const player = Bot.music.players.get(msg.guild.id);
    if (!player) return msg.channel.send(Bot.createEmbed(null, ":x: I'm not playing anything right now!"));

    let queue = player.queue;
    if (queue.size < 0) return;

    if (queue.size === 0 && !queue.current) {
        msg.channel.send(Bot.createEmbed(null, ":cd: The queue is empty."));
        Bot.log.info({ msg: 'queue', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } })
    } else {
        await msg.channel.sendTyping();

        let n = 1;
        let q = queue.slice(0, 9);

        let timeString;
        if (!queue['current'].isStream) {
            let date = new Date(queue['current'].duration);
            timeString = date.toISOString().substr(11, 8)
        } else
            timeString = '🔴 Livestream'

        let desc = `🎶 [${Util.escapeMarkdown(queue['current'].title)}](${queue['current'].uri}) ・ *${timeString}*\n\n`;
        for await (const song of q) {
            let timeString;
            if (!song.isStream) {
                let date = new Date(song.duration);
                timeString = date.toISOString().substr(11, 8)
            } else
                timeString = '🔴 Livestream'

            desc = `${desc}${n}. [${Util.escapeMarkdown(song.title)}](${song.uri}) ・ *${timeString}*\n`;
            n += 1;
        }

        let footer;
        if (queue.size > 10) {
            footer = `and ${(queue.size - 10)} more...`;
            let looqueue = player.queueRepeat || false
            if (looqueue) footer += ' | 🔁 Looping the queue';
        }

        let looqueue = player.queueRepeat || false
        if (looqueue) footer = '🔁 Looping the queue';

        msg.channel.send(Bot.createEmbed(":cd: Music Queue", desc, footer));
        Bot.log.info({ msg: 'queue', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } })
    }
};
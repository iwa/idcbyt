import Bot from '../../Client'
import { Message, MessageEmbed } from 'discord.js'
import Command from '../../structures/Command';
import PermLevels from '../../structures/PermLevels';

export default new class LoopQueueCommand extends Command {

    public constructor() {
        super('loopqueue',
            LoopQueue,
            PermLevels.DJ,
            ['loopq', 'lq'],
            ['EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD'],
            'loopqueue');
    }

}

async function LoopQueue(msg: Message) {
    if (!msg.member.voice.channel) return;

    const player = Bot.music.create({
        guild: msg.guild.id,
        voiceChannel: msg.member.voice.channel.id,
        textChannel: msg.channel.id,
    });

    if (player.voiceChannel !== msg.member.voice.channelId) return msg.channel.send(Bot.createEmbed(':x: You need to be connected in the same voice channel as me to use this command'));

    let loop = player.queueRepeat || false;

    if (!loop) {
        player.setQueueRepeat(true);

        Bot.log.info({ msg: 'loop', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name }, enable: true })

        return msg.channel.send(Bot.createEmbed(null, null, null, { name: '🔁 Looping the queue...' }));
    } else if (loop) {
        player.setQueueRepeat(false);

        Bot.log.info({ msg: 'loop', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name }, enable: false })

        return msg.channel.send(Bot.createEmbed(null, null, null, { name: 'The queue will no longer be looped...' }));
    }
};
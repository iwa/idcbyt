import Bot from '../../Client'
import { Message, MessageEmbed } from 'discord.js'
import Command from '../../structures/Command';
import PermLevels from '../../structures/PermLevels';

export default new class RemoveCommand extends Command {

    public constructor() {
        super('remove',
            RemoveSong,
            PermLevels.DJ,
            [],
            ['EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD'],
            'remove (id of the video in the queue)');
    }

}

async function RemoveSong(msg: Message, args: string[]) {
    if (!msg.member.voice.channel) return;

    const player = Bot.music.create({
        guild: msg.guild.id,
        voiceChannel: msg.member.voice.channel.id,
        textChannel: msg.channel.id,
    });

    if (player.voiceChannel !== msg.member.voice.channelId) return msg.channel.send(Bot.createEmbed(':x: You need to be connected in the same voice channel as me to use this command'));

    let queueID: number = parseInt(args[0], 10);

    if (isNaN(queueID)) return;
    if (queueID < 1 || queueID > 9) return;

    let song = player.queue.splice((queueID - 1), 1);

    if (!song[0]) return;

    msg.channel.send(Bot.createEmbed(null, `**${song[0].title}**`, null, { name: 'Removed from the queue:' }));

    Bot.log.info({ msg: 'remove', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name }, song: { title: song[0].title, url: song[0].uri } });
};
import Bot from '../../Client'
import { Message, MessageEmbed, VoiceChannel } from 'discord.js'
import Command from '../../structures/Command';

export default new class SkipCommand extends Command {

    public constructor() {
        super('forceskip',
            SkipSong,
            0,
            ['fs'],
            ['EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD'],
            'forceskip');
    }

}

async function SkipSong(msg: Message) {
    if (!msg.member.permissions.has('MANAGE_CHANNELS')) return;

    let voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) return;

    const player = Bot.music.create({
        guild: msg.guild.id,
        voiceChannel: msg.member.voice.channel.id,
        textChannel: msg.channel.id,
    });

    if (!player.playing && player.queue.length === 0)
        return msg.channel.send(Bot.createEmbed(null, ":x: I'm not playing anything right now!"));

    msg.channel.send(Bot.createEmbed(null, 'Skipped...'));

    player.setTrackRepeat(false);
    player.stop();

    return Bot.log.info({ msg: 'skip', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } })
};
import Bot from '../../Client'
import { Message, MessageEmbed } from 'discord.js'
import Command from '../../structures/Command';

export default new class LoopCommand extends Command {

    public constructor() {
        super('loop',
            Loop,
            0,
            ['l'],
            ['EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD'],
            'loop');
    }

}

async function Loop(msg: Message) {
    if (!msg.member.voice.channel) return;

    const player = Bot.music.create({
        guild: msg.guild.id,
        voiceChannel: msg.member.voice.channel.id,
        textChannel: msg.channel.id,
    });

    if (player.voiceChannel !== msg.member.voice.channelId) return msg.channel.send(Bot.createEmbed(':x: You need to be connected in the same voice channel as me to use this command'));

    let loop = player.trackRepeat || false;

    if (!loop) {
        player.setTrackRepeat(true);

        Bot.log.info({ msg: 'loop', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name }, enable: true })

        return msg.channel.send(Bot.createEmbed(null, null, null, { name: "🔂 Looping the current song..." }));
    } else if (loop) {
        player.setTrackRepeat(false);

        Bot.log.info({ msg: 'loop', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name }, enable: false })

        return msg.channel.send(Bot.createEmbed(null, null, null, { name: "This song will no longer be looped..." }));
    }
};
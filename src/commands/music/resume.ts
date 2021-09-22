import Bot from '../../Client'
import { Message } from 'discord.js'
import Command from '../../structures/Command';

export default new class ResumeCommand extends Command {

    public constructor() {
        super('resume',
            ResumeSong,
            0,
            [],
            ['EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD', 'ADD_REACTIONS'],
            'resume');
    }

}

async function ResumeSong(msg: Message) {
    if (!msg.member.voice.channel) return;

    const player = Bot.music.create({
        guild: msg.guild.id,
        voiceChannel: msg.member.voice.channel.id,
        textChannel: msg.channel.id,
    });

    if (player.voiceChannel !== msg.member.voice.channelId) return msg.channel.send(Bot.createEmbed(':x: You need to be connected in the same voice channel as me to use this command'));

    if (!player.playing && player.paused) {
        player.pause(false);
        await msg.react('▶️');
        Bot.log.info({ msg: 'resume', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } });
    }
};
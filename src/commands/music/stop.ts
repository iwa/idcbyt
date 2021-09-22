import Bot from '../../Client'
import { Message } from 'discord.js'
import Command from '../../structures/Command';

export default new class StopCommand extends Command {

    public constructor() {
        super('stop',
            StopMusic,
            0,
            ['leave', 'disconnect', 'dc', 'fuckoff'],
            ['EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD', 'ADD_REACTIONS'],
            'stop');
    }

}

async function StopMusic(msg: Message) {
    if (!msg.member.voice.channel) return;

    const player = Bot.music.create({
        guild: msg.guild.id,
        voiceChannel: msg.member.voice.channel.id,
        textChannel: msg.channel.id,
    });

    if (player.voiceChannel !== msg.member.voice.channelId) return msg.channel.send(Bot.createEmbed(':x: You need to be connected in the same voice channel as me to use this command'));

    player.destroy();

    await msg.react('👋');
    Bot.log.info({ msg: 'stop', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } });
};
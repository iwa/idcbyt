import Bot from '../../Client'
import { Message } from 'discord.js'
import Command from '../../structures/Command';
import PermLevels from '../../structures/PermLevels';

export default new class PauseCommand extends Command {

    public constructor() {
        super('pause',
            PauseMusic,
            PermLevels.DJ,
            [],
            ['EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD', 'ADD_REACTIONS'],
            'pause');
    }

}

async function PauseMusic(msg: Message) {
    if (!msg.member.voice.channel) return;

    const player = Bot.music.create({
        guild: msg.guild.id,
        voiceChannel: msg.member.voice.channel.id,
        textChannel: msg.channel.id,
    });

    if (player.voiceChannel !== msg.member.voice.channelId) return msg.channel.send(Bot.createEmbed(':x: You need to be connected in the same voice channel as me to use this command'));

    if (player.playing && !player.paused) {
        player.pause(true);
        await msg.react('⏸');
        Bot.log.info({ msg: 'pause', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } });
    }
};
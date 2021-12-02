import Bot from '../../Client'
import { Message } from 'discord.js'
import Command from '../../structures/Command';
import PermLevels from '../../structures/PermLevels';

export default new class ResetFilter extends Command {

    public constructor() {
        super('resetfilter',
            Reset,
            PermLevels.DJ,
            [],
            ['EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD', 'ADD_REACTIONS'],
            'resetfilter');
    }

}

async function Reset(msg: Message) {
    if (!msg.member.voice.channel) return;

    const player = Bot.music.get(msg.guildId);

    if (player.voiceChannel !== msg.member.voice.channelId) return msg.channel.send(Bot.createEmbed(':x: You need to be connected in the same voice channel as me to use this command'));

    player.clearEQ();

    await msg.react('♻️');

    Bot.log.info({ msg: 'resetfilter', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } })
};
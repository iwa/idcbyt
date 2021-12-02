import Bot from '../../Client'
import { Message } from 'discord.js'
import Command from '../../structures/Command';
import PermLevels from '../../structures/PermLevels';

export default new class NightcoreFilter extends Command {

    public constructor() {
        super('8d',
            MultiDimension,
            PermLevels.DJ,
            ['3d'],
            ['EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD', 'ADD_REACTIONS'],
            '8d');
    }

}

async function MultiDimension(msg: Message) {
    if (!msg.member.voice.channel) return;

    const player = Bot.music.get(msg.guildId);

    if (player.voiceChannel !== msg.member.voice.channelId) return msg.channel.send(Bot.createEmbed(':x: You need to be connected in the same voice channel as me to use this command'));

    player.node.send({
        op: "filters",
        guildId: msg.guild.id,
        equalizer: player.bands.map((gain, index) => {
            var Obj = {
                "band": 0,
                "gain": 0,
            };
            Obj.band = Number(index);
            Obj.gain = Number(gain)
            return Obj;
        }),
        rotation: {
            "rotationHz": 10,
        },
    });

    await msg.react('🗿');

    Bot.log.info({ msg: '8d', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } })
};
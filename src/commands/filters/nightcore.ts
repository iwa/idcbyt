import Bot from '../../Client'
import { Message } from 'discord.js'
import Command from '../../structures/Command';
import PermLevels from '../../structures/PermLevels';

export default new class NightcoreFilter extends Command {

    public constructor() {
        super('nightcore',
            Nightcore,
            PermLevels.DJ,
            [],
            ['EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD', 'ADD_REACTIONS'],
            'nightcore');
    }

}

async function Nightcore(msg: Message) {
    if (!msg.member.voice.channel) return;

    const player = Bot.music.get(msg.guildId);

    if (player.voiceChannel !== msg.member.voice.channelId) return msg.channel.send(Bot.createEmbed(':x: You need to be connected in the same voice channel as me to use this command'));

    player.node.send({
        op: "filters",
        guildId: msg.guild.id,
        equalizer: player.bands.map((gain, index) => {
            let Obj = {
                "band": 0,
                "gain": 0,
            };
            Obj.band = Number(index);
            Obj.gain = Number(gain)
            return Obj;
        }),
        timescale: {
            "speed": 1.25,
            "pitch": 1.2,
            "rate": 1.05
        },
    });
    player.set("filter", "👻 Nightcore");

    await msg.react('🌙');

    Bot.log.info({ msg: 'nightcore', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } })
};
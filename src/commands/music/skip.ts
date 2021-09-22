import Bot from '../../Client'
import { Message } from 'discord.js'
import PermLevels from '../../structures/PermLevels';
import Command from '../../structures/Command';

let skippers: Map<string, Set<string>> = new Map();
let skipReq: Map<string, number> = new Map();
let last: Map<string, string> = new Map();

export default new class SkipCommand extends Command {

    public constructor() {
        super('skip',
            SkipSong,
            PermLevels.Everyone,
            ['s', 'next'],
            ['EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD'],
            'skip');
    }

}

async function SkipSong(msg: Message) {
    let voiceChannel = msg.member.voice.channel;
    if (!voiceChannel) return;

    const player = Bot.music.create({
        guild: msg.guild.id,
        voiceChannel: msg.member.voice.channel.id,
        textChannel: msg.channel.id,
    });

    if (player.voiceChannel !== msg.member.voice.channelId) return;

    if (!player.playing && player.queue.length === 0)
        return msg.channel.send(Bot.createEmbed(null, ":x: I'm not playing anything right now!"));

    if (player.queue['current'].uri !== last.get(msg.guild.id)) {
        skipReq.delete(msg.guild.id);
        skippers.delete(msg.guild.id);

        last.set(msg.guild.id, player.queue['current'].uri);
    }

    let skipperList = skippers.get(msg.guild.id) || new Set();
    if (!skipperList.has(msg.author.id)) {
        skipperList.add(msg.author.id);
        skippers.set(msg.guild.id, skipperList);

        let reqs = skipReq.get(msg.guild.id) || 0;
        reqs += 1;
        skipReq.set(msg.guild.id, reqs);

        msg.channel.send(Bot.createEmbed(null, null, null, { name: "Your voteskip has been registered!", url: msg.author.avatarURL({ format: 'png', dynamic: false, size: 128 }) }));

        Bot.log.info({ msg: 'voteskip', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } });

        if (reqs >= Math.ceil((voiceChannel.members.size - 1) / 2)) {
            msg.channel.send(Bot.createEmbed("⏭ Half of the people have voted, skipping..."));

            player.setTrackRepeat(false);
            player.stop();

            skipReq.delete(msg.guild.id);
            skippers.delete(msg.guild.id);

            Bot.log.info({ msg: 'skipping song', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } })
        } else {
            msg.channel.send(Bot.createEmbed(`You need **${(Math.ceil((voiceChannel.members.size - 1) / 2) - reqs)}** more skip vote to skip!`))
        }
    } else {
        msg.channel.send(Bot.createEmbed(":x: You already voted for skipping!"))
    }

    return Bot.log.info({ msg: 'skip', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } })
};
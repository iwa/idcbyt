import Bot from '../../Client'
import { Message } from 'discord.js'
import Command from '../../structures/Command';

export default new class FFCommand extends Command {

    public constructor() {
        super('fastforward',
            FastForward,
            0,
            ['ff'],
            ['EMBED_LINKS', 'CONNECT', 'SPEAK', 'USE_VAD', 'ADD_REACTIONS'],
            'fastforward (number in seconds)');
    }

}

async function FastForward(msg: Message, args: string[]) {
    if (!msg.member.voice.channel) return;
    if (args.length !== 1) return;

    const player = Bot.music.create({
        guild: msg.guild.id,
        voiceChannel: msg.member.voice.channel.id,
        textChannel: msg.channel.id,
    });

    if (player.voiceChannel !== msg.member.voice.channelId) return msg.channel.send(':x: You need to be connected in the same voice channel as me to use this command');

    if (player.playing) {
        let current = player.position;
        player.seek(current + (parseInt(args[0], 10) * 1000))
        await msg.react('⏩');
    }

    Bot.log.info({ msg: 'fastforward', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } })
};
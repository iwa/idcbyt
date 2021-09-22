import Bot from '../../Client'
import { Message } from 'discord.js';
import Command from '../../structures/Command';

export default new class PingCommand extends Command {

    public constructor() {
        super('ping', SendPing, 0, [], ['EMBED_LINKS'], 'ping');
    }

}

async function SendPing(msg: Message) {
    let ping = Math.ceil(Bot.ws.ping);
    await msg.channel.send(Bot.createEmbed(null, `:ping_pong: Pong ! \`${ping}ms\``))
        .then(() => { Bot.log.info({ msg: 'ping', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } }); })
        .catch(err => Bot.log.error(err));
}
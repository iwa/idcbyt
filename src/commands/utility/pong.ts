import Bot from '../../Client'
import { Message } from 'discord.js';
import Command from '../../structures/Command';

export default new class PongCommand extends Command {

    public constructor() {
        super('pong', SendPong, 0, [], ['EMBED_LINKS'], 'pong');
    }

}

async function SendPong(msg: Message) {
    let ping = Math.ceil(Bot.ws.ping);
    await msg.channel.send(Bot.createEmbed(null, `:ping_pong: Ping ! \`${ping}ms\``))
        .then(() => { Bot.log.info({ msg: 'ping', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } }); })
        .catch(err => Bot.log.error(err));
}
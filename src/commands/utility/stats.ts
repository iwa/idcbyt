import Bot from '../../Client'
import { Message } from 'discord.js';
import Command from '../../structures/Command';
import PermLevels from '../../structures/PermLevels';

export default new class StatsCommand extends Command {

    public constructor() {
        super('stats',
            SendStats,
            PermLevels.Iwa,
            ['stat'],
            ['EMBED_LINKS'],
            'stats');
    }

}

async function SendStats(msg: Message) {
    let ping = Math.ceil(Bot.ws.ping);
    let guilds = Bot.guilds.cache.size;
    let users = Bot.users.cache.size;
    let VCs = Bot.music.players.size;
    let version = Bot.version;

    await msg.channel.send(Bot.createEmbed('⚙️ Stats', `ping: \`${ping}ms\`\nguilds: \`${guilds}\`\nusers: \`${users}\`\nvoice: \`${VCs}\` connections`, `#${version}`))
        .then(() => { Bot.log.info({ msg: 'ping', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } }); })
        .catch(err => Bot.log.error(err));
}
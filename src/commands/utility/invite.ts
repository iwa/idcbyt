import Bot from '../../Client'
import { Message } from 'discord.js';
import Command from '../../structures/Command';

export default new class InviteCommand extends Command {

    public constructor() {
        super('invite', SendLink, 0, ['invitelink', 'link'], ['EMBED_LINKS'], 'invite');
    }

}

async function SendLink(msg: Message) {
    await msg.channel.send(Bot.createEmbed(null, "[Invite me!](https://discord.com/oauth2/authorize?client_id=447883949209944075&scope=bot&permissions=6479662144)"))
        .then(() => { Bot.log.info({ msg: 'invite', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } }); })
        .catch(err => Bot.log.error(err));
}
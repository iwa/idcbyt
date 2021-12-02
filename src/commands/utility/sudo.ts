import Bot from '../../Client'
import { Message } from 'discord.js';
import Command from '../../structures/Command';

export default new class SudoCommand extends Command {

    public constructor() {
        super('sudo', Sudo, 0, [], ['EMBED_LINKS'], 'sudo');
    }

}

async function Sudo(msg: Message) {
    if (Bot.sudo) {
        Bot.sudo = false;
        msg.react('⚫️');
    } else {
        Bot.sudo = true;
        msg.react('🟢');
    }
}
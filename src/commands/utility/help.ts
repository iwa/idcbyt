import Bot from '../../Client';
import { Message, MessageEmbed } from 'discord.js';
let commands = new Map();
let member = new MessageEmbed();

import * as fs from 'fs';
import Command from '../../structures/Command';
import PermLevels from '../../structures/PermLevels';
import SlashCommand from '../../structures/SlashCommand';

readDirs()
setTimeout(() => {
    member.setTitle("⌨️ Commands")
    member.setColor("#2F3136")
    member.addFields([
        {
            "name": "**🎶 Music**",
            "value": commands.get("music")
        },
        {
            "name": "**🛠 Utilities**",
            "value": commands.get("utility")
        },
    ]);
    member.setDescription(`Use \`${Bot.prefix}help (command)\` to have more info about a specific command`);
}, 5000);


export default new class HelpCommand extends Command {

    public constructor() {
        super('help',
            Help,
            PermLevels.Everyone,
            ['commands', 'command'],
            ['EMBED_LINKS'],
            'help [command]');
    }

}


async function Help(msg: Message, args: string[]) {
    if (args.length == 1) {
        let cmd: SlashCommand = Bot.commands.get(args[0]);
        if (!cmd) return;
        if (cmd.permLevel == PermLevels.Staff && !msg.member.permissions.has('MANAGE_GUILD')) return;

        let embed = new MessageEmbed();

        embed.setTitle(`${Bot.prefix}${cmd.name}`);
        embed.setDescription("Syntax : `( )` is needed argument, `[ ]` is optional argument");

        if (cmd.aliases) {
            let aliases = [...cmd.aliases]
            for (let i = 0; i < cmd.aliases.length; i++)
                aliases[i] = `${Bot.prefix}${cmd.aliases[i]}`;

            embed.addField("Aliases", `${aliases.toString()}`, true);
        }

        //embed.addField("Description", `${cmd.desc}`);

        return msg.channel.send({ embeds: [embed] });
    } else {
        try {
            await msg.channel.send({ embeds: [member] });
        } catch {
            return msg.channel.send(":x: **Commands list loading, redo the command in a few seconds!**");
        }
    }


    Bot.log.info({ msg: 'help', author: { id: msg.author.id, name: msg.author.tag }, guild: { id: msg.guild.id, name: msg.guild.name } });
}

async function readDirs() {
    fs.readdir('./build/commands/', { withFileTypes: true }, async (error, f) => {
        if (error) return Bot.log.error(error);
        f.forEach((f) => {
            if (f.isDirectory()) {
                fs.readdir(`./build/commands/${f.name}/`, async (error, fi) => {
                    if (error) return Bot.log.error(error);
                    let string: string = "";
                    fi.forEach(async (fi) => {
                        string = `${string}\`${fi.slice(0, -3)}\` `;
                    })
                    commands.set(f.name, string);
                })
            }
        });
    });
}

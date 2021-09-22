import Bot from '../Client';
import { Message, MessageReaction, RoleResolvable, TextChannel, User } from "discord.js";

export default class reactionRoles {

    static async add(reaction: MessageReaction, author: User) {
        let rr = await Bot.db.collection('rr').findOne({ msg: reaction.message.id })
        if (!rr) return;

        let role = rr.roles.find((val: any) => val.emote === reaction.emoji.name || val.emote === reaction.emoji.id);
        if (!role) return;

        let member = await reaction.message.guild.members.fetch({ user: author, cache: true });
        if (!member) return;

        if (rr.uniqueRole) {
            let roles: RoleResolvable[] = [];
            for (const elem of rr.roles) {
                if (elem.id != role.id) {
                    roles.push(elem.id);

                    let channel: any = await Bot.channels.fetch(rr.channel, { cache: true });
                    let msg: Message = await channel.messages.fetch(rr.msg, { cache: true });

                    await msg.reactions.resolve(elem.emote).users.remove(author.id);
                }
            }
            await member.roles.remove(roles);
        }

        await member.roles.add(role.id);
    }

    static async remove(reaction: MessageReaction, author: User) {
        let rr = await Bot.db.collection('rr').findOne({ msg: reaction.message.id })
        if (!rr) return;

        let role = rr.roles.find((val: any) => val.emote === reaction.emoji.name || val.emote === reaction.emoji.id);
        if (!role) return;

        let member = await reaction.message.guild.members.fetch({ user: author, cache: true });
        if (!member) return;
        await member.roles.remove(role.id);
    }
}
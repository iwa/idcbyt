import Bot from '../Client';
import { Message } from "discord.js";
import Command from "../structures/Command";

const flags = new Map([
    ['ADMINISTRATOR', 'Administrator'],
    ['CREATE_INSTANT_INVITE', 'Create Invite'],
    ['KICK_MEMBERS', 'Kick Members'],
    ['BAN_MEMBERS', 'Ban Members'],
    ['MANAGE_CHANNELS', 'Manage Channels'],
    ['MANAGE_GUILD', 'Manager Server'],
    ['ADD_REACTIONS', 'Add Reactions'],
    ['VIEW_AUDIT_LOG', 'View Audit Log'],
    ['PRIORITY_SPEAKER', 'Priority Speaker'],
    ['STREAM', 'Video'],
    ['VIEW_CHANNEL', 'Read Channels'],
    ['SEND_MESSAGES', 'Send Messages'],
    ['SEND_TTS_MESSAGES', 'Send TTS Messages'],
    ['MANAGE_MESSAGES', 'Manage Messages'],
    ['EMBED_LINKS', 'Embed Links'],
    ['ATTACH_FILES', 'Attach Files'],
    ['READ_MESSAGE_HISTORY', 'Read Message History'],
    ['MENTION_EVERYONE', 'Mention @everyone'],
    ['USE_EXTERNAL_EMOJIS', 'Use External Emojis'],
    ['VIEW_GUILD_INSIGHTS', 'View Guild Insights'],
    ['CONNECT', 'Connect'],
    ['SPEAK', 'Speak'],
    ['MUTE_MEMBERS', 'Mute Members'],
    ['DEAFEN_MEMBERS', 'Deafen Members'],
    ['MOVE_MEMBERS', 'Move Members'],
    ['USE_VAD', 'Use Voice Activity'],
    ['CHANGE_NICKNAME', 'Change Nickname'],
    ['MANAGE_NICKNAMES', 'Manage Nicknames'],
    ['MANAGE_ROLES', 'Manage Roles'],
    ['MANAGE_WEBHOOKS', 'Manage Webhooks'],
    ['MANAGE_EMOJIS', 'Manage Emojis'],
]);

export default async function makePermsErrorBetter(msg: Message, cmd: Command) {
    let cleanPerms = [];
    for (const perm of cmd.discordPerm) {
        let cleanPerm = flags.get(perm);

        cleanPerms.push(cleanPerm);
    }

    let iwa = await Bot.fetchIwa();
    return iwa.send({
        'embeds': [{
            'title': '❌ Perms missing',
            'description': `**Server:** \`${msg.guild.name}\`\n**Channel:** \`${msg.channel.isText() ? (msg.channel as any).name : 'dm'}\`\n${cleanPerms.join(', ')}`
        }]
    });
}
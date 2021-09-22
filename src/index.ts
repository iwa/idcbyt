import dotenv from "dotenv";
dotenv.config();

import Bot from './Client';

import { MessageReaction, User, VoiceChannel } from 'discord.js';
import { Manager } from "erela.js";

import Command from './structures/Command';
import makePermsErrorBetter from "./utils/makePermsErrorBetter";
import PermLevels from "./structures/PermLevels";

// Process related Events
process.on('uncaughtException', async exception => Bot.log.error(exception));
process.on('unhandledRejection', async exception => Bot.log.error(exception));

// Bot-User related Events
Bot.on('warn', (warn) => Bot.log.warn(warn));
Bot.on('shardError', (error) => Bot.log.error(error));
Bot.on('shardDisconnect', (event) => Bot.log.debug({ msg: "iwabot disconnected", event: event }));
Bot.on('shardReconnecting', (event) => Bot.log.debug({ msg: "iwabot reconnecting", event: event }));
Bot.on('shardResume', () => { Bot.user.setPresence({ status: 'online', activities: [{ name: '-help', type: 'WATCHING' }] }) });
Bot.once('shardReady', async () => {
    Bot.user.setPresence({ status: 'online', activities: [{ name: '-help', type: 'WATCHING' }] });
    Bot.log.debug(`logged in as ${Bot.user.username}`);

    Bot.music = new Manager({
        nodes: [
            {
                identifier: 'main',
                host: process.env.LAVALINK_HOST,
                port: parseInt(process.env.LAVALINK_PORT, 10),
                password: process.env.LAVALINK_PWD,
                secure: false,
                retryAmount: 10,
                retryDelay: 5000
            },
        ],
        autoPlay: true,
        send(id, payload) {
            const guild = Bot.guilds.cache.get(id);
            if (guild) guild.shard.send(payload);
        },
    }).on("nodeConnect", (node) => Bot.log.info({ msg: 'new lavalink node', node: node.options.identifier }))
        .on("nodeError", (node, error) => Bot.log.error({ msg: `lavalink node error\n${error.message}`, node: node.options.identifier }))
        .on("trackStuck", async (player, track, payload) => {
            let channel: any = Bot.channels.cache.get(player.textChannel);
            if (!channel) return;

            await channel.send(Bot.createEmbed(":x: There's a problem with the track", `Nothing will be played for ${Math.ceil(payload.thresholdMs / 1000)}s`));
        })
        .on("trackError", async (player, track, payload) => {
            let channel: any = Bot.channels.cache.get(player.textChannel);
            if (!channel) return;

            let desc = `Error: ${payload.error}`;
            if (payload.exception)
                desc = `${desc}\nReason: ${payload.exception.message}\nCause: ${payload.exception.cause}`

            await channel.send(Bot.createEmbed(":x: There's a problem with the track", desc));
        })
        .on("queueEnd", async (player) => {
            setTimeout(async () => {
                if (!player.playing)
                    player.destroy();
            }, 300000);
        });

    Bot.music.init(Bot.user.id);

    Bot.on("raw", d => Bot.music.updateVoiceState(d));
});

// Message Event
Bot.on('messageCreate', async (msg) => {
    if (!msg) return;
    if (msg.author.bot) return;
    if (!msg.guild) {
        Bot.log.trace({ msg: 'dm', author: { id: msg.author.id, name: msg.author.tag }, content: msg.cleanContent, attachment: msg.attachments.first() });
        return;
    }
    if (!msg.content.startsWith(Bot.prefix)) return;

    let args = msg.content.slice(1).trim().split(/ +/g);
    let req = args.shift().toLowerCase();
    let cmd: Command = Bot.commands.get(req) || Bot.commands.find((comd) => comd.aliases && comd.aliases.includes(req));

    if (cmd) {
        if (cmd.discordPerm && !msg.guild.me.permissions.has(cmd.discordPerm)) {
            makePermsErrorBetter(msg, cmd);
            return;
        }

        if (cmd.permLevel == PermLevels.Iwa && msg.author.id == process.env.IWA)
            await cmd.run(msg, args);
        else if (cmd.permLevel == PermLevels.DJ &&
            (msg.member.roles.cache.find((role) => role.name.toLowerCase() === "dj") ||
                msg.member.permissions.has('ADMINISTRATOR')))
            await cmd.run(msg, args);
        else if (cmd.permLevel == PermLevels.Everyone)
            await cmd.run(msg, args);
    }
});

// VC Check if Bot's alone
Bot.on('voiceStateUpdate', async (oldState, newState) => {
    let channel = oldState.channel;
    if (!channel) return;

    if (oldState.id === Bot.user.id && newState.id === Bot.user.id) {
        if (!newState.channel) {
            let player = Bot.music.players.get(oldState.guild.id);

            if (player)
                player.destroy();
        }
    }

    let members = channel.members;
    if (members.size === 1)
        if (members.has(Bot.user.id)) {
            let voiceChannel = oldState.channel;
            if (!voiceChannel) return;

            const player = Bot.music.players.get(voiceChannel.guild.id);

            if (player) {
                setTimeout(async () => {
                    let voiceChan = await Bot.channels.fetch(player.voiceChannel);
                    if (!voiceChan) return player.destroy();

                    if ((voiceChan as VoiceChannel).members.size === 1) {
                        player.destroy();
                        Bot.log.info({ msg: 'auto stop', guild: { id: voiceChannel.guild.id, name: voiceChannel.guild.name } })
                    }
                }, 300000);
            }
        }
});

// VC Region Update
Bot.on('channelUpdate', async (oldChannel: VoiceChannel, newChannel: VoiceChannel) => {
    if (oldChannel.type === 'GUILD_VOICE' && newChannel.type === 'GUILD_VOICE') {
        let player = Bot.music.players.get(newChannel.guild.id);

        if (player) {
            if (player.voiceChannel === newChannel.id) {
                if (player.playing && !player.paused) {
                    player.pause(true);
                    setTimeout(() => {
                        player.pause(false);
                    }, 500);
                }
            }
        }
    }
});


// Login
Bot.start(process.env.TOKEN);
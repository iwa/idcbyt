import { Collection, Client, Intents } from "discord.js";
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { SlashCommandBuilder } from '@discordjs/builders';

import log from './Logger';
import { Manager } from 'erela.js';
import fs from 'fs';
import SlashCommand from "./structures/SlashCommand";
import createEmbed from "./utils/createEmbed";

export default new class Bot extends Client {

    public prefix = process.env.PREFIX;
    public version: string = require('child_process')
        .execSync('git rev-parse --short HEAD')
        .toString().trim();

    public log = log;
    private Rest = new REST({ version: '9' });

    public commands: Collection<string, SlashCommand> = new Collection();

    public music: Manager;

    public createEmbed = createEmbed;

    public constructor() {
        super({
            retryLimit: 5,
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
        });
    }

    public async fetchIwa() {
        let iwa = await this.users.fetch(process.env.IWA, { cache: true });
        return iwa;
    }

    private async registerSlashCommands() {
        /*
        const data: ApplicationCommandData[] = [];
        for (const cmd of this.commands)
            data.push({ name: cmd[1].name, description: cmd[1].desc });

        if (process.env.NODE_ENV === 'production')
            await this.application?.commands.set(data).then(() => this.log.trace('slash commands registered'));
        else
            await this.guilds.cache.get('449334887019970570')?.commands.set(data).then(() => this.log.trace('slash commands registered'));
        */


        if (process.env.NODE_ENV !== "production") {
            try {
                console.log('Started refreshing application (/) commands.');

                const slashs: any[] = [];
                for (const cmd of this.commands) {
                    if (cmd[1].options != null) {
                        slashs.push(cmd[1].toJSON());

                        for (const alias of cmd[1].aliases) {
                            const data = new SlashCommandBuilder()
                                .setName(alias)
                                .setDescription(cmd[1].description)

                            const d = new SlashCommand({
                                name: alias,
                                description: cmd[1].description
                            })

                            data.set
                        }

                        console.log(`slash: ${cmd[0]}`);
                    }
                }

                await this.Rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.DEV_GUILD),
                    { body: slashs },
                );

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
        }
    }

    private async _init() {
        fs.readdir('./build/commands/', { withFileTypes: true }, (error, f) => {
            if (error) return log.error(error);
            f.forEach(async (f) => {
                if (f.isDirectory()) {
                    fs.readdir(`./build/commands/${f.name}/`, (error, fi) => {
                        if (error) return log.error(error);
                        fi.forEach(async (fi) => {
                            if (!fi.endsWith(".js")) return;
                            let commande: SlashCommand = (await import(`./commands/${f.name}/${fi}`)).default;
                            console.log(commande);
                            this.commands.set(commande.name, commande);
                        })
                    })
                } else {
                    if (!f.name.endsWith(".js")) return;
                    let commande: SlashCommand = (await import(`./commands/${f.name}`)).default;
                    this.commands.set(commande.name, commande);
                }
            });
        });
        this.log.debug('commmands initialized');

        setTimeout(async () => {
            await this.registerSlashCommands();
            this.log.debug('slash commands ok');
        }, 2000);
    }

    public async start(token: string) {
        this.Rest.setToken(token);
        await this._init();
        await this.login(token);
    }
}
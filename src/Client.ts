import { Collection, Client, Intents } from "discord.js";
import log from './Logger';
import { Manager } from 'erela.js';
import fs from 'fs';
import Command from "./structures/Command";
import createEmbed from "./utils/createEmbed";

export default new class Bot extends Client {

    public prefix = process.env.PREFIX;
    public version: string = require('child_process')
        .execSync('git rev-parse --short HEAD')
        .toString().trim();

    public log = log;

    public commands: Collection<string, Command> = new Collection();

    public music: Manager;

    public createEmbed = createEmbed;

    public constructor() {
        super({
            retryLimit: 5,
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
            failIfNotExists: false,
            shards: "auto",
            presence: {
                status: 'online',
                activities: [{ name: '-help', type: 'WATCHING' }]
            }
        });
    }

    public async fetchIwa() {
        let iwa = await this.users.fetch(process.env.IWA, { cache: true });
        return iwa;
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
                            let commande: Command = (await import(`./commands/${f.name}/${fi}`)).default;
                            this.commands.set(commande.name, commande);
                        })
                    })
                } else {
                    if (!f.name.endsWith(".js")) return;
                    let commande: Command = (await import(`./commands/${f.name}`)).default;
                    this.commands.set(commande.name, commande);
                }
            });
        });
        this.log.debug('commmands initialized');
    }

    public async start(token: string) {
        await this._init();
        await this.login(token);
    }
}
import { PermissionString } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders';
import CommandOptions from "./CommandOptions";
import PermLevels from "./PermLevels";

export default class Command extends SlashCommandBuilder {

    public readonly run: Function;
    public readonly permLevel: PermLevels;
    public readonly aliases: readonly string[];
    public readonly discordPerm: PermissionString[];

    constructor(options: CommandOptions) {
        super();
        this.setName(options.name);
        this.setDescription(options.description);

        this.run = options.function;
        this.permLevel = options.permLevel;
        this.aliases = options.aliases || [];
        this.discordPerm = options.discordPerm || [];
    }
}
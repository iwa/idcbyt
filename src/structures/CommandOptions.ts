import { PermissionString } from "discord.js";
import PermLevels from "./PermLevels";

export default class CommandOptions {
    public readonly name: string;
    public readonly description: string;
    public readonly function: Function;
    public readonly permLevel: PermLevels;
    public readonly aliases: readonly string[];
    public readonly discordPerm: PermissionString[];
}
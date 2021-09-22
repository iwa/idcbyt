import { MessageEmbed } from 'discord.js';

const COLOR = "#2F3136";

export default function createEmbed(title?: string, desc?: string, footer?: string, author?: { name: string, url?: string }, thumbnail?: string) {
    const embed = new MessageEmbed()
        .setColor(COLOR);

    if (title)
        embed.setTitle(title);

    if (desc)
        embed.setDescription(desc);

    if (footer)
        embed.setFooter(footer);

    if (author)
        embed.setAuthor(author.name, author.url);

    if (thumbnail)
        embed.setThumbnail(thumbnail);

    return { embeds: [embed] };
}
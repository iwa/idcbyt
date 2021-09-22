import Bot from '../Client';
import { TextChannel } from 'discord.js';

export default async function ready() {
    Bot.user.setStatus('idle');

    let allMsg = await Bot.db.collection('rr').find().toArray();
    if (allMsg) {
        allMsg.forEach(async (elem) => {
            let channel = await Bot.channels.fetch(elem.channel, { cache: true }).catch(() => { return; });
            if (channel && channel.type === 'GUILD_TEXT') {
                let msg = await (channel as TextChannel).messages.fetch(elem._id, { cache: true }).catch(() => { return; });
                if (!msg)
                    await Bot.db.collection('rr').deleteOne({ _id: elem._id });
            } else
                await Bot.db.collection('rr').deleteOne({ _id: elem._id });
        });
    }
}
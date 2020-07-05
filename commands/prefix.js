const ytdl = require('ytdl-core');
const queueVoice = require('../models/queueChannel.js');
exports.run = async (bot, message, args) => {
    let queueChannel = await queueVoice.findOne({
        guildID: message.guild.id
      });
    if(!queueChannel) {
        queueChannel = new queueVoice({
            guildID: message.guild.id,
            queue: [""],
            voiceID: message.member.voice.channel.id,
            songNum: 0,
            songType: "none",
            interval: "none",
            play: true,
            prefix: "!"
        });
    }
    if(!args[0]){
        message.channel.send(`🚨 Current prefix is \`${queueChannel.prefix}\``)
    } else {
        queueChannel.prefix = args.join(" ");
        message.channel.send(`🎧 Changed prefix to \`${args.join(" ")}\``)
        await queueChannel.save().catch(e => console.log(e));
    }
}
module.exports.config = {
    name: "prefix",
    description: "Changes the server's prefix for the bot",
    accessableby: "Everyone",
    usage: "prefix <prefix>",
    aliases: ["prefix"]
}
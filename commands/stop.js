const queueVoice = require('../models/queueChannel.js');
exports.run = async (bot, message, args) => {
    let queueGuild = await queueVoice.findOne({
        guildID: "42069"
      });
    if(queueGuild.guilds.includes(message.guild.id)){
        let queueChannel = await queueVoice.findOne({
            guildID: message.guild.id
          });
          const channel = bot.channels.cache.get(queueChannel.voiceID);
          channel.leave();
        queueGuild.guilds.splice(queueGuild.guilds.indexOf(message.guild.id), 1)
        queueChannel.running =false;
        message.channel.send(`⏹️ Stopped playing Animal Crossing :CC`)
        await queueGuild.save().catch(e => console.log(e));
        await queueChannel.save().catch(e => console.log(e));
    } else {
      let queueChannel = await queueVoice.findOne({
        guildID: message.guild.id
      });
      queueChannel.running = false;
      await queueChannel.save().catch(e => console.log(e));
      return message.channel.send(`<:xcross:690880230562201610> bro I'm not even playing anything`)
    }
}
module.exports.config = {
    name: "stop",
    description: "Stops and deletes 24h queue",
    accessableby: "Everyone",
    usage: "stop",
    aliases: ["delete", "fuckoff", "remove", "clear"]
}

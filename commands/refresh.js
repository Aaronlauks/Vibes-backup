const ytdl = require('ytdl-core');
const queueVoice = require('../models/queueChannel.js');
exports.run = async (bot, message, args) => {
  let queueChannel = await queueVoice.findOne({
      guildID: message.guild.id
    });
    let queueGuild = await queueVoice.findOne({
      ID: "42069"
    });
    if(queueChannel){
      let songNum
      if(queueChannel.songNum != 0){
      if(new Date().getMinutes() > 29){
          songNum = ((new Date().getHours() + +queueChannel.songNum) * 2) - 1;
          queueChannel.play = true;
      } else {
          songNum = ((new Date().getHours() + +queueChannel.songNum) * 2) - 2;
          queueChannel.play = false;
      } 
      if(new Date().getHours() + +queueChannel.songNum < 1) songNum += +48;
  } else {
      if(new Date().getMinutes() > 29){
          songNum = new Date().getHours() * 2 - 1;
          queueChannel.play = true;
      } else {
          songNum = new Date().getHours() * 2 - 2;
          queueChannel.play = false;
      } 
      if(new Date().getHours() == 0) songNum += +48;
  }
  const channel = bot.channels.cache.get(queueChannel.voiceID);
      if (channel) {
        let music = queueChannel.queue[songNum];
      await channel.join().then(async connection => {
          await connection.play(ytdl(music));
          message.channel.send(`<:tickGreen:690880245611626597> Reloaded!`)
          console.log(bot.guilds.cache.get(message.guild.id).name, queueChannel.songNum, new Date().getMinutes(), new Date().getSeconds())
      });
      } else {
        console.log(`deleted ${message.guild.id}`)
        queueGuild.queue.splice(queueGuild.queue.indexOf(message.guild.id), 1);
        message.channel.send(`<:xcross:690880230562201610> bro I'm not even playing anything`)
      }
    } else {
      console.log(`deleted ${message.guild.id}`)
      queueGuild.queue.splice(queueGuild.queue.indexOf(message.guild.id), 1);
      message.channel.send(`<:xcross:690880230562201610> bro I'm not even playing anything`);
    }
    await queueChannel.save().catch(e => console.log(e));
    await queueGuild.save().catch(e => console.log(e));
}
module.exports.config = {
    name: "refresh",
    description: "Refreshes the current song (use this if song suddenly stops D:)",
    accessableby: "Everyone",
    usage: "!refresh",
    aliases: ["reload", "ref", "load"]
}
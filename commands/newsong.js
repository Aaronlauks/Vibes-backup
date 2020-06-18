const ytdl = require('ytdl-core');
const queueVoice = require('../models/queueChannel.js');
exports.run = async (bot, guildID) => {
    let queueChannel = await queueVoice.findOne({
        guildID: guildID
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
            console.log(queueChannel.songNum, songNum, new Date().getMinutes(), new Date().getSeconds())
        });
        } else {
          console.log(`deleted ${guildID}`)
          queueGuild.queue.splice(queueGuild.queue.indexOf(guildID), 1);
        }
      } else {
        console.log(`deleted ${guildID}`)
        queueGuild.queue.splice(queueGuild.queue.indexOf(guildID), 1);
      }
      await queueChannel.save().catch(e => console.log(e));
      await queueGuild.save().catch(e => console.log(e));
}
module.exports.config = {
    name: "NEWSONG",
    description: "dont use this command",
    accessableby: "Everyone",
    usage: "!refresh",
    aliases: []
}
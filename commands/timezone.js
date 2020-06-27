const ytdl = require('ytdl-core');
const queueVoice = require('../models/queueChannel.js');
exports.run = async (bot, message, args) => {
    let selectTime = "";
    let queueChannel = await queueVoice.findOne({
        guildID: message.guild.id
      });
    if(!queueChannel) {
        queueChannel = new queueVoice({
            guildID: message.guild.id,
            queue: [""],
            voiceID: message.member.voice.channel.id,
            songNum: 0,
            play: true,
            prefix: "!"
        });
    }
    if(!args[0]){
        if(queueChannel.songNum == 0){
            message.channel.send(`🕐 Timezone set at **GMT±00:00**! (default timezone)`)
        } else if(queueChannel.songNum > 0 && queueChannel.songNum < 10){
            message.channel.send(`🕐 Timezone set at **GMT+0${queueChannel.songNum}:00**!`)
        } else if(queueChannel.songNum > 10){
            message.channel.send(`🕐 Timezone set at **GMT+${queueChannel.songNum}:00**!`)
        } else if(queueChannel.songNum > -9){
            let gmtNum = Math.abs(queueChannel.songNum)
            message.channel.send(`🕐 Timezone set at **GMT-0${gmtNum}:00**!`)
        } else {
            message.channel.send(`🕐 Timezone set at **GMT${queueChannel.songNum}:00**!`)
        }
        return
    } else {
        let argsArgs = args[0].split("");
        if(argsArgs.length > 2){
            if(argsArgs[argsArgs.length - 2].toUpperCase() + argsArgs[argsArgs.length - 1].toUpperCase() == "PM"){
                    argsArgs.splice(argsArgs.length - 1, 1);
                    argsArgs.splice(argsArgs.length - 1, 1);
                    let newArgs = argsArgs.join("");
                    if(newArgs < 1 || newArgs > 12) return message.channel.send(`<:xcross:690880230562201610> not a valid time lol`);
                    if(newArgs == 12) newArgs -= 12;
                    selectTime = newArgs - new Date().getHours() + 12;
            } else if(argsArgs[argsArgs.length - 2].toUpperCase() + argsArgs[argsArgs.length - 1].toUpperCase() == "AM"){
                argsArgs.splice(argsArgs.length - 1, 1);
                argsArgs.splice(argsArgs.length - 1, 1);
                let newArgs = argsArgs.join("");
                if(newArgs < 1 || newArgs > 12) return message.channel.send(`<:xcross:690880230562201610> not a valid time lol`);
                if(newArgs == 12) newArgs = 12 + parseInt(newArgs);
                selectTime = newArgs - new Date().getHours();
            } else return message.channel.send(`<:xcross:690880230562201610> not a valid time lol`);
        } else if(args[0] > 0 && args[0] < 25) {
            selectTime = args[0] - new Date().getHours();
        } else return message.channel.send(`<:xcross:690880230562201610> not a valid time lol`);
    }
    if(isNaN(selectTime)) message.channel.send(`<:xcross:690880230562201610> not a valid time lol`);
    console.log(selectTime);
    queueChannel.songNum = selectTime;
    if(queueChannel.songNum == 0){
        message.channel.send(`⏱️ Timezone is set at **GMT±00:00** (default timezone)`)
    } else if(queueChannel.songNum > 0 && queueChannel.songNum < 10){
        message.channel.send(`⏱️ Timezone is set at **GMT+0${queueChannel.songNum}:00**`)
    } else if(queueChannel.songNum > 10){
        message.channel.send(`⏱️ Timezone is set at **GMT+${queueChannel.songNum}:00**`)
    } else if(queueChannel.songNum > -9){
        let gmtNum = Math.abs(queueChannel.songNum)
        message.channel.send(`⏱️ Timezone is set at **GMT-0${gmtNum}:00**`)
    } else {
        message.channel.send(`⏱️ Timezone is set at **GMT${queueChannel.songNum}:00**`)
    }
    await queueChannel.save().catch(e => console.log(e));
}
module.exports.config = {
    name: "timezone",
    description: "Shows the timezone set on vibes. You can also manually set the timezone of your country to sync with the Animal Crossing songs",
    accessableby: "Everyone",
    usage: "timezone <time>",
    aliases: ["time", "zone"]
}
const queueVoice = require('../models/queueChannel.js');

exports.run = async (bot, message, args) => {
  let guildID = message.guild.id;
    if (message.member.voice.channel) {
        let queueGuild = await queueVoice.findOne({
            guildID: "42069"
          });
          if(!queueGuild){
          queueGuild = new queueVoice({
            guildID: "42069",
            guilds: [`${message.guild.id}`]
          });
          } else if(!queueGuild.guilds.includes(message.guild.id))queueGuild.guilds.push(message.guild.id)
          await queueGuild.save().catch(e => console.log(e));

          let selectTime;
          let time;
          let error = false;
          if(!args[0]){
            selectTime = 0;
          } else {
            if(isNaN(args[0]) && (args[0].includes("AM") || args[0].includes("PM") || args[0].includes("am") || args[0].includes("pm"))){
                if(args[0].includes("AM") || args[0].includes("am")){
                  time = args[0].replace("AM", "");
                  time = args[0].replace("am", "");
                  if(time > 0 && time < 13){
                    selectTime = new Date().getHours() - time;
                    time+="AM"
                  } else error = true;
                } else {
                  time = args[0].replace("PM", "");
                  time = args[0].replace("pm", "");
                  if(time > 0 && time < 13){
                    selectTime = new Date().getHours() - time;
                    time+="PM"
                  } else error = true;
                }
              } else error = true;
          }
          if(error){
            message.channel.send(`invalid time`)
            let queueChannel = await queueVoice.findOne({
              guildID: message.guild.id
            });
            queueChannel.running = false;
            return await queueChannel.save().catch(e => console.log(e));
          }
        let stop = false;
        let connection = await message.member.voice.channel.join().catch(e => {
            message.channel.send(`<:xcross:690880230562201610> Couldn't connect to voice channel!`)
            stop = true;
        })
        if(!stop){
        let queueChannel = await queueVoice.findOne({
            guildID: message.guild.id
          });
        if(!queueChannel) {
            return message.channel.send(`Error! Please rerun this command!`)
        } else {
            if(args[0]) queueChannel.timezone = selectTime;
            queueChannel.songType = "Animal Crossing **City Folk**";
            queueChannel.voiceID = message.member.voice.channel.id;
            queueChannel.running = false;
        }
        const dispatcher = connection.play(`./Music/ACCF/${time}.mp3`);
        console.log(selectTime)
        dispatcher.on("finish",async function(){
          let command = bot.commands.get("NEWSONG");
          command.run(bot, message, guildID);
        });
        dispatcher.on('error', error => {
            console.log(error)
        });
        await queueChannel.save().catch(e => console.log(e));
        message.channel.send(`<:tickGreen:690880245611626597> playing Animal Crossing **City Folk**!`);
      } else {
        let queueChannel = await queueVoice.findOne({
            guildID: message.guild.id
          });
          queueChannel.running = false;
          await queueChannel.save().catch(e => console.log(e));
      }
    } else return message.channel.send('<:xcross:690880230562201610> You need to join a voice channel first!');
}
module.exports.config = {
    name: "accf",
    description: "Changes the queue to the 24h playlist of Animal Crossing City Folk.\nYou can also add the time of the day you want to play by stating the time of your choice (This will also automatically set the timezone to the time stated).",
    accessableby: "Everyone",
    usage: "accf <timezone>",
    aliases: ["cf", "cityfolk"]
}
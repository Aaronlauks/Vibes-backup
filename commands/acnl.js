const ytdl = require('ytdl-core');
const queueVoice = require('../models/queueChannel.js');
let ACNL = [
    'https://www.youtube.com/watch?v=uX2NxSN49Tg',//1AM    0
    'https://www.youtube.com/watch?v=uX2NxSN49Tg',//       1
    'https://www.youtube.com/watch?v=LAioanQMG_A',//2AM    2
    'https://www.youtube.com/watch?v=LAioanQMG_A', //      3
    'https://www.youtube.com/watch?v=_pCBzrFnTlw',//3AM    4
    'https://www.youtube.com/watch?v=_pCBzrFnTlw',//       5
    'https://www.youtube.com/watch?v=eSfQrWXD94A',//4AM    6
    'https://www.youtube.com/watch?v=eSfQrWXD94A',//       7
    'https://www.youtube.com/watch?v=zQLvrhUXwtE',//5AM    8
    'https://www.youtube.com/watch?v=zQLvrhUXwtE',//       9
    'https://www.youtube.com/watch?v=mWa-tiP3a_o',//6AM    10
    'https://www.youtube.com/watch?v=mWa-tiP3a_o',//       11
    'https://www.youtube.com/watch?v=-CtfRww-2YM',//7AM    12
    'https://www.youtube.com/watch?v=-CtfRww-2YM',//       13
    'https://www.youtube.com/watch?v=OHxpIqpAjz0',//8AM    14
    'https://www.youtube.com/watch?v=OHxpIqpAjz0',//       15
    'https://www.youtube.com/watch?v=T9ieUkNOEf4',//9AM    16
    'https://www.youtube.com/watch?v=T9ieUkNOEf4',//       17
    'https://www.youtube.com/watch?v=25wXOGbmWOc',//10AM   18
    'https://www.youtube.com/watch?v=25wXOGbmWOc',//       19
    'https://www.youtube.com/watch?v=TPFZhtkP7M0',//11AM   20
    'https://www.youtube.com/watch?v=TPFZhtkP7M0',//       21
    'https://www.youtube.com/watch?v=vZVS2FtVWHA',//12PM   22
    'https://www.youtube.com/watch?v=vZVS2FtVWHA',//       23
    'https://www.youtube.com/watch?v=G3rtW1G2Ixg',//1PM    24
    'https://www.youtube.com/watch?v=G3rtW1G2Ixg',//       25
    'https://www.youtube.com/watch?v=LiXoQXCFhF8',//2PM    26
    'https://www.youtube.com/watch?v=LiXoQXCFhF8',//       27
    'https://www.youtube.com/watch?v=CM58GBw4JkE',//3PM    28
    'https://www.youtube.com/watch?v=CM58GBw4JkE',//       29
    'https://www.youtube.com/watch?v=wqaKOCbeXmY',//4PM    30
    'https://www.youtube.com/watch?v=wqaKOCbeXmY',//       31
    'https://www.youtube.com/watch?v=HXG9zU2Lb6g',//5PM    32
    'https://www.youtube.com/watch?v=HXG9zU2Lb6g',//       33
    'https://www.youtube.com/watch?v=iLSwc8wgJeo',//6PM    34
    'https://www.youtube.com/watch?v=iLSwc8wgJeo',//       35
    'https://www.youtube.com/watch?v=rmtKHo7GB64',//7PM    36
    'https://www.youtube.com/watch?v=rmtKHo7GB64',//       37
    'https://www.youtube.com/watch?v=DhrsQO9Pkbs',//8PM    38
    'https://www.youtube.com/watch?v=DhrsQO9Pkbs',//       39
    'https://www.youtube.com/watch?v=Fl4M-a3eBnw',//9PM    40
    'https://www.youtube.com/watch?v=Fl4M-a3eBnw',//       41
    'https://www.youtube.com/watch?v=tEWFq1_NVSg',//10PM   42
    'https://www.youtube.com/watch?v=tEWFq1_NVSg',//       43
    'https://www.youtube.com/watch?v=ytHqYVbuLt4',//11PM   44
    'https://www.youtube.com/watch?v=ytHqYVbuLt4',//       45
    'https://www.youtube.com/watch?v=A_00O4KWBxY',//12AM   46
    'https://www.youtube.com/watch?v=A_00O4KWBxY'
  ]

exports.run = async (bot, message, args) => {
    if (message.member.voice.channel) {
        let queueGuild = await queueVoice.findOne({
            ID: "42069"
          });
          if(!queueGuild.queue){
              queueGuild.queue = [`${message.guild.id}`]
          } else if(!queueGuild.queue.includes(message.guild.id))queueGuild.queue.push(message.guild.id)
          await queueGuild.save().catch(e => console.log(e));
        let selectTime;
        let connection = await message.member.voice.channel.join()
        let queueChannel = await queueVoice.findOne({
            guildID: message.guild.id
          });
        if(!queueChannel) {
            queueChannel = new queueVoice({
                guildID: message.guild.id,
                queue: ACNL,
                voiceID: message.member.voice.channel.id,
                songNum: 1,
                play: true
            });
        } else {
            queueChannel.queue = ACNL;
            queueChannel.voiceID = message.member.voice.channel.id;
        }
        message.channel.send(`<:tickGreen:690880245611626597> playing Animal Crossing New Leaf!`)
        if(!args[0]) {
            message.channel.send(`_ _\n**Tip:** Enter the hour your timezone to sync with the Animal Crossing music! \`e.g. 2PM = !acnl 14, 5AM = !acnl 5am\` (default timezone is US)`);
            selectTime = 0;
        } else {
            let argsArgs = args[0].split("");
            if(argsArgs.length > 2){
                if(argsArgs[argsArgs.length - 2].toUpperCase() + argsArgs[argsArgs.length - 1].toUpperCase() == "PM"){
                        argsArgs.splice(argsArgs.length - 1, 1);
                        argsArgs.splice(argsArgs.length - 1, 1);
                        let newArgs = argsArgs.join("");
                        if(newArgs < 1 || newArgs > 12) return message.channel.send(`<:xcross:690880230562201610> not a valid time lol`);
                        selectTime = newArgs - new Date().getHours() + 12;
                } else if(argsArgs[argsArgs.length - 2].toUpperCase() + argsArgs[argsArgs.length - 1].toUpperCase() == "AM"){
                    argsArgs.splice(argsArgs.length - 1, 1);
                    argsArgs.splice(argsArgs.length - 1, 1);
                    let newArgs = argsArgs.join("");
                    if(newArgs < 1 || newArgs > 12) return message.channel.send(`<:xcross:690880230562201610> not a valid time lol`);
                    selectTime = newArgs - new Date().getHours();
                }
            } else if(args[0] > 0 && args[0] < 25) {
                selectTime = args[0] - new Date().getHours();
            } else selectTime = 0;
        }
        if(new Date().getMinutes() > 29){
            queueChannel.songNum = ((new Date().getHours() + selectTime) * 2) - 1;
            queueChannel.play = true;
        } else {
            queueChannel.songNum = ((new Date().getHours() + selectTime) * 2) - 2;
            queueChannel.play = false;
        } 
        console.log(queueChannel.songNum, new Date().getMinutes(), new Date().getSeconds())
        let music = queueChannel.queue[queueChannel.songNum];
        let dispatcher = await connection.play(ytdl(music));
                dispatcher.on("end", end => {
                    console.log('song end')
                });
                queueChannel.songNum++;
                
                await queueChannel.save().catch(e => console.log(e));
                
      } else return message.channel.send('<:xcross:690880230562201610> You need to join a voice channel first!');
}
module.exports.config = {
    name: "acnl",
    description: "Join VC",
    accessableby: "Everyone",
    aliases: ["nl", "newleaf"]
}
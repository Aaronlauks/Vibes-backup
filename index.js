var discord = require('discord.js');
var bot = new discord.Client();
const fs = require('fs');
const config = require("./config.json");
const mongoose = require('mongoose');
const queueVoice = require('./models/queueChannel.js');
const gay = ["accf", "acnl", "acnh", "acgcn", "reload"]
let startPlay = true;
mongoose.connect(config.mongodb, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

bot.aliases = new discord.Collection();
bot.commands = new discord.Collection();

fs.readdir("./commands/", (err, files) => {
  let jsfile = files.filter(f => f.split(".").pop() === "js")
  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    bot.commands.set(props.config.name, props);
    props.config.aliases.forEach(aliases => {
      bot.aliases.set(aliases, props.config.name);
    });
  });
});

bot.on("ready", async () => {
    console.log(`Logged in as ${bot.user.tag}`);
    if(new Date().getDate() > 20) return process.exit(8);
    bot.user.setActivity('Animal Crossing :)', {
        type: "STREAMING",
        url: "https://www.twitch.tv/AaronBotDiscord"
      });
      let queueGuild = await queueVoice.findOne({
        ID: "42069"
      });
      queueGuild.guilds.forEach(guildID => {
        console.log("running newsong", message.guild.name)
          let command = bot.commands.get("NEWSONG");
          command.run(bot, message, guildID);
      });
});

bot.on('message', async message => {
  let queueChannel = await queueVoice.findOne({
    guildID: message.guild.id
  });
  if(!queueChannel) {
    queueChannel = new queueVoice({
        guildID: message.guild.id,
        voiceID: "",
        songType: "",
        timezone: "",
        prefix: "!",
        running: false,
        loop: ""
    });
    await queueChannel.save().catch(e => console.log(e));
  }

  let prefix = queueChannel.prefix;
    if (!message.content.toLowerCase().startsWith(prefix)) return;
    let sender = message.author;
    let args = message.content.slice(prefix.length).trim().split(/ +/g); //args is the inputs after the cmd(a$say | test: |,test)
    let cmd = args.shift().toLowerCase(); //cmd is the command name (a help: help)
    let command;
    if (sender.bot) return;
    try {
      if(bot.commands.has(cmd)){
        command = bot.commands.get(cmd);
      } else {
        command = bot.commands.get(bot.aliases.get(cmd));
      }
      if(gay.includes(cmd)){
          if(queueChannel.running){
            message.channel.send(`<a:loading:773028345709068298> **CHILL IT.** The song is still loading...`)
            .then(m => {
              m.delete({timeout: 3000});
            });
          } else {
            queueChannel.running = true;
            await queueChannel.save().catch(e => console.log(e));
            command.run(bot, message, args);
          }
      } else {
        command.run(bot, message, args);
      }
    } catch (e) {
      console.log(`${cmd} is not a command`);
    } finally {
      console.log(`${message.author.username} ran the command: ${cmd}`);
    }
});

bot.on('message', async message => { //this event is fired, whenever the bot sees a new message
  let queueChannel = await queueVoice.findOne({
    guildID: message.guild.id
  });
  if(message.content.match(/^<@!?(\d+)>$/) && !message.author.bot){
    let match = message.content.match(/^<@!?(\d+)>$/);
    if(match[1] == "696032366845624392"){
      let prefix = "!";
      if (queueChannel) prefix = queueChannel.prefix 
      return message.channel.send(`H-hey **my prefix is **\`${prefix}\``)
    }
  }
  
});

bot.login(process.env.BOT_TOKEN);
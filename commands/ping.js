const discord = require('discord.js')
exports.run = (bot, message, args) => {
    const loading = bot.emojis.find(emoji => emoji.name === "loading") 
    message.channel.send(`<a:loading:${loading.id}> Pinging...`).then(m => {
        const ping = m.createdTimestamp - message.createdTimestamp
        const embed = new discord.MessageEmbed()
        .setColor('#'+(Math.random()*0xFFFFFF<<0).toString(16))
        .setAuthor(`Ping!`, `https://i.redd.it/ndozdv59jsx21.png`)
        .addField(`Bot latency`, `${ping}ms`, false)
        .addField(`API latency`, `${bot.ws.ping}ms`, false)
        console.log(`console is working too`)
    })
}
module.exports.config = {
    name: "ping",
    description: "ping!!!!!!!!!!!",
    accessableby: "Everyone",
    usage: 'ping',
    aliases: ["pong"]
}
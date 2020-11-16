const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  guildID: String,
  queue: Array,
  voiceID: String,
  songType: String,
  timezone: String,
  prefix: String,
  running: Boolean,
  playing: Boolean
});

module.exports = mongoose.model("queueChannel", messageSchema);
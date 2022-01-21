const mongoose = require('mongoose');


const economySchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },
  economyBalance: {
    type: String,
    default: "0"
  }
});


module.exports.schema = mongoose.model('economies', economySchema);
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

module.exports = mongoose.model('economies', economySchema);
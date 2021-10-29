const settingsSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },
  botAdminRoleId: {
    type: String,
    default: 'none'
  }
});

module.exports = mongoose.model('guild_settings', settingsSchema);
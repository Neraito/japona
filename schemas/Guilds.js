const guildsSchema = new mongoose.Schema({
  guildId: {
    type: String,
    required: true
  },
  permissionLvls: [
    {
      type: String,
      required: true
    }
  ],
  commandsPermissions: {
    type: Map,
    of: {
      lvl: {
        type: Number,
        required: true
      },
      roles: [
        { type: String }
      ]
    }
  }
});

module.exports = mongoose.model('guilds', guildsSchema);
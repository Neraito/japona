const profileSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  balance: {
    type: String,
    default: "0"
  }
});

module.exports = mongoose.model('profiles', profileSchema);
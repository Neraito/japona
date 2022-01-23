const mongoose = require('mongoose');


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
  },
  disabledCommands: [
    { type: String }
  ]
});

const Model = mongoose.model('guilds', guildsSchema);
module.exports = Model;


module.exports.create = async (guildId) => {
  console.log("добавляем новый сервер в бд");
  
  /*const lvls = [];
  for (let i = 0; i < 10; i++) lvls.push(null);
  
  const data = {
    guildId: guildId,
    permissionLvls: lvls,
  }
  
  const result = Model.find({ guildId: guildId });
  if (!result) Model.create({ data });*/
  
};
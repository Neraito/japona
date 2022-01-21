const mongoose = require('mongoose');


module.exports = async () => {
  
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('[SUCCESS] Успешное подключение к MongoDB!');
  }
  catch (err) {
    console.log('[ERROR] Проблемы с подключением к MongoDB!\n' + err);
  }
  
};


const Guilds = require(`./general/Guilds.js`);
const Profile = require(`./general/Profile.js`);
const Economy = require(`./economy/Economy.js`);

module.exports.schemas = {
  
  Guilds: Guilds,
  Profile: Profile,
  Economy: Economy
  
};
const fs = require('fs');
const economySystem = require('./economySystem.js')

module.exports = async () => {
  const commandFiles = fs.readdirSync('./bot modules/Economy/commands').filter(file => file.endsWith('.js'));

  for (let file of commandFiles) {
    let command = require(`./commands/${file}`);
    client.commands.set(command.cmd.data.name, command.cmd);
  }

  for (let file of commandFiles) {
    let command = require(`./commands/${file}`);
    if (command.btn) {
      for (let button of command.btn) {
        client.buttons.set(button.name, button);
      }
    }
  }
  
  economySystem.mining();
}
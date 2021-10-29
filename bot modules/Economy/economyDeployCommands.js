const fs = require('fs');

module.exports = (commands) => {
  const commandFiles = fs.readdirSync('./bot modules/Economy/commands').filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.cmd.data.toJSON());
  }
}
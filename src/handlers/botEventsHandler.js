const fs = require('fs');


module.exports = async () => {
  
	const events = fs.readdirSync(`${__main}/events`).filter(f => f.startsWith('bot.') && f.endsWith('.js'));		
  
	for (let event of events) {
		event = require(`${__main}/events/${event}`);
		if (event.once) bot.once(event.name, (...args) => event.execute(...args));
		else bot.on(event.name, (...args) => event.execute(...args));
	}
  
};
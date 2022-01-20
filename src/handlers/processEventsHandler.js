const fs = require('fs');


module.exports = async () => {
  
  const events = fs.readdirSync(`${__main}/events`).filter(f => f.startsWith('proc.') && f.endsWith('.js'));
  
  for (let event of events) {
    
    event = require(`${__main}/events/${event}`);
    if (event.once) process.once(event.name, (...args) => event.execute(...args));
    else process.on(event.name, (...args) => event.execute(...args));
    
  }
  
};
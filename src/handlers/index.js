const botEventsHandler = require(`${__main}/handlers/botEventsHandler.js`);
const processEventsHandler = require(`${__main}/handlers/processEventsHandler.js`);


module.exports = async () => {
  
  botEventsHandler();
  processEventsHandler();
  
};
const botEventsHandler = require(`./botEventsHandler.js`);
const processEventsHandler = require(`./processEventsHandler.js`);

module.exports = async () => {
	
	botEventsHandler();
	processEventsHandler();
	
};
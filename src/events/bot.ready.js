const fs = require('fs');


module.exports = {
  
	name: 'ready',
	once: true,
	async execute(bot) {
		console.log(`[SUCCESS] Бот залогинен под аккаунтом ${bot.user.tag}`);
	},
  
};
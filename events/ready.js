module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Готово! Бот залогинен под аккаунтом ${client.user.tag}`);
    const economyInit = require('../bot modules/Economy/economyInit.js');
    economyInit();
  },
};
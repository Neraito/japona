module.exports = {
	name: 'uncaughtException',
	once: false,
	async execute(err) {
		console.log('Ошибка ять: ' + err + '\n' + err.stack);
	},
};
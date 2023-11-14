const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	async execute(interaction) {
		let bot = interaction.client;
		let prefix = "!";

		const args = interaction.content.split(/ +/g);
		const commandNAME = args.shift().slice(prefix.length).toLowerCase();
		const cmd = bot.commands.find(command => command.name === commandNAME) || bot.commands.find(command => command.alias?.find(a => a === commandNAME) === commandNAME)

		if(!interaction.content.toLowerCase().startsWith(prefix) || !interaction.guild || interaction.author.bot || !cmd) return;

		console.log(`running ${commandNAME} with ${args.length === 0 ? 'no args given' : args}`);
		cmd.execute(bot, interaction, commandNAME, args)
	},

};

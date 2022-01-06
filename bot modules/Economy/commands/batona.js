module.exports.help = {
  name: "batona",
  description: "_сьедобный представитель японской флоры и фауны (бывает радиоактивный, осторожнее)_"
};

module.exports.init = (slashCommand, commandDataArray) => {
  slashCommand.addSubcommand(subcommand =>
    subcommand
    .setName('batona')
    .setDescription('любимое лакомство мяу')
  );
  commandDataArray.push({
    name: "batona",
    command: cmd
  });
};

async function cmd() {
  console.log('a?')
}
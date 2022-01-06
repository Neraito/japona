module.exports.help = {
  name: "administrybatona",
  description: "_Adminirovanniy Adminon — сьедобный представитель японской флоры и фауны (бывает радиоактивный, осторожнее)_"
};

module.exports.init = (slashCommand, commandDataArray) => {
  slashCommand.addSubcommand(subcommand =>
    subcommand
    .setName('administrybatona')
    .setDescription('Admininnnnity — любимое лакомство мяу')
  );
  commandDataArray.push({
    name: "administrybatona",
    command: cmd
  });
};

async function cmd() {
  console.log('a?')
}
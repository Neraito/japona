module.exports.help = {
  name: "kanami",
  description: "_кто он такой не известно, может это она, некоторые говорят что это япон, но уж очень похож на батон_"
};

module.exports.init = (slashCommand, commandDataArray) => {
  slashCommand.addSubcommand(subcommand =>
    subcommand
    .setName('kanami')
    .setDescription('бототвинохлебоводитель сервера')
  );
  commandDataArray.push({
    name: "kanami",
    command: cmd
  });
};

async function cmd() {
  console.log('a?')
}
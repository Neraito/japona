const sleep = require('util').promisify(setTimeout);
const { performance } = require('perf_hooks');


module.exports = startMining;


async function startMining() {
  let a = performance.now();
  let miners = await runWithTimeout(1300, getOnlineMembers, 10);
  let b = performance.now();
  console.log('получение пользователей: ' + (b - a) + 'ms');
  
  let endDate = Date.now() + (1000 * 60 * 120);
  let iteration = 0;
  console.log('——— Майнеры ———');
  console.log(miners);
  console.log(miners.length);
  console.log('——————————————');

  mineIteration();
}

async function mineIteration() {
  await sleep(1000 * 30);
  console.log('Сейчас: ' + Date.now());
  console.log('Конец: ' + endDate);
  console.log('Разница: ' + (endDate - Date.now()));
  
  if (Date.now() < endDate) {
    iteration++;
    console.log(`Итерация: ${iteration}`);

    a = performance.now();
    let onlineMembers = await runWithTimeout(1300, getOnlineMembers, 10);
    b = performance.now();
    console.log('получение пользователей: '
      + (new Intl.NumberFormat().format(b-a)) + 'ms');

    console.log('——— В онлайне ———');
    //console.log(onlineMembers)
    console.log(onlineMembers.length);
    console.log('——————————————');

    miners = onlineMembers.filter(u => miners.includes(u));
    console.log('——— Майнят ———');
    //console.log(miners)
    console.log(miners.length);
    console.log('——————————————');

    mineIteration();
  }
  else {
    console.log('——— Победители ———');
    console.log(miners);
    console.log(miners.length);
    console.log('——————————————');
    let channel = await bot.channels.resolve('833321015168860160');
    await channel.send('Майнеры намайнили ' + new Intl.NumberFormat().format(Math.abs(endDate - Date.now())) + ' воздуха.');

    startMining();
  }
}

// ----- //

async function runWithTimeout(timeout, func, maxErrors) {
  let iteration = 0;
  let channel = await bot.channels.resolve('833321015168860160');
  
  async function execute() {
    let result = await executeWithTimeout();
    if (result == 'timeout') {
      iteration++;
      if (iteration < maxErrors) {
        console.log('Ошибка #' + iteration);
        return await execute();
      }
      else return 'Не удалось выполнить функцию.';
    }
    else return result;
  }
  
  async function executeWithTimeout() {
    return new Promise(async(resolve, reject) => {
      setTimeout(() => {
        if (!executeWithTimeout.isResolved) resolve('timeout');
      }, timeout);
      //await sleep(1500)
      resolve(await func());
    });
  }
  
  return await execute();
}
//console.log(await runWithTimeout(1000, getOnlineMembers, 5))


let getOnlineMembers = async () => {
  try {
    let guild = bot.guilds.resolve('831878963839107112');
    let members = Array.from(await guild.members.fetch())
    .filter(u => {
      if (u.presence != null && u.user.bot == false)
        return u.presence.status == "online";
    });
    
    let membersIdArray = [];
    for (let u of members) membersIdArray.push(u.user.id);
    
    return membersIdArray;
  } catch (err) {
    console.log(err);
    //console.log('повторная попытка')
    //return await getOnlineMembers()
  }
};
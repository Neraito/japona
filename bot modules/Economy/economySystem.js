const sleep = require('util').promisify(setTimeout);
const { performance } = require('perf_hooks');


let runWithTimeout = async (timeout, func, maxErrors) => {
  let iteration = 0;
  let channel = await bot.channels.resolve('833321015168860160');
  let execute = async () => {
    let executeWithTimeout = async () => {
      return new Promise(async(resolve, reject) => {
        setTimeout(() => {
          if (!executeWithTimeout.isResolved) resolve('timeout');
        },
        timeout);
        //await sleep(1500)
        resolve(await func());
      });
    };
    let result = await executeWithTimeout();
    if (result == 'timeout') {
      iteration++;
      if (iteration < maxErrors) {
        let timeouts = [
          'Ааааааааааааааа, температуры зашкаливают, срочно несите огнетушитель!',
          'Мы вот-вот загоримся, сушите вееееееслаааааааа!!!',
          'Вызывайте спасаааааааателеееееей, у нас тут жарко, попааааримся :)',
          'Не, я конечно все понимаю, но у нас щас поплавятся борта!!!',
          'Чет жареным запахло, я один этот запах чувствую? Проверьте карты срочно!',
          'Святая ARM архитектура, спаси и сохрани.',
          '>_< wraaaaaaaaaaaaaaaaaa',
          '<:plja_cactus_sbegaet:870058461793222726>',
          '<a:a41:845403684132225054>',
          '<:aaaaaaaaaaa:833598700458082306>'
        ];
        await channel.send(timeouts[iteration-1]);
        return await execute();
      } else {
        await channel.send('Горииииииииииииииим, туууушиииитееееее каааааааааааартыыыыыы');
        return 'Всё поломалось к хренам, заканчиваем майнинг все карты сгорели в адском пламени!';
      }
    } else {
      return result;
    }
  };
  return await execute();
};

let getOnlineMembers = async () => {
  try {
    let guild = bot.guilds.resolve('831878963839107112');
    let members = await guild.members.fetch();
    members = Array.from(members.values());
    members = members.filter(u => {
      if (u.presence != null && u.user.bot == false)
        return u.presence.status == "online"
    });
    let membersIds = [];
    for (let u of members) {
      membersIds.push(u.user.id);
    }
    return membersIds;
  } catch (err) {
    console.log(err);
    //console.log('повторная попытка')
    //return await getOnlineMembers()
  }
};

//console.log(await runWithTimeout(1000, getOnlineMembers, 5))

let startMining = async () => {
  let a = performance.now();
  let miners = await runWithTimeout(1300, getOnlineMembers, 10);
  let b = performance.now();
  console.log(b - a);
  let endDate = Date.now() + (1000 * 60 * 120);
  let iteration = 0;
  console.log('——— Майнеры ———');
  console.log(miners);
  console.log(miners.length);
  console.log('——————————————');

  let mineIteration = async () => {
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
      console.log(new Intl.NumberFormat().format(b-a));

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
    } else {
      console.log('——— Победители ———');
      console.log(miners);
      console.log(miners.length);
      console.log('——————————————');
      let channel = await bot.channels.resolve('833321015168860160');
      await channel.send('Майнеры намайнили ' + new Intl.NumberFormat().format(Math.abs(endDate - Date.now())) + ' воздуха.');

      startMining();
    }
  };
  mineIteration();
};
module.exports.mining = async () => {
  startMining();
};
const Discord = require('discord.js-selfbot');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let bot = (client, token, prefix, multiPrefix, timeOutTime) => {

  client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity(prefix + "r");
  });

  client.on('message', async msg => {
    const args = msg.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (msg.content.startsWith(prefix + 'r')) {
      msg.channel.send(msg.content.slice((prefix + 'r').length, msg.content.length));
    }

    if (msg.content.startsWith(multiPrefix + 'r')) {
      setTimeout(() => {
        msg.channel.send(msg.content.slice(5, msg.content.length))
      }, timeOutTime);
    }

    if (msg.content.startsWith(prefix + 'r10')) {
      for (let i = 1; i <= 10; i++) {
        msg.channel.send(msg.content.slice((prefix + 'r10').length, msg.content.length));
        await sleep(4050);
      }
    }

    if (msg.content.startsWith(prefix + 'g')) {
      let chan = client.guilds.resolve("833325571614179368").channels.resolve('833325571614179371');
      let message = await chan.messages.fetch('898792247892541440');
      console.log(message);
    }
  });

  client.login(token);
}


let tokens16 = [
  "ODk1NzYxMzM5NzQ0NjYxNTg0.YWlYqA.TOesN-VUUfcK0TWhZ-uTuS9pD8o",
  "ODk1NzYyMDc4NzEzOTM3OTcx.YWlZVA.QNq5Md_t9QDq8c5T51iNMpmuj5U",
  "ODk1NzYyNzgzNjE3MDUyNjgz.YWlZqQ.Pqv6OTAGtrl_NfNUjX1yGG507fY",
  "ODk1NzYzNDIwNjA1OTg4OTA1.YWlaJA.oJhe2Cyj6pVrrL5koN40hEDAVGw",

  "ODk1NzgzNzI2MjU1MDc1MzI4.YWlbSA.LuAEu6hK4Rk55RmFcZGVnwgbIxE",
  "ODk1Nzg0MTUwMjU3MjU0NDEw.YWlbjw.tk9Wu_Na5HkWIIg5p-tqpUmASoA",
  "ODk1Nzg0NzczOTUwMjQyOTM4.YWlbzw.HYiNTd8IWQOwFmFmy5-oz_e7P40",
  "ODk1Nzg1MTkwMzEwNDQ1MTI2.YWlcCw.o39MFMB3RtRWrftDqWY0-EFxJaE",

  "ODk1ODExNzQ2NTMzNjI1ODU3.YWlcTw.GUuXvBVRdohhnLYr8tcXGbYXkPY",
  "ODk1ODExOTU3OTUxNzEzMjgx.YWlcjA.q0fJjY8XfaoA0hlIcstBgEC4O8o",
  "ODk1ODEyMTk4MzM1NjU1OTc3.YWlcxQ.mbH_JB6pm0k2GB10F1LMn1WCKT8",
  "ODk1ODEyNDE4MjE3ODM2NjI5.YWldKQ.faL-Y6DN_AbZ4IJROKjw_1qV2sw",

  "ODk3MTg5OTkyMTQ3ODUzMzEz.YWleUw.-GG9b6Sz02zs8sRLO9Ra5z2rATU",
  "ODk3MTkwNTg0MDM1NDUwODgx.YWleiw.F7X3-vhSro0IUssridGRCHnC5NE",
  "ODk3MTkxMjkzMTM3MDc2Mjc0.YWlexA.DpJoJrTOxE_DeBhQSsC3kY-uMQE",
  "ODk3MTkxNjk4ODUyMTE4NTY4.YWlfAg.a5LKGmsaan9xSteJ9Tib5PoUvEI",
];
let tokens32 = [
  "ODk3MjI2Nzk5NjU2ODc4MDgw.YWlgnw.Q3GU8ImbUs7pIVE6A2CjWbGwPqA",
  "ODk3MjI3MzExMjQ4NzAzNDk5.YWlg_w.Dh0eWFXaiPWirFg6bj4uNvO8Rys",
  "ODk3MjI3NTY2NjE0NzIwNTg0.YWlhQg.cOjOkXPAEhMP66ho39b47iiee08",
  "ODk3MjI3ODQ4NjM1NTE4OTk2.YWlhgA.W8NJLc1spK1dlMURtXvNJ8eEmqU",

  "ODk3NjUyNDgzNjg4NjU2OTA3.YWnlEA.tWb_ejiyvht_zp6h4MBmFEr1BlM",
  "ODk3NjUyNzAwNjkzNTU3Mjc5.YWkjdg.fUZNgkiqhqXjbwG6aahdlHSEMHg",
  "ODk3NjUyNzg3NjE2MzA1MTkz.YWk3EA.SyB1SlcccfYTPF8Xh4au8WrvPVQ",
  "ODk3NjU1MzQxMTQyMTM0Nzk1.YWlrAw.Ib81G54JGvy9ImN-Lcn53_0G-54",
];
let tokens = [tokens16, tokens32];
let prefixChars = ["a", "b", "c", "d"];
for (let ti = 0; ti < tokens.length; ti++) {
  for (let i = 0; i < tokens[ti].length; i++) {
    bot(
      new Discord.Client(),
      tokens[ti][i],
      `s${prefixChars[ti]}${i + 1}`,
      `s${prefixChars[ti]}.`,
      500 * (i + 1)
    );
  }
}

/*bot(
  new Discord.Client(),
  tokens16[0],
  "t1",
  "t.",
  500
);*/
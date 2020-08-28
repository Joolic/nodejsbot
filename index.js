const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.token;
const welcomeChannelName = "👋ㅣ안녕하세요";
const byeChannelName = "👋ㅣ안녕히가세요";
const welcomeChannelComment = "님! 배구방 서버에 오신걸 환영합니다~ 안녕하세요~ 많은 활동 부탁드립니다!";
const byeChannelComment = "님! 안녕히가세요ㅠㅠ";

client.on('ready', () => {
  console.log('켰다.');
});

client.on("guildMemberAdd", (member) => {
  const guild = member.guild;
  const newUser = member.user;
  const welcomeChannel = guild.channels.find(channel => channel.name == welcomeChannelName);

  welcomeChannel.send(`<@${newUser.id}> ${welcomeChannelComment}\n`);

  member.addRole(guild.roles.find(role => role.name == "게스트"));
});

client.on("guildMemberRemove", (member) => {
  const guild = member.guild;
  const deleteUser = member.user;
  const byeChannel = guild.channels.find(channel => channel.name == byeChannelName);

  byeChannel.send(`<@${deleteUser.id}> ${byeChannelComment}\n`);
});

client.on('message', (message) => {
  if(message.author.bot) return;

  if(message.content == 'ping') {
    return message.reply('pong');
  }

  if(message.content == '=엠베드') {
    let img = 'https://cdn.discordapp.com/icons/419671192857739264/6dccc22df4cb0051b50548627f36c09b.webp?size=256';
    let embed = new Discord.RichEmbed()
      .setTitle('타이틀')
      .setURL('http://www.naver.com')
      .setAuthor('주릭', img, 'http://www.naver.com')
      .setThumbnail(img)
      .addBlankField()
      .addField('설명', '설명 줄바꿈')
      .addField('설명', '설명 줄바꿈', true)
      .addField('설명', '설명 줄바꿈', true)
      .addField('설명', '설명 줄바꿈', true)
      .addField('설명', 'Some value here1\nSome value here2\nSome value here3\n')
      .addBlankField()
      .setTimestamp()
      .setFooter('form 주릭', img)

    message.channel.send(embed)
  } else if(message.content == '=도움말') {
    let helpImg = 'https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png';
    let commandList = [
      {name: '=도움말', desc: '배구봇 도움말을 생성합니다.'},
      {name: '=초대코드', desc: '서버의 초대코드를 생성합니다.'},
    ];
    let commandStr = '';
    let embed = new Discord.RichEmbed()
      .setAuthor('배구봇 도움말 ❤️', helpImg)
      .setColor('#186de6')
      .setFooter(`배구봇 ❤️`)
      .setTimestamp()
    
      commandList.forEach(x => {
        commandStr += `• \`\`${changeCommandStringLength(`${x.name}`)}\`\` : **${x.desc}**\n`;
      });
  
      embed.addField('Commands: ', commandStr);
  
      message.channel.send(embed)
    }

  if(message.content.startsWith('=DM공지')) {
    if(checkPermission(message)) return
    if(message.member != null) { // 채널에서 공지 쓸 때
      let contents = message.content.slice('=DM공지'.length);
      message.member.guild.members.array().forEach(x => {
        if(x.user.bot) return;
        x.user.send(`<@${message.author.id}> ${contents}`);
      });
  
      return message.reply('공지를 전송했습니다.');
    } else {
      return message.reply('채널에서 실행해주세요.');
    }
  }
});

function checkPermission(message) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> ` + "명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
    return true;
  } else {
    return false;
  }
}

function changeCommandStringLength(str, limitLen = 8) {
  let tmp = str;
  limitLen -= tmp.length;

  for(let i=0;i<limitLen;i++) {
      tmp += ' ';
  }

  return tmp;
}


client.login(token);
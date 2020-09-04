require("moment-duration-format");
let moment = require('moment') 
require('moment-timezone')
const Discord = require('discord.js');
const client = new Discord.Client();
const token = process.env.token;
const welcomeChannelName = "👋ㅣ안녕하세요";
const byeChannelName = "👋ㅣ안녕히가세요";
const welcomeChannelComment = "님! 배구방 서버에 오신걸 환영합니다~ 안녕하세요~ 많은 활동 부탁드립니다!";
const byeChannelComment = "님! 안녕히가세요ㅠㅠ";

client.on('ready', () => {
    console.log('ON');
    client.user.setPresence({ game: { name: '=도움말 을 쳐보세요.' }, status: 'online' })
});

client.on("guildMemberAdd", (member) => {
  const guild = member.guild;
  const newUser = member.user;
  const welcomeChannel = guild.channels.find(channel => channel.name == welcomeChannelName);

  welcomeChannel.send(`<@${newUser.id}> ${welcomeChannelComment}\n`);

  member.addRole(guild.roles.find(role => role.name == "USER"));
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

    if(message.content == '=서버상태') {
        let embed = new Discord.RichEmbed()
        let img = 'https://cdn.discordapp.com/icons/737573174102720555/df7ded003a3aed77a111141b04c66cf4.webp?size=128';
        var duration = moment.duration(client.uptime).format(" D [일], H [시간], m [분], s [초]");
        embed.setColor('#186de6')
        embed.setAuthor('server info of 배구봇', img)
        embed.setFooter(`배구봇 ❤️`)
        embed.addBlankField()
        embed.addField('RAM usage',    `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, true);
        embed.addField('running time', `${duration}`, true);
        embed.addField('user',         `${client.users.size.toLocaleString()}`, true);
        embed.addField('server',       `${client.guilds.size.toLocaleString()}`, true);
        // embed.addField('channel',      `${client.channels.size.toLocaleString()}`, true);
        embed.addField('Discord.js',   `v${Discord.version}`, true);
        embed.addField('Node',         `${process.version}`, true);
        
        let arr = client.guilds.array();
        let list = '';
        list = `\`\`\`css\n`;
        
        for(let i=0;i<arr.length;i++) {
          // list += `${arr[i].name} - ${arr[i].id}\n`
          list += `${arr[i].name}\n`
        }
        list += `\`\`\`\n`
        embed.addField('list:',        `${list}`);
    
        embed.setTimestamp()
        message.channel.send(embed);
      }

  if(message.content == '=엠베드') {
    let img = 'https://cdn.discordapp.com/avatars/691536688568205324/d37511460dba76d0570199acf02bb47b.webp?size=128';
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
      {name: '=초대코드', desc: '해당 채널의 초대 코드 표기'},
      {name: '=종합코드', desc: '봇이 들어가있는 모든 채널의 초대 코드 표기'},
      {name: '=서버상태', desc: '서버의 현재 상태를 표기'},
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
    } else if(message.content == '=종합코드') {
      client.guilds.array().forEach(x => {
        x.channels.find(x => x.type == 'text').createInvite({maxAge: 0}) // maxAge: 0은 무한이라는 의미, maxAge부분을 지우면 24시간으로 설정됨
          .then(invite => {
            message.channel.send(invite.url)
          })
          .catch((err) => {
            if(err.code == 50013) {
              message.channel.send('**'+x.channels.find(x => x.type == 'text').guild.name+'** 채널 권한이 없어 초대코드 발행 실패')
            }
          })
      });
    } else if(message.content == '=초대코드') {
      if(message.channel.type == 'dm') {
        return message.reply('dm에서 사용할 수 없는 명령어 입니다.');
      }
      message.guild.channels.get(message.channel.id).createInvite({maxAge: 0}) // maxAge: 0은 무한이라는 의미, maxAge부분을 지우면 24시간으로 설정됨
        .then(invite => {
          message.channel.send(invite.url)
        })
        .catch((err) => {
          if(err.code == 50013) {
            message.channel.send('**'+message.guild.channels.get(message.channel.id).guild.name+'** 채널 권한이 없어 초대코드 발행 실패')
          }
        })
    } else if(message.content.startsWith('=전체공지')) {
      if(checkPermission(message)) return
      if(message.member != null) { // 채널에서 공지 쓸 때
        let contents = message.content.slice('=전체공지'.length);
        let embed = new Discord.RichEmbed()
          .setAuthor('공지 of 배구봇')
          .setColor('#186de6')
          .setFooter(`배구봇 ❤️`)
          .setTimestamp()
    
        embed.addField('공지: ', contents);
    
        message.member.guild.members.array().forEach(x => {
          if(x.user.bot) return;
          x.user.send(embed)
        });
    
        return message.reply('공지를 전송했습니다.');
      } else {
        return message.reply('채널에서 실행해주세요.');
      }
    } else if(message.content.startsWith('=DM공지')) {
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
    } else if(message.content.startsWith('=청소')) {
      if(message.channel.type == 'dm') {
        return message.reply('dm에서 사용할 수 없는 명령어 입니다.');
      }
      
      if(message.channel.type != 'dm' && checkPermission(message)) return
  
      var clearLine = message.content.slice('=청소 '.length);
      var isNum = !isNaN(clearLine)
  
      if(isNum && (clearLine <= 0 || 100 < clearLine)) {
        message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
        return;
      } else if(!isNum) { // c @나긋해 3
        if(message.content.split('<@').length == 2) {
          if(isNaN(message.content.split(' ')[2])) return;
  
          var user = message.content.split(' ')[1].split('<@!')[1].split('>')[0];
          var count = parseInt(message.content.split(' ')[2])+1;
          let _cnt = 0;
  
          message.channel.fetchMessages().then(collected => {
            collected.every(msg => {
              if(msg.author.id == user) {
                msg.delete();
                ++_cnt;
              }
              return !(_cnt == count);
            });
          });
        }
      } else {
        message.channel.bulkDelete(parseInt(clearLine)+1)
          .then(() => {
            AutoMsgDelete(message, `<@${message.author.id}> ` + parseInt(clearLine) + "개의 메시지를 삭제했습니다. (이 메세지는 잠시 후에 사라집니다.)");
          })
          .catch(console.error)
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
  
  async function AutoMsgDelete(message, str, delay = 3000) {
    let msg = await message.channel.send(str);
  
    setTimeout(() => {
      msg.delete();
    }, delay);
  }
  
  
  client.login(token);
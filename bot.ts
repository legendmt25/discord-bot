import { Client, Collection, Intents, Interaction } from 'discord.js';
import localtunnel from 'localtunnel';
import { ICommand } from './src/models/ICommand';
import { files } from './src/loadCommands';
import './src/deployCommands';

const TOKEN = process.env.TOKEN;

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
  ],
});

const commands = new Collection<string, (interaction: Interaction) => void>();
files.forEach(async (file) => {
  const command: ICommand = await file;
  commands.set(command.data.name, command.execute);
});

const YouTubeNotifier = require('youtube-notification');
const channelIds = [
  'UC-lHJZR3Gqxm24_Vd_AJ5Yw',
  'UCjehMNgRu7EX0r42G-aqQNQ',
  'UCoY_dofjT_dNWnYyDO6YYKg',
  'UCs6nmQViDpUw0nuIx9c_WvA',
  'UCAokB3MtXieee1ReEYHiCTg',
];
//pewdiepie channelId

client.once('ready', async () => {
  const tunnelPort = 3000;
  const lt = await localtunnel(tunnelPort);
  const notifier = new YouTubeNotifier({
    hubCallback: lt.url,
    path: '/youtube/notifications',
    port: tunnelPort,
  });
  notifier.setup(() => console.log(`Server listening on ${tunnelPort}`));

  notifier.subscribe(channelIds);

  notifier.on('subscribe', (data: any) => {
    console.log(data);
  });
  notifier.on('notified', (data: any) => {
    console.log(data);
  });

  console.log(`Local tunnel running on ${lt.url}, PORT: ${tunnelPort}`);
  console.log('Ready!');
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  try {
    commands.get(commandName)!(interaction);
  } catch (err) {
    console.error(err);
  }
});

client.login(TOKEN);

client.on('guildMemberAdd', (member) => {
  member.send({ content: `Welcome to the amusement park ${member.user.username}` });
});
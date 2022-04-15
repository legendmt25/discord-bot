import { Client, Collection, Intents, Interaction } from 'discord.js';
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
    Intents.FLAGS.GUILD_INTEGRATIONS
  ],
});

const commands = new Collection<string, (interaction: Interaction) => void>();
files.forEach(async (file) => {
  const command: ICommand = await file;
  commands.set(command.data.name, command.execute);
});

client.once('ready', () => {
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

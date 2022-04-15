import dotenv from 'dotenv';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { files } from './loadCommands';

dotenv.config();
const TOKEN = process.env.TOKEN;

const guildId = '824777870516944916';
const clientId = '824782684298412123';

const rest = new REST().setToken(TOKEN!);

const commands = files.map(async (file) => {
  const command = await file;
  return command.data;
});

(async function () {
  try {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: await Promise.all(commands),
    });
    console.log('Successfully reloaded application (/) commands.');
  } catch (err) {
    console.error(err);
  }
})();

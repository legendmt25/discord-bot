import dotenv from 'dotenv';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { files } from './loadCommands';

dotenv.config();
const TOKEN = process.env.TOKEN as string;
const GUILD_ID = process.env.GUILD_ID as string;
const CLIENT_ID = process.env.CLIENT_ID as string;

const rest = new REST().setToken(TOKEN);

const commands = files.map(async (file) => {
  const command = await file;
  return command.data;
});

(async function () {
  try {
    await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
      body: await Promise.all(commands),
    });
    console.log('Successfully reloaded application (/) commands.');
  } catch (err) {
    console.error(err);
  }
})();

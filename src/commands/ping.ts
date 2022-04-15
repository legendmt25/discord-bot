import { SlashCommandBuilder } from '@discordjs/builders';
import { BaseCommandInteraction, Interaction } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('ping')
  .setDescription('pong');

export const execute = async (interaction: Interaction) => {
  (interaction as BaseCommandInteraction).reply('pong');
};

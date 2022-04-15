import { SlashCommandBuilder } from '@discordjs/builders';
import { Interaction } from 'discord.js';

export interface ICommand {
  data: SlashCommandBuilder;
  execute: (interaction: Interaction) => void;
}

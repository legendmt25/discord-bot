import { SlashCommandBuilder } from '@discordjs/builders';
import { CacheType, Interaction } from 'discord.js';

export interface ICommand {
  data: SlashCommandBuilder;
  execute: (interaction: Interaction) => void;
}

export class Command implements ICommand {
  data: SlashCommandBuilder;
  execute: (interaction: Interaction<CacheType>) => void;

  constructor(
    data: SlashCommandBuilder,
    execute: (interaction: Interaction<CacheType>) => void
  ) {
    this.data = data;
    this.execute = execute;
  }
}

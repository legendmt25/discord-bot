import { SlashCommandBuilder } from '@discordjs/builders';
import { BaseCommandInteraction, Interaction } from 'discord.js';
import { guildVoiceConnectionService } from '../../services/GuildVoiceConnectionService';

export const data = new SlashCommandBuilder()
  .setName('music-queue')
  .setDescription('Get queued music');

export const execute = async (interaction: Interaction) => {
  const _interaction = interaction as BaseCommandInteraction;

  const queue = guildVoiceConnectionService.findByGuildId(
    _interaction.guildId!
  )?.musicQueue;

  _interaction.reply({
    content: 'Music queue\n'.concat(
      queue && !queue?.empty()
        ? queue?.getQueue().reduce((a, b) => a.concat(b) + '\n', '')!
        : 'Empty'
    ),
  });
};

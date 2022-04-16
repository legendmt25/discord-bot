import { SlashCommandBuilder } from '@discordjs/builders';
import { BaseCommandInteraction, GuildMember, Interaction } from 'discord.js';
import { guildVoiceConnectionService } from '../../services/GuildVoiceConnectionService';

export const data = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Stop the music player');

export const execute = async (interaction: Interaction) => {
  const _interaction = interaction as BaseCommandInteraction;
  const guildMember = _interaction.member as GuildMember;

  guildVoiceConnectionService.deleteByGuildId_IfExists(_interaction.guildId!);

  _interaction.reply({
    content: `${guildMember.user.username} stopped the music player`,
  });
};

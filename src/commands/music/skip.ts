import { SlashCommandBuilder } from '@discordjs/builders';
import { BaseCommandInteraction, GuildMember, Interaction } from 'discord.js';
import { guildVoiceConnectionService } from '../../services/GuildVoiceConnectionService';

export const data = new SlashCommandBuilder()
  .setName('skip')
  .setDescription('Skip :n songs')
  .addNumberOption((input) =>
    input.setName('n').setDescription('Number of songs').setRequired(false)
  );

export const execute = async (interaction: Interaction) => {
  const _interaction = interaction as BaseCommandInteraction;
  let n = _interaction.options.get('n')?.value as number | undefined;
  const guildMember = _interaction.member as GuildMember;

  if (guildVoiceConnectionService.exists(_interaction.guildId!)) {
    n && guildVoiceConnectionService.skipSongs(_interaction.guildId!, n);
    guildVoiceConnectionService.startPlaying(_interaction.guildId!, true);
  }

  _interaction.reply({
    content: `${guildMember.user.username} skipped ${n || 1}`,
  });
};

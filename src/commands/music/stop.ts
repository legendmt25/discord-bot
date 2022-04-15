import { SlashCommandBuilder } from '@discordjs/builders';
import { BaseCommandInteraction, GuildMember, Interaction } from 'discord.js';
import { joinedVoiceChannels } from '../../JoinedVoiceChannels';
import ytdl from 'ytdl-core';
import ytsr from 'ytsr';
import ytpl from 'ytpl';

export const data = new SlashCommandBuilder()
  .setName('stop')
  .setDescription('Stop the music player');

export const execute = async (interaction: Interaction) => {
  const _interaction = interaction as BaseCommandInteraction;
  const guildMember = _interaction.member as GuildMember;

  if (joinedVoiceChannels.isJoinedIn(_interaction.guildId!)) {
    joinedVoiceChannels.get(_interaction.guildId!)?.destroy();
    joinedVoiceChannels.unset(_interaction.guildId!);
  }
  _interaction.reply({
    content: `${guildMember.user.username} stopped the music player`,
  });
};

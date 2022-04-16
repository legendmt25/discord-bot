import { SlashCommandBuilder } from '@discordjs/builders';
import { BaseCommandInteraction, GuildMember, Interaction } from 'discord.js';
import { joinVoiceChannel } from '@discordjs/voice';
import { guildVoiceConnectionService } from '../../services/GuildVoiceConnectionService';

export const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play a music')
  .addStringOption((input) =>
    input
      .setName('value')
      .setDescription('URL for music or playlist / song title')
      .setRequired(true)
  );

export const execute = async (interaction: Interaction) => {
  const _interaction = interaction as BaseCommandInteraction;
  const value = _interaction.options.get('value')?.value as string;
  const guildMember = _interaction.member as GuildMember;

  if (!guildMember.voice.channelId) {
    _interaction.reply({
      content: `You need to join a voice channel first`,
      ephemeral: true,
    });
    return;
  }
  if (!guildVoiceConnectionService.exists(_interaction.guildId!)) {
    const connection = guildVoiceConnectionService.create(
      _interaction.guildId!,
      joinVoiceChannel({
        channelId: guildMember.voice.channelId,
        guildId: _interaction.guildId!,
        adapterCreator: _interaction.guild?.voiceAdapterCreator!,
      }),
      _interaction
    );
  }

  await guildVoiceConnectionService.addMusic(_interaction.guildId!, value);

  if (!guildVoiceConnectionService.startPlaying(_interaction.guildId!)) {
    _interaction.reply({
      content: `Music already running, adding ${value} in queue`,
      ephemeral: true,
    });
    return;
  }

  _interaction.reply({
    content: `Music player started by ${_interaction.member?.user.username}`,
  });
};

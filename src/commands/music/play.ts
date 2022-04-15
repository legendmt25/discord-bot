import { SlashCommandBuilder } from '@discordjs/builders';
import { BaseCommandInteraction, GuildMember, Interaction } from 'discord.js';
import { createReadStream } from 'fs';
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  StreamType,
  generateDependencyReport,
  VoiceConnection,
  VoiceConnectionStatus,
  AudioPlayerStatus,
} from '@discordjs/voice';
import { joinedVoiceChannels } from '../../JoinedVoiceChannels';
import ytdl from 'ytdl-core';
import ytsr from 'ytsr';
import ytpl from 'ytpl';

export const data = new SlashCommandBuilder()
  .setName('play')
  .setDescription('Play a music')
  .addStringOption((input) =>
    input
      .setName('url')
      .setDescription('URL for music or playlist / song title')
      .setRequired(true)
  );

export const execute = async (interaction: Interaction) => {
  const _interaction = interaction as BaseCommandInteraction;
  const url = _interaction.options.get('url')?.value as string;
  const guildMember = _interaction.member as GuildMember;

  if (!guildMember.voice.channelId) {
    _interaction.reply({
      content: `You need to join a voice channel first`,
      ephemeral: true,
    });
    return;
  }
  if (joinedVoiceChannels.isJoinedIn(_interaction.guildId!)) {
    joinedVoiceChannels.get(_interaction.guildId!)?.destroy();
    joinedVoiceChannels.unset(_interaction.guildId!);
  }
  let voice = joinedVoiceChannels.set(
    _interaction.guildId!,
    joinVoiceChannel({
      channelId: guildMember.voice.channelId,
      guildId: _interaction.guildId!,
      adapterCreator: _interaction.guild?.voiceAdapterCreator!,
    })
  );

  const audioPlayer = createAudioPlayer();
  audioPlayer.play(createAudioResource(ytdl(url, { filter: 'audioonly' })));
  audioPlayer.on('error', (err) => console.log(err));

  voice.subscribe(audioPlayer);

  audioPlayer.on(AudioPlayerStatus.Idle, () => {
    voice.destroy();
  });

  _interaction.reply({ content: `Playing ${url}` });
};

import { SlashCommandBuilder } from '@discordjs/builders';
import { BaseCommandInteraction, GuildMember, Interaction } from 'discord.js';
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerState,
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

  if (value.includes('playlist')) {
    (await ytpl(await ytpl.getPlaylistID(value))).items.forEach((item) =>
      joinedVoiceChannels.addMusic(interaction.guildId!, item.url)
    );
  } else if (!value.includes('www')) {
    joinedVoiceChannels.addMusic(
      _interaction.guildId!,
      ((await ytsr(value, { limit: 1 })).items[0] as ytsr.Video).url
    );
  } else {
    joinedVoiceChannels.addMusic(_interaction.guildId!, value);
  }

  const audioPlayer = createAudioPlayer();
  audioPlayer.on('error', (err) => console.log(err));
  audioPlayer.on('stateChange', (o: AudioPlayerState, n: AudioPlayerState) => {
    if (n.status != 'idle') {
      return;
    }

    const url = joinedVoiceChannels.unshiftFirstMusic(_interaction.guildId!);
    const stream = ytdl(url!, {
      filter: 'audioonly',
    });
    setTimeout(() => audioPlayer.play(createAudioResource(stream)), 3000);
    _interaction.channel?.send({ content: `Playing ${url}` });
  });
  audioPlayer.emit(
    'stateChange',
    { status: 'idle' } as AudioPlayerState,
    { status: 'idle' } as AudioPlayerState
  );
  _interaction.reply({
    content: `Music player started by ${_interaction.member?.user.username}`,
  });
  voice.subscribe(audioPlayer);
};

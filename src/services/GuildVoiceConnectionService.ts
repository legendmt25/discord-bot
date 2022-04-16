import {
  AudioPlayerState,
  createAudioResource,
  VoiceConnection,
} from '@discordjs/voice';
import { BaseCommandInteraction } from 'discord.js';
import ytpl from 'ytpl';
import ytsr from 'ytsr';
import { exec } from 'youtube-dl-exec';
import { GuildVoiceConnection } from '../models/GuildVoiceConnection';

export class GuildVoiceConnectionService {
  connections: Map<string, GuildVoiceConnection>;
  constructor() {
    this.connections = new Map();
  }
  findAll() {
    return this.connections.values();
  }
  findByGuildId(guildId: string) {
    return this.connections.get(guildId);
  }
  async addMusic(guildId: string, value: string) {
    const connection = this.findByGuildId(guildId);
    let urls = [value];
    if (value.includes('playlist')) {
      const playlistId = await ytpl.getPlaylistID(value);
      const query = await ytpl(playlistId);
      urls = query.items.map((item) => item.url);
    } else if (!value.includes('www')) {
      const query = await ytsr(value, { limit: 1 });
      urls = [(query.items[0] as ytsr.Video).url];
    }

    connection?.musicQueue.push(...urls);
  }
  playFirstQueuedMusic(guildId: string) {
    this.findByGuildId(guildId)?.audioPlayer.play;
  }
  deleteByGuildId(guildId: string) {
    return this.connections.delete(guildId);
  }
  exists(guildId: string) {
    return this.connections.has(guildId);
  }
  deleteByGuildId_IfExists(guildId: string) {
    return (
      guildVoiceConnectionService.exists(guildId!) &&
      guildVoiceConnectionService.deleteByGuildId(guildId!)
    );
  }
  create(
    guildId: string,
    connection: VoiceConnection,
    _interaction: BaseCommandInteraction
  ) {
    const guildVoiceConnection = new GuildVoiceConnection(guildId, connection);
    this.connections.set(guildId, guildVoiceConnection);

    guildVoiceConnection.audioPlayer.on('error', (err) => console.log(err));
    guildVoiceConnection.audioPlayer.on(
      'stateChange',
      async (o: AudioPlayerState, n: AudioPlayerState) => {
        console.log(o.status, n.status);
        if (o.status != 'playing' || n.status != 'idle') {
          return;
        }
        if (guildVoiceConnection.musicQueue.empty()) {
          guildVoiceConnection.audioPlayer.stop();
          return;
        }
        const url = guildVoiceConnection.musicQueue.pop();

        const resource = createAudioResource(
          exec(
            url!,
            {
              output: '-',
              format:
                'bestaudio[ext=webm+acodec=opus+tbr>100]/bestaudio[ext=webm+acodec=opus]/bestaudio/best',
              rmCacheDir: true,
              verbose: true,
              limitRate: '1M',
            },
            {
              stdio: ['ignore', 'pipe', 'ignore'],
            }
          ).stdout!
        );
        setTimeout(() => guildVoiceConnection.audioPlayer.play(resource), 2000);
        _interaction.channel?.send({ content: `Playing ${url}` });
      }
    );

    return guildVoiceConnection;
  }

  skipSongs(guildId: string, n: number) {
    const connection = guildVoiceConnectionService.findByGuildId(guildId);
    for (let i = 0; !connection?.musicQueue.empty() && i < n - 1; ++i) {
      connection?.musicQueue.pop();
    }
    return true;
  }

  startPlaying(guildId: string, skip: boolean = false) {
    const connection = this.findByGuildId(guildId);

    if (!skip && connection?.audioPlayer.state.status == 'playing') {
      return false;
    }
    connection?.audioPlayer.emit(
      'stateChange',
      { status: 'playing' } as AudioPlayerState,
      { status: 'idle' } as AudioPlayerState
    );
    return true;
  }
}

export const guildVoiceConnectionService = new GuildVoiceConnectionService();

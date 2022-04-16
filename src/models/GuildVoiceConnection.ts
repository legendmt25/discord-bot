import {
  AudioPlayer,
  createAudioPlayer,
  VoiceConnection,
} from '@discordjs/voice';
import { Queue } from './Queue';

export interface IGuildVoiceConnection {
  guildId: string;
  connection: VoiceConnection;
  musicQueue: Queue<string>;
  audioPlayer: AudioPlayer;
}

export class GuildVoiceConnection implements IGuildVoiceConnection {
  guildId: string;
  connection: VoiceConnection;
  musicQueue: Queue<string>;
  audioPlayer: AudioPlayer;

  constructor(guildId: string, connection: VoiceConnection) {
    this.guildId = guildId;
    this.connection = connection;
    this.musicQueue = new Queue();
    this.audioPlayer = createAudioPlayer();
    this.connection.subscribe(this.audioPlayer);
  }
}

import { VoiceConnection } from '@discordjs/voice';

export class JoinedVoiceChannels {
  joined: Map<string, VoiceConnection>;
  musicURLsByGuild: Map<string, string[]>;
  constructor() {
    this.joined = new Map();
    this.musicURLsByGuild = new Map();
  }

  set(guildId: string, voice: VoiceConnection) {
    this.joined.set(guildId, voice);
    return voice;
  }

  addMusic(guildId: string, url: string) {
    if (!this.musicURLsByGuild.has(guildId)) {
      this.musicURLsByGuild.set(guildId, []);
    }
    const urls = this.musicURLsByGuild.get(guildId);
    urls!.push(url);
    this.musicURLsByGuild.set(guildId, urls!);
    return url;
  }

  unshiftFirstMusic(guildId: string) {
    const urls = this.musicURLsByGuild.get(guildId);
    const url = this.musicURLsByGuild.get(guildId)?.shift();
    this.musicURLsByGuild.set(guildId, urls!);
    return url;
  }

  isJoinedIn(guildId: string) {
    return this.joined.has(guildId);
  }

  get(guildId: string) {
    return this.joined.get(guildId);
  }

  unset(guildId: string) {
    this.joined.delete(guildId);
  }

  getJoinedChannels() {
    return this.joined;
  }
}

export const joinedVoiceChannels = new JoinedVoiceChannels();

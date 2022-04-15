import { VoiceConnection } from "@discordjs/voice";

export class JoinedVoiceChannels {
  joined: Map<string, VoiceConnection>;
  constructor() {
    this.joined = new Map();
  }

  set(guildId: string, voice: VoiceConnection) {
    this.joined.set(guildId, voice);
    return voice;
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

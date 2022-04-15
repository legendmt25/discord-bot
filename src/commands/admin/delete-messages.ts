import { SlashCommandBuilder } from '@discordjs/builders';
import {
  BaseCommandInteraction,
  Interaction,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('clear-chat')
  .setDescription('Number of messages you want to delete')
  .addIntegerOption((input) =>
    input
      .setName('n')
      .setDescription('Number of messages you want to delete')
      .setRequired(false)
  );

export const execute = async (interaction: Interaction) => {
  const _interaction = interaction as BaseCommandInteraction;
  const n = _interaction.options.get('n')?.value;
  const messages = await _interaction.channel?.messages.fetch();

  if (!n) {
    // (_interaction.channel as TextBasedChannelFields).bulkDelete(
    //   messages!,
    //   false
    // );

    Promise.all(messages?.map(async (message) => message.delete())!).then(() =>
      _interaction.reply({ content: `I deleted all messages` })
    );
    return;
  }

  messages?.first(n as number).map((message) => message.delete());
  _interaction.reply({
    content: `${n} messages were deleted`,
    ephemeral: true,
  });
};

import { SlashCommandBuilder } from '@discordjs/builders';
import { BaseCommandInteraction, Interaction } from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('kick')
  .setDescription('Kick a player from the server')
  .addUserOption((input) =>
    input
      .setName('user')
      .setDescription('user that you want to kick')
      .setRequired(true)
  );

export const execute = (interaction: Interaction) => {
  const _interaction = interaction as BaseCommandInteraction;
  const user = _interaction.options.get('user')?.user;
  _interaction.guild?.members
    .kick(user!)
    .then(() =>
      _interaction.reply({
        content: `${user?.username} was successfully kicked`,
        ephemeral: true,
      })
    )
    .catch((err) => {
      _interaction.reply({
        content: `Can not kick ${user?.username} ${err}`,
        ephemeral: true,
      });
    });
};

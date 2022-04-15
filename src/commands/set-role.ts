import { SlashCommandBuilder } from '@discordjs/builders';
import {
  BaseCommandInteraction,
  Interaction,
  RoleResolvable,
} from 'discord.js';

export const data = new SlashCommandBuilder()
  .setName('set-role')
  .setDescription('Set the role of a user')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('username to set role')
      .setRequired(true)
  )
  .addRoleOption((option) =>
    option
      .setName('role')
      .setDescription('role to add to user')
      .setRequired(true)
  );

export const execute = async (interaction: Interaction) => {
  const _interaction = interaction as BaseCommandInteraction;
  const user = _interaction.options.get('user')?.user;
  const role = _interaction.options.get('role')?.role;
  let members = await interaction.guild?.members.fetch();
  members
    ?.find((member) => member.id == user!.id)
    ?.roles.add(role as RoleResolvable);
  _interaction.reply({
    content: `You set ${user?.username} role to ${role?.name}`,
    ephemeral: true,
  });
};

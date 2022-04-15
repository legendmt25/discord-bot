import { SlashCommandBuilder } from '@discordjs/builders';
import { BaseCommandInteraction, Interaction, MessageEmbed } from 'discord.js';
import fetch from 'node-fetch';

export const data = new SlashCommandBuilder()
  .setName('meme')
  .setDescription('Show a random meme');

export const execute = async (interaction: Interaction) => {
  const _interaction = interaction as BaseCommandInteraction;
  const memeData = await fetch('https://www.reddit.com/r/memes/random/.json', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data[0].data.children[0].data;
    });

  _interaction.reply({
    embeds: [
      new MessageEmbed()
        .setColor(0x00a2e8)
        .setTitle(memeData.title)
        .setDescription(memeData.author)
        .setImage(memeData.url)
        .setFooter({ text: 'Provided by r/memes' }),
    ],
  });
};

import fs from 'fs';

export const files = fs
  .readdirSync('./commands/')
  .filter((file) => file.endsWith('.ts'))
  .map((file) => import(`./commands/${file}`));

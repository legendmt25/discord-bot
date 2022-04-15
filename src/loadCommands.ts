import fs from 'fs';
import path from 'path'

export const files = fs
  .readdirSync(path.join(__dirname, '/commands'))
  .filter((file) => file.endsWith('.ts'))
  .map((file) => import(`./commands/${file}`));

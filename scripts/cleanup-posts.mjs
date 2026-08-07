import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

const postsDir = 'src/content/posts';
const files = glob.sync(`${postsDir}/*.md`);

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');

  // Remove remaining WordPress paragraph tags with classes
  content = content.replace(/<p class="[^"]*">/g, '');
  content = content.replace(/<\/p>/g, '');

  // Decode HTML entities
  content = content.replace(/&amp;lt;/g, '<');
  content = content.replace(/&amp;gt;/g, '>');
  content = content.replace(/&amp;quot;/g, '"');
  content = content.replace(/&amp;amp;/g, '&');
  content = content.replace(/&amp;#038;/g, '&');
  content = content.replace(/&lt;/g, '<');
  content = content.replace(/&gt;/g, '>');
  content = content.replace(/&quot;/g, '"');
  content = content.replace(/&nbsp;/g, ' ');
  content = content.replace(/&#038;/g, '&');

  // Remove fancybox/lazyload wrapper div remnants
  content = content.replace(/<div class='fancybox-wrapper[^']*'>/g, '');
  content = content.replace(/<div class='lazyload[^']*'>/g, '');
  content = content.replace(/<figure class="[^"]*">/g, '');
  content = content.replace(/<\/figure>/g, '');

  // Clean up excessive blank lines
  content = content.replace(/\n{4,}/g, '\n\n\n');

  // Trim trailing whitespace on lines
  content = content.replace(/[ \t]+$/gm, '');

  fs.writeFileSync(file, content, 'utf-8');
  console.log(`Cleaned: ${path.basename(file)}`);
}

console.log('All posts cleaned!');

// Extract WordPress posts from git history and convert to Markdown
import { execSync } from 'child_process';
import { parse } from 'node-html-parser';
import fs from 'fs';
import path from 'path';

const POSTS_DIR = 'src/content/posts';

// All 9 posts with metadata
const posts = [
  { slug: 'hello-world', date: '2025-08-08', category: '其他', tags: [] },
  { slug: 'test01', date: '2025-08-08', category: '其他', tags: [] },
  { slug: 'test02', date: '2025-08-08', category: '其他', tags: [] },
  { slug: 'enddisco', date: '2025-08-15', category: '题解', tags: ['C_C++', '算法'] },
  { slug: 'nowcodweekcom106b', date: '2025-08-24', category: '题解', tags: ['C_C++', 'Java', '算法'] },
  { slug: 'theprintfinc', date: '2025-09-10', category: '学习记录', tags: ['C_C++'] },
  { slug: 'thescanfinc', date: '2025-10-10', category: '学习记录', tags: ['C_C++'] },
  { slug: 'nkweekround116d', date: '2025-11-04', category: '题解', tags: ['C_C++', '算法'] },
  { slug: '%e5%ae%9e%e6%88%98-%e9%9b%b6%e6%88%90%e6%9c%ac%e6%89%93%e9%80%a0%e7%a7%81%e4%ba%ba-ai-%e5%8a%a9%e6%89%8b%ef%bc%9awin11-docker-%e6%9c%ac%e5%9c%b0%e9%83%a8%e7%bd%b2-qwen2-5-qq-%e6%9c%ba%e5%99%a8', date: '2026-01-14', category: '学习记录', tags: [] },
];

function decodeHtml(str) {
  return str
    .replace(/&amp;amp;/g, '&')
    .replace(/&amp;lt;/g, '<')
    .replace(/&amp;gt;/g, '>')
    .replace(/&amp;quot;/g, '"')
    .replace(/&amp;#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
    .replace(/&#8220;/g, '“')
    .replace(/&#8221;/g, '”')
    .replace(/&#8217;/g, '’')
    .replace(/&#8216;/g, '‘')
    .replace(/&#8230;/g, '…')
    .replace(/&#038;/g, '&');
}

function extractTitle(html) {
  const root = parse(html);
  const titleTag = root.querySelector('title');
  if (titleTag) {
    let title = titleTag.text;
    title = title.replace(/\s*[-–—]\s*ShiLiu_YinYu'?s?\s*blog\s*$/i, '').trim();
    return decodeHtml(title);
  }
  return '';
}

function extractPostContent(html) {
  const root = parse(html);
  const contentDiv = root.querySelector('#post_content');
  if (!contentDiv) return '';

  // Remove the outdated info banner
  const outdated = contentDiv.querySelector('.post-outdated-info');
  if (outdated) outdated.remove();

  return contentDiv.innerHTML;
}

function htmlToMarkdown(html) {
  let md = html;

  // Remove fancybox wrappers - extract img from data-original
  md = md.replace(/<div class='fancybox-wrapper[^']*'[^>]*>/g, '');
  md = md.replace(/<img[^>]*data-original="([^"]*)"[^>]*>/g, (match, src) => {
    // Convert wp-content/uploads path to /images/ path
    let newSrc = src.replace(/^\/?wp-content\/uploads\//, '/images/');
    // Remove -scaled and dimension suffixes from filename
    newSrc = newSrc.replace(/-scaled(\.[a-z]+)$/i, '$1');
    newSrc = newSrc.replace(/-\d+x\d+(?=\.[a-z]+$)/i, '');
    return `<img src="${newSrc}">`;
  });
  // Handle images in href attributes of fancybox
  md = md.replace(/<a[^>]*href="([^"]*\.(png|jpg|jpeg|webp|gif))"[^>]*>/gi, (match, href) => {
    let newSrc = href.replace(/^\/?wp-content\/uploads\//, '/images/');
    newSrc = newSrc.replace(/-scaled(\.[a-z]+)$/i, '$1');
    newSrc = newSrc.replace(/-\d+x\d+(?=\.[a-z]+$)/i, '');
    return `<a href="${newSrc}">`;
  });
  md = md.replace(/<\/div>\s*$/g, ''); // Remove closing divs from fancybox removal

  // Convert figure tags
  md = md.replace(/<figure class="wp-block-image[^"]*"[^>]*>/g, '');
  md = md.replace(/<\/figure>/g, '');

  // Convert headings
  md = md.replace(/<h2 class="wp-block-heading"[^>]*>/g, '## ');
  md = md.replace(/<\/h2>/g, '\n\n');
  md = md.replace(/<h3 class="wp-block-heading"[^>]*>/g, '### ');
  md = md.replace(/<\/h3>/g, '\n\n');
  md = md.replace(/<h4 class="wp-block-heading"[^>]*>/g, '#### ');
  md = md.replace(/<\/h4>/g, '\n\n');

  // Convert code blocks
  md = md.replace(/<pre class="wp-block-code"[^>]*><code>/g, '\n```\n');
  md = md.replace(/<\/code><\/pre>/g, '\n```\n');

  // Convert paragraphs
  md = md.replace(/<p class="wp-block-paragraph"[^>]*>/g, '');
  md = md.replace(/<\/p>/g, '\n\n');

  // Convert inline code
  md = md.replace(/<code>/g, '`');
  md = md.replace(/<\/code>/g, '`');

  // Convert strong
  md = md.replace(/<strong>/g, '**');
  md = md.replace(/<\/strong>/g, '**');

  // Convert emphasis
  md = md.replace(/<em>/g, '*');
  md = md.replace(/<\/em>/g, '*');

  // Convert lists
  md = md.replace(/<ul class="wp-block-list"[^>]*>/g, '');
  md = md.replace(/<ol class="wp-block-list"[^>]*>/g, '');
  md = md.replace(/<ul>/g, '');
  md = md.replace(/<\/ul>/g, '');
  md = md.replace(/<ol>/g, '');
  md = md.replace(/<\/ol>/g, '');
  md = md.replace(/<li>/g, '- ');
  md = md.replace(/<\/li>/g, '\n');

  // Convert horizontal rules
  md = md.replace(/<hr class="wp-block-separator[^"]*"[^>]*>/g, '\n---\n');
  md = md.replace(/<hr\/>/g, '\n---\n');
  md = md.replace(/<hr>/g, '\n---\n');

  // Convert images (remaining img tags)
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/g, '![$2]($1)');
  md = md.replace(/<img[^>]*alt="([^"]*)"[^>]*src="([^"]*)"[^>]*>/g, '![$1]($2)');
  md = md.replace(/<img[^>]*src="([^"]*)"[^>]*>/g, '![]($1)');

  // Convert links
  md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/g, '[$2]($1)');

  // Convert heading ids
  md = md.replace(/\s+id="[^"]*"/g, '');

  // Convert br
  md = md.replace(/<br\s*\/?>/g, '\n');

  // Remove remaining div/span tags
  md = md.replace(/<div[^>]*>/g, '');
  md = md.replace(/<\/div>/g, '');
  md = md.replace(/<span[^>]*>/g, '');
  md = md.replace(/<\/span>/g, '');

  // Decode HTML entities in the markdown
  md = decodeHtml(md);

  // Clean up whitespace
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.replace(/^\s+|\s+$/g, '');
  md = md.replace(/^[ \t]+/gm, '');

  return md;
}

// Process each post
for (const post of posts) {
  console.log(`Processing: ${post.slug}`);
  try {
    const html = execSync(`git show "HEAD:${post.slug}/index.html"`, { encoding: 'utf-8' });
    const title = extractTitle(html);
    const contentHtml = extractPostContent(html);
    const contentMd = htmlToMarkdown(contentHtml);

    // Build frontmatter
    let frontmatter = `---
title: "${title.replace(/"/g, '\\"')}"
published: ${post.date}
description: ''
`;
    if (post.tags.length > 0) {
      frontmatter += `tags: [${post.tags.join(', ')}]\n`;
    }
    if (post.category) {
      frontmatter += `category: '${post.category}'\n`;
    }
    frontmatter += `draft: false
---

${contentMd}
`;

    // Write the markdown file
    const filename = post.slug.replace(/%[0-9a-fA-F][0-9a-fA-F]/g, '') + '.md';
    // Decode URL-encoded chars in filename
    const decodedFilename = decodeURIComponent(filename)
      .replace(/[:：]/g, '-')
      .replace(/[?？]/g, '');
    const safeName = decodedFilename.replace(/[/\\:*?"<>|]/g, '-');
    const filepath = path.join(POSTS_DIR, safeName);
    fs.writeFileSync(filepath, frontmatter, 'utf-8');
    console.log(`  -> ${safeName}`);
    console.log(`     Title: ${title}`);
    console.log(`     Date: ${post.date}`);
  } catch (err) {
    console.error(`  ERROR for ${post.slug}: ${err.message}`);
  }
}

console.log('\nDone!');

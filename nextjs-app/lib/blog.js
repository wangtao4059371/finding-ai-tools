import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const blogDir = path.join(process.cwd(), 'content/blog');
const DEFAULT_COVER = '/blog/94ba520f6c6d8521f64c0d4da142be4f.webp';

function firstMarkdownImage(content) {
  const match = content.match(/!\[[^\]]*\]\(([^)]+)\)/);
  return match ? match[1] : '';
}

function estimateReadingTime(content) {
  const plain = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/!\[[^\]]*\]\([^)]+\)/g, '')
    .replace(/\[[^\]]+\]\([^)]+\)/g, '')
    .replace(/[#>*_`|~-]/g, ' ')
    .trim();
  const cjkCount = (plain.match(/[\u4e00-\u9fff]/g) || []).length;
  const wordCount = (plain.replace(/[\u4e00-\u9fff]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length;
  const minutes = Math.max(1, Math.ceil(cjkCount / 450 + wordCount / 220));
  return minutes;
}

function getCover(data, content) {
  return data.cover || firstMarkdownImage(content) || DEFAULT_COVER;
}

export function getHeadingsFromMarkdown(content) {
  return content
    .split('\n')
    .map(line => {
      const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
      if (!match) return null;
      const text = match[2].replace(/[#*_`[\]()]/g, '').trim();
      if (!text || text.toLowerCase() === 'english version') return null;
      return { level: match[1].length, text };
    })
    .filter(Boolean)
    .map((heading, index) => ({ ...heading, id: `section-${index}` }));
}

function postFromFile(file, { includeContent = false } = {}) {
  const raw = fs.readFileSync(path.join(blogDir, file), 'utf-8');
  const { data, content } = matter(raw);
  const post = {
    slug: file.replace('.md', ''),
    title: data.title || '',
    date: data.date || '',
    updated: data.updated || data.date || '',
    excerpt: data.excerpt || '',
    excerpt_en: data.excerpt_en || '',
    category: data.category || '',
    cover: getCover(data, content),
    source: data.source || '',
    readingTime: estimateReadingTime(content),
  };

  if (includeContent) {
    post.content = content;
  }

  return post;
}

export function getAllPosts() {
  if (!fs.existsSync(blogDir)) return [];
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  
  const posts = files.map(postFromFile);

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  const file = path.join(blogDir, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  return postFromFile(`${slug}.md`, { includeContent: true });
}

export function getCategories() {
  const posts = getAllPosts();
  return [...new Set(posts.map(p => p.category).filter(Boolean))];
}

export function getAdjacentPosts(slug) {
  const posts = getAllPosts();
  const index = posts.findIndex(p => p.slug === slug);
  return {
    previousPost: index >= 0 ? posts[index + 1] || null : null,
    nextPost: index > 0 ? posts[index - 1] || null : null,
  };
}

export function getRelatedPosts(slug, category, limit = 3) {
  return getAllPosts()
    .filter(post => post.slug !== slug && post.category === category)
    .slice(0, limit);
}

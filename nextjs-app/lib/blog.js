import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const blogDir = path.join(process.cwd(), 'content/blog');

export function getAllPosts() {
  if (!fs.existsSync(blogDir)) return [];
  const files = fs.readdirSync(blogDir).filter(f => f.endsWith('.md'));
  
  const posts = files.map(f => {
    const raw = fs.readFileSync(path.join(blogDir, f), 'utf-8');
    const { data, content } = matter(raw);
    return {
      slug: f.replace('.md', ''),
      title: data.title || '',
      date: data.date || '',
      excerpt: data.excerpt || '',
      category: data.category || '',
      cover: data.cover || '',
      content,
    };
  });

  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export function getPostBySlug(slug) {
  const file = path.join(blogDir, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, 'utf-8');
  const { data, content } = matter(raw);
  return { slug, title: data.title, date: data.date, excerpt: data.excerpt, category: data.category, cover: data.cover, source: data.source, content };
}

export function getCategories() {
  const posts = getAllPosts();
  return [...new Set(posts.map(p => p.category).filter(Boolean))];
}
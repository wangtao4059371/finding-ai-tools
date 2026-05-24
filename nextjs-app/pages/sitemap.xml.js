import { getAllTools } from '../lib/api';

function generateSiteMap(tools) {
  const baseUrl = 'https://findingaitools.com';
  const today = new Date().toISOString().split('T')[0];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${today}</lastmod>
  </url>
  <url><loc>${baseUrl}/about</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>${baseUrl}/contact</loc><changefreq>monthly</changefreq><priority>0.3</priority></url>
  <url><loc>${baseUrl}/privacy-policy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>${baseUrl}/terms</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>${baseUrl}/ratings</loc><changefreq>weekly</changefreq><priority>0.9</priority></url>
  <url><loc>${baseUrl}/blog</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  ${tools.filter(t => t.slug).map(tool => `
  <url>
    <loc>${baseUrl}/tool/${tool.slug}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${today}</lastmod>
  </url>`).join('')}
</urlset>`;
}

export default function SiteMap() { return null; }

export async function getServerSideProps({ res }) {
  const tools = await getAllTools();
  const sitemap = generateSiteMap(tools);
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.write(sitemap);
  res.end();
  return { props: {} };
}
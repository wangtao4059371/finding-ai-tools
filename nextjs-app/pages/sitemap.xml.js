import { getAllTools } from '../lib/api';

function generateSiteMap(tools, baseUrl) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>${baseUrl}</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
  ${tools.map(tool => `
  <url>
    <loc>${baseUrl}/tool/${tool.id}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('')}
</urlset>`;
}

export default function SiteMap() {
  return null;
}

export async function getServerSideProps({ res }) {
  const baseUrl = 'https://findingaitools.com';
  const tools = await getAllTools();
  const sitemap = generateSiteMap(tools, baseUrl);

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return { props: {} };
}
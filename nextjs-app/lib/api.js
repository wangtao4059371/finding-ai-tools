const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8001';

export async function getAllTools() {
  const res = await fetch(`${API_BASE}/api/tools`);
  if (!res.ok) throw new Error('Failed to fetch tools');
  return res.json();
}

export async function getToolBySlug(slug) {
  const res = await fetch(`${API_BASE}/api/tools/${slug}`);
  if (!res.ok) throw new Error(`Tool ${slug} not found`);
  return res.json();
}
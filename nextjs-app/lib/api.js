const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8001';

export async function getAllTools() {
  const res = await fetch(`${API_BASE}/api/tools`);
  if (!res.ok) throw new Error('Failed to fetch tools');
  return res.json();
}

export async function getToolById(id) {
  const res = await fetch(`${API_BASE}/api/tools/${id}`);
  if (!res.ok) throw new Error(`Tool ${id} not found`);
  return res.json();
}

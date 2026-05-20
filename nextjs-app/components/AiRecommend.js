'use client';
import { useState } from 'react';

export default function AiRecommend({ locale }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const hints = locale === 'zh'
    ? ['我需要写营销文案的AI工具', '适合学生的免费AI绘画工具', '能帮我写代码的AI助手']
    : ['AI tools for writing marketing copy', 'Free AI image tools for students', 'AI assistant for coding'];

  const search = async () => {
    if (!query.trim()) return;
    setLoading(true); setError(''); setResult(null);
    try {
      const API = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8001';
      const res = await fetch(`${API}/api/ai-recommend`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });
      if (!res.ok) throw new Error();
      setResult(await res.json());
    } catch (e) {
      setError(locale === 'zh' ? '推荐失败，请稍后重试' : 'Failed, please try again');
    }
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 rounded-xl p-6 text-white">
      <h3 className="text-lg font-bold mb-2">
        {locale === 'zh' ? '🤖 AI 智能推荐' : '🤖 AI Recommendations'}
      </h3>
      <p className="text-sm text-white/80 mb-4">
        {locale === 'zh' ? '描述你的需求，AI 帮你找到最合适的工具' : 'Describe your needs, AI finds the best tools'}
      </p>
      <div className="flex gap-2 mb-3">
        <input
          value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && search()}
          placeholder={locale === 'zh' ? '例如：我需要一个能生成短视频的AI工具' : 'e.g. I need an AI tool for video creation'}
          className="flex-1 px-4 py-2.5 rounded-lg text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
        />
        <button onClick={search} disabled={loading}
          className="px-5 py-2.5 bg-white text-indigo-600 rounded-lg font-semibold text-sm hover:bg-indigo-50 disabled:opacity-50 transition">
          {loading ? '...' : locale === 'zh' ? '推荐' : 'Find'}
        </button>
      </div>
      {!result && (
        <div className="flex flex-wrap gap-2">
          {hints.map((h, i) => (
            <button key={i} onClick={() => { setQuery(h); }}
              className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition">
              {h}
            </button>
          ))}
        </div>
      )}
      {error && <p className="text-red-200 text-sm mt-2">{error}</p>}
      {result && (
        <div className="mt-3 bg-white/10 rounded-lg p-4">
          <p className="text-sm mb-3">{result.reason}</p>
          {result.tools && result.tools.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {result.tools.map(t => (
                <a key={t.id} href={`/tool/${t.slug || t.id}`}
                  className="inline-block bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-medium transition">
                  {t.name} →
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
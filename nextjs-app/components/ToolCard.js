import Link from 'next/link';
import Image from 'next/image';
import { trackEvent, trackVisitProject } from '../lib/analytics';
import { useLocale } from '../lib/i18n';

function toolLogo(tool) {
  return tool.owner_avatar_url || tool.logo || '/favicon.svg';
}

function githubPath(tool) {
  if (tool.owner_login && tool.repo_name) return `${tool.owner_login}/${tool.repo_name}`;
  try {
    const url = new URL(tool.url);
    if (url.hostname !== 'github.com') return '';
    const [owner, repo] = url.pathname.split('/').filter(Boolean);
    return owner && repo ? `${owner}/${repo.replace(/\.git$/, '')}` : '';
  } catch (e) {
    return '';
  }
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().slice(0, 10);
}

export default function ToolCard({ tool }) {
  const locale = useLocale();
  const repoPath = githubPath(tool);
  const lastPush = formatDate(tool.pushed_at);
  
  return (
    <Link
      href={`/tool/${tool.slug || tool.id}`}
      onClick={() => trackEvent('select_tool', {
        tool_name: tool.name,
        tool_slug: tool.slug || tool.id,
        tool_category: tool.tag,
        tool_type: tool.type,
        source: 'tool_card',
      })}
    >
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between relative overflow-hidden group">
        <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg ${tool.type === 'Agent' ? 'bg-purple-600' : 'bg-blue-500'} text-white`}>
          {tool.type.toUpperCase()}
        </div>

        <div>
          <div className="flex items-start justify-between mb-4 mt-2">
            <div className="relative">
              <Image
                src={toolLogo(tool)}
                alt={tool.name}
                width={56}
                height={56}
                className="rounded-xl bg-gray-100 dark:bg-gray-700 object-cover border border-gray-200 dark:border-gray-600 transition-transform group-hover:scale-110"
                unoptimized
                loading="lazy"
              />
              <div className="absolute inset-0 rounded-xl bg-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tool.name}</h3>
          {repoPath && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 truncate">{repoPath}</p>
          )}
          {repoPath && (
            <div className="flex flex-wrap items-center gap-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
              {tool.language && <span>{tool.language}</span>}
              {tool.stars > 0 && <span>★ {tool.stars.toLocaleString()}</span>}
              {lastPush && <span>{locale === 'zh' ? '更新' : 'Updated'} {lastPush}</span>}
            </div>
          )}
          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4 leading-relaxed">{tool.description}</p>
          
          {tool.type === 'Agent' && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4 border border-gray-100 dark:border-gray-600">
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-300 mb-1">
                <span className="font-semibold w-12">{locale === 'zh' ? '基座:' : 'Base:'}</span> <span className="text-indigo-600 dark:text-indigo-400">{tool.base_model}</span>
              </div>
              <div className="flex items-center text-xs text-gray-600 dark:text-gray-300">
                <span className="font-semibold w-12">{locale === 'zh' ? '框架:' : 'Framework:'}</span> <span className="text-purple-600 dark:text-purple-400">{tool.framework}</span>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 dark:border-gray-700">
          <div className="flex flex-col gap-1">
            <span className="inline-block text-gray-500 dark:text-gray-400 text-xs"># {tool.tag}</span>
            <span className="text-xs font-medium text-green-600 dark:text-green-400">{tool.pricing}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            {!repoPath && tool.stars > 0 && (
              <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">⭐ {tool.stars.toLocaleString()}</span>
            )}
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              trackVisitProject(tool, 'tool_card');
              window.open(tool.url, '_blank', 'noopener,noreferrer');
            }}>
            {locale === 'zh' ? '访问项目' : 'Visit'} →
          </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

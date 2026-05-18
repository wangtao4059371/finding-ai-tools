import Link from 'next/link';
import Image from 'next/image';
import { getLocale } from '../lib/i18n';

export default function ToolCard({ tool }) {
  const locale = getLocale();
  
  return (
    <Link href={`/tool/${tool.id}`}>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer h-full flex flex-col justify-between relative overflow-hidden group">
        <div className={`absolute top-0 right-0 px-3 py-1 text-xs font-bold rounded-bl-lg ${tool.type === 'Agent' ? 'bg-purple-600' : 'bg-blue-500'} text-white`}>
          {tool.type.toUpperCase()}
        </div>

        <div>
          <div className="flex items-start justify-between mb-4 mt-2">
            <div className="relative">
              <Image
                src={tool.logo}
                alt={tool.name}
                width={56}
                height={56}
                className="rounded-xl bg-gray-100 dark:bg-gray-700 object-cover border border-gray-200 dark:border-gray-600 transition-transform group-hover:scale-110"
                unoptimized
              />
              <div className="absolute inset-0 rounded-xl bg-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tool.name}</h3>
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
          <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-800 dark:group-hover:text-indigo-300 transition-colors">
            {locale === 'zh' ? '访问项目' : 'Visit'} →
          </span>
        </div>
      </div>
    </Link>
  );
}
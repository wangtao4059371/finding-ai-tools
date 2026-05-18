const translations = {
  zh: {
    title: '🤖 AI 智能体与工具导航',
    searchPlaceholder: '搜索 AI 工具...',
    allTools: '全部收录',
    noResults: '该分类暂无收录',
    loadMore: '加载更多',
    loading: '加载中...',
    visitProject: '访问项目',
    footer: '© 2026 AI 智能体与工具导航',
    darkMode: '深色模式',
    lightMode: '浅色模式',
    categories: '分类导航',
    price: '价格',
    type: '类型',
    baseModel: '基座',
    framework: '框架',
    backToList: '← 返回列表',
    toolNotFound: '工具未找到',
  },
  en: {
    title: '🤖 AI Agents & Tools Directory',
    searchPlaceholder: 'Search AI tools...',
    allTools: 'All Tools',
    noResults: 'No tools in this category',
    loadMore: 'Load More',
    loading: 'Loading...',
    visitProject: 'Visit Project',
    footer: '© 2026 AI Agents & Tools Directory',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    categories: 'Categories',
    price: 'Price',
    type: 'Type',
    baseModel: 'Base',
    framework: 'Framework',
    backToList: '← Back to List',
    toolNotFound: 'Tool Not Found',
  },
};

export function getLocale() {
  if (typeof navigator === 'undefined') return 'en';
  
  const locale = navigator.language || navigator.userLanguage || 'en';
  if (locale.startsWith('zh')) return 'zh';
  return 'en';
}

export function t(key) {
  const locale = getLocale();
  return translations[locale]?.[key] || translations.en[key] || key;
}

export default translations;
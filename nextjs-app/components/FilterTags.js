export default function FilterTags({ tags, activeTag, onFilter }) {
  return (
    <div className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2">
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onFilter(tag)}
          className={`px-3 py-2 text-left text-sm rounded-lg font-medium whitespace-nowrap transition-all ${
            activeTag === tag 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {tag === '全部' ? '全部收录' : tag}
        </button>
      ))}
    </div>
  );
}
<Link
                href="/blog"
                className={`px-4 py-2 rounded-lg text-base font-semibold transition-colors ${
                  router.pathname.startsWith('/blog')
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                📝 {locale === 'zh' ? '博客' : 'Blog'}
              </Link>
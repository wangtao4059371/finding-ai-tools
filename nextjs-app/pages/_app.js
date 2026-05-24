import { useEffect } from 'react';
import Head from 'next/head';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
        gtag('event', 'user_engaged_2min', { page: window.location.pathname });
      }
    }, 120000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Head>
        <title>Finding AI Tools - Best AI Tools Directory & LLM Rankings</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
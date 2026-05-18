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
  }, []);

  return (
    <>
      <Head>
        <title>Finding AI Tools - Best AI Agents & Tools Directory</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
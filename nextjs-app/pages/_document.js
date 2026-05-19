import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#4F46E5" />

        {/* Primary Meta */}
        <meta name="title" content="Finding AI Tools - Best AI Agents & Tools Directory" />
        <meta name="description" content="Discover the best AI tools, agents, and foundation models. ChatGPT, Claude, Gemini, Midjourney, Stable Diffusion - all in one place. Find the perfect AI tool for your needs." />
        <meta name="keywords" content="AI tools, AI agents, ChatGPT, Gemini, Claude, Midjourney, AI directory, AI navigation, AI models, free AI tools, AI writing, AI image generation, AI video, deepseek, qianwen" />
        <meta name="author" content="Finding AI Tools" />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://findingaitools.com" />
        <meta property="og:title" content="Finding AI Tools - Best AI Agents & Tools Directory" />
        <meta property="og:description" content="Discover the best AI tools, agents, and foundation models. Find the perfect AI tool for your needs." />
        <meta property="og:site_name" content="Finding AI Tools" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Finding AI Tools - Best AI Agents & Tools Directory" />
        <meta name="twitter:description" content="Discover the best AI tools, agents, and foundation models." />

        {/* Favicon */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🤖</text></svg>" />

        {/* Canonical */}
        <link rel="canonical" href="https://findingaitools.com" />

        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXX" crossOrigin="anonymous" />

        {/* Google Analytics */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-FDJECB72N1" />
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FDJECB72N1');
          `
        }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
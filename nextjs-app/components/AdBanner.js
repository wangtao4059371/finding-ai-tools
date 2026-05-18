export default function AdBanner({ style = 'rectangle' }) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="my-4 p-4 text-center bg-gray-100 border border-dashed border-gray-300 rounded text-gray-400 text-sm">
        📢 广告位 (336×280)
      </div>
    );
  }

  return (
    <div className="my-4">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
        data-ad-slot="XXXXXXXXXX"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
      <script dangerouslySetInnerHTML={{
        __html: `(adsbygoogle = window.adsbygoogle || []).push({});`
      }} />
    </div>
  );
}

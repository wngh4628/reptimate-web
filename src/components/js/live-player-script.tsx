// 경로 : './components/Scripts/GoogleAnalytics.tsx'
import Script from 'next/script';

const LivePlayerScript = () => {
  return (
    <>
      {/* <Script
        src={"js/demo.jsx"}
        strategy="afterInteractive"
        onLoad={() =>
          console.log(`script loaded correctly, window.FB has been populated`)
        }
      ></Script> */}
      <script src="/js/demo.jsx" defer />

      {/* <Script id="nextjs-google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.GA}', {
            page_path: window.location.pathname,
          });
        `}
      </Script> */}
    </>
  );
};

export default LivePlayerScript;
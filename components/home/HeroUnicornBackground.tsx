"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

const unicornProjectId = "sssBBwGfmEYOMRvrdA1i";
const unicornWidth = 1440;
const unicornHeight = 900;
const unicornVerticalBleed = 200;
const unicornBootstrapScript = `!function(){var u=window.UnicornStudio;if(u&&u.init){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",function(){u.init()})}else{u.init()}}else{window.UnicornStudio={isInitialized:!1};var i=document.createElement("script");i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.5/dist/unicornStudio.umd.js",i.onload=function(){if(document.readyState==="loading"){document.addEventListener("DOMContentLoaded",function(){UnicornStudio.init()})}else{UnicornStudio.init()}},(document.head||document.body).appendChild(i)}}();`;

export default function HeroUnicornBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const hideBranding = () => {
      const directTargets = root.querySelectorAll<HTMLElement>(
        [
          "a[href*='unicorn.studio']",
          "a[href*='unicornstudio']",
          "[data-us-branding]",
          "[class*='unicorn'][class*='badge']",
          "[id*='unicorn'][id*='badge']",
        ].join(",")
      );

      directTargets.forEach((element) => {
        element.style.setProperty("display", "none", "important");
        element.style.setProperty("visibility", "hidden", "important");
        element.style.setProperty("opacity", "0", "important");
      });

      root.querySelectorAll<HTMLElement>("a, div, span, p").forEach((element) => {
        const text = (element.textContent || "").trim().toLowerCase();
        if (text.includes("made") && text.includes("unicorn studio")) {
          element.style.setProperty("display", "none", "important");
          element.style.setProperty("visibility", "hidden", "important");
          element.style.setProperty("opacity", "0", "important");
        }
      });
    };

    hideBranding();
    const observer = new MutationObserver(() => hideBranding());
    observer.observe(root, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Script
        id="hero-unicorn-studio-bootstrap"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: unicornBootstrapScript }}
      />

      <div
        ref={containerRef}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div
          data-us-project={unicornProjectId}
          className="absolute left-1/2 top-1/2 min-h-full min-w-full -translate-y-1/2 -translate-x-1/2 md:left-[60%]"
          style={{
            width: `max(${unicornWidth}px, 100%)`,
            height: `max(${unicornHeight + unicornVerticalBleed * 2}px, calc(100% + ${unicornVerticalBleed * 2}px))`,
          }}
        />
      </div>
    </>
  );
}

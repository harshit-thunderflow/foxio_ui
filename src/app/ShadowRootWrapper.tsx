import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ShadowRootWrapperProps {
  children: (mountNode: HTMLElement) => React.ReactNode;
  styles: string;
}

export function ShadowRootWrapper({ children, styles }: ShadowRootWrapperProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mountNode, setMountNode] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hostRef.current || hostRef.current.shadowRoot) return;

    const shadow = hostRef.current.attachShadow({ mode: "open" });

    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    shadow.appendChild(styleEl);

    const container = document.createElement("div");
    container.id = "foxio-root";
    container.className = "foxio-widget";
    container.style.height = "100%";
    container.style.width = "100%";
    shadow.appendChild(container);

    setMountNode(container);
  }, [styles]);

  return (
    <div ref={hostRef} style={{ height: "100%", width: "100%" }}>
      {mountNode && createPortal(children(mountNode), mountNode)}
    </div>
  );
}

import { useEffect, useState } from "react";

interface HostUrlState {
  url: string | null;
  loading: boolean;
  error: string | null;
}

export function useHostUrl() {
  const [state, setState] = useState<HostUrlState>({
    url: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Fallback to document.referrer if no postMessage received
      if (document.referrer) {
        setState({ url: document.referrer, loading: false, error: null });
      } else {
        setState({ url: null, loading: false, error: "Could not detect host URL" });
      }
    }, 2000);

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "FOXIO_HOST_URL") {
        clearTimeout(timeout);
        setState({ url: event.data.url, loading: false, error: null });
      }
    };

    window.addEventListener("message", handler);
    // Request host info from parent
    window.parent.postMessage({ type: "FOXIO_REQUEST_HOST" }, "*");

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("message", handler);
    };
  }, []);

  return state;
}

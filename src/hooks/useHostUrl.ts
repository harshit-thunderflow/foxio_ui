import { useEffect, useState } from "react";

interface HostUrlState {
  url: string | null;
  host: string | null;
  pathname: string | null;
  loading: boolean;
  error: string | null;
}

export function useHostUrl() {
  const [state, setState] = useState<HostUrlState>({
    url: null,
    host: null,
    pathname: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (document.referrer) {
        const u = new URL(document.referrer);
        setState({ url: document.referrer, host: u.host, pathname: u.pathname, loading: false, error: null });
      } else {
        setState({ url: null, host: null, pathname: null, loading: false, error: "Could not detect host URL" });
      }
    }, 2000);

    const handler = (event: MessageEvent) => {
      if (event.data?.type === "FOXIO_HOST_URL") {
        clearTimeout(timeout);
        const u = new URL(event.data.url);
        setState({ url: event.data.url, host: u.host, pathname: u.pathname, loading: false, error: null });
      }
      if (event.data?.type === "FOXIO_ROUTE_CHANGE") {
        setState({
          url: event.data.url,
          host: event.data.host,
          pathname: event.data.pathname,
          loading: false,
          error: null,
        });
      }
    };

    window.addEventListener("message", handler);
    window.parent.postMessage({ type: "FOXIO_REQUEST_HOST" }, "*");

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("message", handler);
    };
  }, []);

  return state;
}

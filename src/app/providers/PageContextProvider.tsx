import { createContext, useContext, useReducer, useEffect, useCallback } from "react";

// --- Types ---
export interface PublicPageContext {
  url: string;
  title: string;
  visible_text: string;
  headings: string[];
  selected_text: string;
  metadata: {
    site: string;
    language: string;
  };
  interactive_elements: {
    type: string;
    text: string;
    selector: string;
  }[];
}

export interface CRMPageContext {
  app_name: string;
  page_type: string;
  record_type: string;
  record_name: string;
  visible_actions: string[];
  breadcrumbs: string[];
  forms: {
    label: string;
    value: string;
    editable: boolean;
  }[];
}

interface PageContextState {
  publicContext: PublicPageContext | null;
  crmContext: CRMPageContext | null;
  loading: boolean;
  lastUpdated: string | null;
  labelDismissed: boolean;
}

type PageContextAction =
  | { type: "SET_PUBLIC_CONTEXT"; payload: PublicPageContext }
  | { type: "SET_CRM_CONTEXT"; payload: CRMPageContext }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "DISMISS_LABEL" }
  | { type: "CLEAR" };

const initialState: PageContextState = {
  publicContext: null,
  crmContext: null,
  loading: true,
  lastUpdated: null,
  labelDismissed: false,
};

function reducer(state: PageContextState, action: PageContextAction): PageContextState {
  switch (action.type) {
    case "SET_PUBLIC_CONTEXT":
      return { ...state, publicContext: action.payload, loading: false, lastUpdated: new Date().toISOString() };
    case "SET_CRM_CONTEXT":
      return { ...state, crmContext: action.payload, loading: false, lastUpdated: new Date().toISOString() };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "DISMISS_LABEL":
      return { ...state, labelDismissed: true };
    case "CLEAR":
      return initialState;
    default:
      return state;
  }
}

// --- Context ---
interface PageContextValue extends PageContextState {
  requestContext: () => void;
  dismissLabel: () => void;
}

const PageContext = createContext<PageContextValue>({
  ...initialState,
  requestContext: () => {},
  dismissLabel: () => {},
});

// --- Provider ---
export function PageContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const requestContext = useCallback(() => {
    dispatch({ type: "SET_LOADING", payload: true });
    window.parent.postMessage({ type: "FOXIO_REQUEST_PAGE_CONTEXT" }, "*");
  }, []);

  const dismissLabel = useCallback(() => {
    dispatch({ type: "DISMISS_LABEL" });
  }, []);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "FOXIO_PAGE_CONTEXT") {
        dispatch({ type: "SET_PUBLIC_CONTEXT", payload: event.data.context });
      }
      if (event.data?.type === "FOXIO_CRM_CONTEXT") {
        dispatch({ type: "SET_CRM_CONTEXT", payload: event.data.context });
      }
    };

    window.addEventListener("message", handler);

    // Request context on mount
    requestContext();

    return () => window.removeEventListener("message", handler);
  }, [requestContext]);

  return (
    <PageContext.Provider value={{ ...state, requestContext, dismissLabel }}>
      {children}
    </PageContext.Provider>
  );
}

export const usePageContext = () => useContext(PageContext);

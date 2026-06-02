import { createContext, useContext, useState } from "react";
import { useEffect } from "react";

type PageTitleContextType = {
  pageTitle: string;
  setPageTitle: (title: string) => void;
};

const PageTitleContext = createContext<PageTitleContextType>({
  pageTitle: "",
  setPageTitle: () => {},
});

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
  const [pageTitle, setPageTitle] = useState("");
  return (
    <PageTitleContext.Provider value={{ pageTitle, setPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}

/** Call in any page component to set the header title */
export function usePageTitle(title: string) {
  const { setPageTitle } = useContext(PageTitleContext);
  useEffect(() => {
    setPageTitle(title);
  }, [title, setPageTitle]);
}

/** Used by AppHeader to read current page title */
export function useCurrentPageTitle() {
  return useContext(PageTitleContext).pageTitle;
}

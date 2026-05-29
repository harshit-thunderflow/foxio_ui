import { usePageContext, type PublicPageContext } from "@/app/providers/PageContextProvider";

export function usePublicPageContext(): {
  context: PublicPageContext | null;
  loading: boolean;
  lastUpdated: string | null;
  refresh: () => void;
} {
  const { publicContext, loading, lastUpdated, requestContext } = usePageContext();
  return { context: publicContext, loading, lastUpdated, refresh: requestContext };
}

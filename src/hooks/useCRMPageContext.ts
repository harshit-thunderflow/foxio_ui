import { usePageContext, type CRMPageContext } from "@/app/providers/PageContextProvider";

export function useCRMPageContext(): {
  context: CRMPageContext | null;
  loading: boolean;
  lastUpdated: string | null;
  refresh: () => void;
} {
  const { crmContext, loading, lastUpdated, requestContext } = usePageContext();
  return { context: crmContext, loading, lastUpdated, refresh: requestContext };
}

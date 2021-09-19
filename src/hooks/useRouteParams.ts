import { useLocation, useParams } from "react-router-dom";
import urlon from "urlon";
import { useMemo } from "react";

export function useRouteParams() {
  const urlParams = useParams() as Record<string, any>;
  const searchParamsString = useLocation().search.slice(1);
  const searchParams = useMemo(
    () => (!!searchParamsString ? urlon.parse(searchParamsString) : {}),
    [searchParamsString]
  );
  return useMemo(
    () => ({ urlParams, searchParams }),
    [searchParams, urlParams]
  );
}

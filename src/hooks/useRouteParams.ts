import { useLocation, useParams } from "react-router-dom";
import urlon from "urlon";
import { useMemo } from "react";
import { DEFAULT_SIZE } from "../constants/params";

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
export function useCollectionSize() {
  const {
    searchParams: { size },
  } = useRouteParams();
  return size || DEFAULT_SIZE;
}
export function useIsBackgroundOperation() {
  return useRouteParams().searchParams.backgroundOp;
}

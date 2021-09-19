import { ExtractRouteParams, generatePath } from "react-router";
import urlon from "urlon";
type Params<S extends string> = {
  routeParams?: ExtractRouteParams<S, string | number | boolean> | undefined;
  queryParams?: Record<string, any> | undefined;
};
export function generateUrlonPath<S extends string>(
  path: S,
  params?: Params<S>
) {
  const queryUrlonParams = urlon.stringify(params?.queryParams || {});
  const generatedPath = generatePath(path, params?.routeParams);
  return queryUrlonParams
    ? `${generatedPath}?${queryUrlonParams}`
    : generatedPath;
}

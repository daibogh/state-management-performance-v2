import React, { useMemo } from "react";
import { useRouteParams } from "../../hooks/useRouteParams";
import { ListHooks } from "./containers/ListHooks";
import { MatrixHooks } from "./containers/MatrixHooks";

const buildExperimentHooksComponent: (isRef?: boolean) => React.FC =
  (isRef) => () => {
    const {
      urlParams: { experimentId },
    } = useRouteParams();
    const experimentNode = useMemo(() => {
      if (experimentId === "list") {
        return <ListHooks isRef={isRef} />;
      }
      if (experimentId === "matrix") {
        return <MatrixHooks isRef={isRef} />;
      }
    }, [experimentId]);
    return experimentNode || null;
  };

export default buildExperimentHooksComponent;

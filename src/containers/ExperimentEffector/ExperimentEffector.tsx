import React, { useMemo } from "react";
import { useRouteParams } from "../../hooks/useRouteParams";
import { ListEffector } from "./containers/ListEffector";
import { MatrixEffector } from "./containers/MatrixEffector";

const ExperimentEffector: React.FC = () => {
  const {
    urlParams: { experimentId },
  } = useRouteParams();
  const experimentNode = useMemo(() => {
    if (experimentId === "list") {
      return <ListEffector />;
    }
    if (experimentId === "matrix") {
      return <MatrixEffector />;
    }
  }, [experimentId]);
  return experimentNode || null;
};
export default ExperimentEffector;

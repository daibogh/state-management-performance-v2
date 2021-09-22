import React, { useMemo } from "react";
import { useRouteParams } from "../../hooks/useRouteParams";

export function getExperimentWrapper(
  ListExperiment: React.FC,
  MatrixExperiment: React.FC,
  Container: React.FC = ({ children }) => <>{children}</>
): React.FC {
  return () => {
    const {
      urlParams: { experimentId },
    } = useRouteParams();
    const experimentNode = useMemo(() => {
      if (experimentId === "list") {
        return <ListExperiment />;
      }
      if (experimentId === "matrix") {
        return <MatrixExperiment />;
      }
    }, [experimentId]);
    return <Container>{experimentNode}</Container>;
  };
}

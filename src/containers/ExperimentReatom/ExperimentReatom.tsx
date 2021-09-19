import React, { useMemo } from "react";
import { useRouteParams } from "../../hooks/useRouteParams";

import { reatomContext } from "@reatom/react";
import { reatomStore } from "./store";
import { ListReatom } from "./containers/ListReatom";
import { MatrixReatom } from "./containers/MatrixReatom";
const ExperimentReatom: React.FC = () => {
  const {
    urlParams: { experimentId },
  } = useRouteParams();
  const experimentNode = useMemo(() => {
    if (experimentId === "list") {
      return <ListReatom />;
    }
    if (experimentId === "matrix") {
      return <MatrixReatom />;
    }
  }, [experimentId]);
  return (
    <reatomContext.Provider value={reatomStore}>
      {experimentNode}
    </reatomContext.Provider>
  );
};
export default ExperimentReatom;

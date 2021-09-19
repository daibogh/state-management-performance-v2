import React, { useMemo } from "react";
import { useRouteParams } from "../../hooks/useRouteParams";
import { RootStore, StoreContext } from "./store";
import { ListMobx } from "./containers/ListMobx";
import { MatrixMobx } from "./containers/MatrixMobx";
const rootStore = new RootStore();
const ExperimentMobx: React.FC = () => {
  const {
    urlParams: { experimentId },
  } = useRouteParams();
  const experimentNode = useMemo(() => {
    if (experimentId === "list") {
      return <ListMobx />;
    }
    if (experimentId === "matrix") {
      return <MatrixMobx />;
    }
  }, [experimentId]);
  return (
    <StoreContext.Provider value={rootStore}>
      {experimentNode}
    </StoreContext.Provider>
  );
};
export default ExperimentMobx;

import React, { useMemo } from "react";
import { useRouteParams } from "../../hooks/useRouteParams";
import { Provider } from "react-redux";
import store from "./store";
import { ListRedux } from "./containers/ListRedux";
import { MatrixRedux } from "./containers/MatrixRedux";

const ExperimentRedux: React.FC = () => {
  const {
    urlParams: { experimentId },
  } = useRouteParams();
  const experimentNode = useMemo(() => {
    if (experimentId === "list") {
      return <ListRedux />;
    }
    if (experimentId === "matrix") {
      return <MatrixRedux />;
    }
  }, [experimentId]);

  return <Provider store={store}>{experimentNode}</Provider>;
};
export default ExperimentRedux;

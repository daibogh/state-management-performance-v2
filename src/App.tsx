import React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { SocketConnectionProvider } from "./hooks/useSocketConnection";
import { Layout } from "./containers/Layout";
import { EXPERIMENT_PATH, EXPERIMENT_PATH_STRICT } from "./constants/routes";
import { generateExperimentPathWithFramework } from "./utils/generateExperimentPathWithFramework";
import { MeasureResultProvider } from "./hooks/useMeasureResult";
import { getExperimentWrapper } from "./containers/ExperimentWrapper/ExpperimentWrapper";
import { ListRedux } from "./containers/ExperimentRedux/containers/ListRedux";
import { MatrixRedux } from "./containers/ExperimentRedux/containers/MatrixRedux";
import { ReduxProvider } from "./containers/ExperimentRedux/containers/ReduxProvider";
import { ListMobx } from "./containers/ExperimentMobx/containers/ListMobx";
import { MatrixMobx } from "./containers/ExperimentMobx/containers/MatrixMobx";
import { MobxProvider } from "./containers/ExperimentMobx/containers/MobxProvider";
import { ListReatom } from "./containers/ExperimentReatom/containers/ListReatom";
import { MatrixReatom } from "./containers/ExperimentReatom/containers/MatrixReatom";
import { ReatomProvider } from "./containers/ExperimentReatom/containers/ReatomProvider";
import { ListEffector } from "./containers/ExperimentEffector/containers/ListEffector";
import { MatrixEffector } from "./containers/ExperimentEffector/containers/MatrixEffector";
import { ListHooks } from "./containers/ExperimentHooks/containers/ListHooks";
import { MatrixHooks } from "./containers/ExperimentHooks/containers/MatrixHooks";
import { ListNanostores } from "./containers/ExperimentNanostores/containers/ListNanostores";
import { MatrixNanostores } from "./containers/ExperimentNanostores/containers/MatrixNanostores";
import ResultsConslusion from "./containers/results-conclusion/ResultsConslusion";
const mappedFrameworkRoutes = [
  {
    path: generateExperimentPathWithFramework("redux"),
    Component: getExperimentWrapper(ListRedux, MatrixRedux, ReduxProvider),
  },
  {
    path: generateExperimentPathWithFramework("mobx"),
    Component: getExperimentWrapper(ListMobx, MatrixMobx, MobxProvider),
  },
  {
    path: generateExperimentPathWithFramework("reatom"),
    Component: getExperimentWrapper(ListReatom, MatrixReatom, ReatomProvider),
  },
  {
    path: generateExperimentPathWithFramework("effector"),
    Component: getExperimentWrapper(ListEffector, MatrixEffector),
  },
  {
    path: generateExperimentPathWithFramework("nanostores"),
    Component: getExperimentWrapper(ListNanostores, MatrixNanostores),
  },
  {
    path: generateExperimentPathWithFramework("react_state"),
    Component: getExperimentWrapper(ListHooks, MatrixHooks),
  },
  // {
  //   path: generateExperimentPathWithFramework("react_ref"),
  //   Component: getExperimentWrapper(
  //     () => <ListHooks isRef />,
  //     () => <MatrixHooks isRef />
  //   ),
  // },
];
function App() {
  return (
    <SocketConnectionProvider>
      <MeasureResultProvider>
        <Router>
          <Switch>
            <Route path={"/conclusion"}>
              <ResultsConslusion />
            </Route>
            <Route path={[EXPERIMENT_PATH, "/"]}>
              <Layout>
                <Switch>
                  <Route path={EXPERIMENT_PATH_STRICT}>
                    {mappedFrameworkRoutes.map(({ path, Component }) => (
                      <Route path={path} component={Component} key={path} />
                    ))}
                  </Route>
                </Switch>
              </Layout>
            </Route>
          </Switch>
        </Router>
      </MeasureResultProvider>
    </SocketConnectionProvider>
  );
}

export default App;

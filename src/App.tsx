import React from "react";
import { Route, Switch, BrowserRouter as Router } from "react-router-dom";
import { SocketConnectionProvider } from "./hooks/useSocketConnection";
import { Layout } from "./containers/Layout";
import { EXPERIMENT_PATH, EXPERIMENT_PATH_STRICT } from "./constants/routes";
import { generateExperimentPathWithFramework } from "./utils/generateExperimentPathWithFramework";
import { ExperimentRedux } from "./containers/ExperimentRedux";
import { ExperimentMobx } from "./containers/ExperimentMobx";
import { ExperimentReatom } from "./containers/ExperimentReatom";
import { MeasureResultProvider } from "./hooks/useMeasureResult";
import ExperimentEffector from "./containers/ExperimentEffector/ExperimentEffector";
const mappedFrameworkRoutes = [
  {
    path: generateExperimentPathWithFramework("redux"),
    Component: ExperimentRedux,
  },
  {
    path: generateExperimentPathWithFramework("mobx"),
    Component: ExperimentMobx,
  },
  {
    path: generateExperimentPathWithFramework("reatom"),
    Component: ExperimentReatom,
  },
  {
    path: generateExperimentPathWithFramework("effector"),
    Component: ExperimentEffector,
  },
];
function App() {
  return (
    <SocketConnectionProvider>
      <MeasureResultProvider>
        <Router>
          <Switch>
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

import React, { useContext } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import classNames from "./Layout.module.scss";
import Config from "../Config/Config";
import { PerformanceChart } from "../../components/PerformanceChart";
import { MeasureResultContext } from "../../hooks/useMeasureResult";
import cn from "classnames";
import { useRouteParams } from "../../hooks/useRouteParams";
import { Route } from "react-router-dom";
import { RESULTS_PATH } from "../../constants/routes";
const Layout: React.FC = ({ children }) => {
  const {
    urlParams: { experimentId },
    searchParams: { backgroundOp },
  } = useRouteParams();
  const {
    perfTempState: [measure],
    perfBufferState,
  } = useContext(MeasureResultContext);
  return (
    <Container fluid className={classNames.root}>
      <Row style={{ height: "100%" }}>
        <Col xs={2} style={{ backgroundColor: "#f7f7f7", paddingTop: 15 }}>
          <Config />
        </Col>
        <Col>
          <Row style={{ height: "100%" }}>
            <Col
              md={6}
              className={classNames.alignVertical}
              style={{ paddingTop: 15 }}
            >
              <Container>
                <Row style={{ marginBottom: "auto" }}>
                  {experimentId === "list" && (
                    <Alert variant="primary">
                      During the experiment, the value of each element of the
                      list will in turn increase by 5 every 100 milliseconds
                    </Alert>
                  )}
                  {experimentId === "matrix" && (
                    <Alert variant="primary">
                      During the experiment, a random element of the matrix will
                      change its color every 100 milliseconds
                    </Alert>
                  )}
                  {!!backgroundOp && (
                    <Alert variant="warning">
                      Additional experiment mixin: every 500 milliseconds, a
                      background operation will be performed to work with a
                      large collection of numbers. The collection is not used
                      when rendering
                    </Alert>
                  )}
                </Row>
                <Row>{children}</Row>
              </Container>
            </Col>
            <Col
              md={6}
              className={cn(classNames.alignVertical)}
              style={{ backgroundColor: "#f7f7f7", paddingTop: 15 }}
            >
              {!!experimentId && (
                <Container>
                  <Row>
                    <Alert variant="primary">
                      After end of the experiment (via click STOP) there you can
                      see performance measure
                    </Alert>
                  </Row>
                  <Route path={RESULTS_PATH}>
                    {measure != null && measure.length !== 0 && (
                      <PerformanceChart
                        data={measure}
                        perfState={perfBufferState}
                      />
                    )}
                  </Route>
                </Container>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export default Layout;

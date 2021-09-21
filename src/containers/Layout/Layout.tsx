import React, { useContext } from "react";
import { Col, Container, Row } from "react-bootstrap";
import classNames from "./Layout.module.scss";
import Config from "../Config/Config";
import { PerformanceChart } from "../../components/PerformanceChart";
import { MeasureResultContext } from "../../hooks/useMeasureResult";
import cn from "classnames";
const Layout: React.FC = ({ children }) => {
  const [measure] = useContext(MeasureResultContext);
  return (
    <Container fluid className={classNames.root}>
      <Row>
        <Col xs={2}>
          <Config />
        </Col>
        <Col>
          <Row>
            <Col md={6} className={classNames.alignVertical}>
              {children}
            </Col>
            <Col
              md={6}
              className={cn(classNames.alignVertical, classNames.alignToTop)}
            >
              {measure != null && measure.length !== 0 && (
                <PerformanceChart data={measure} />
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};
export default Layout;

import React, { useMemo, useState } from "react";
import { FrameworkId } from "../../utils/generateExperimentPathWithFramework";
import { Col, Container, Form, Row } from "react-bootstrap";
import { FRAMEWORK_IDS } from "../../constants/collections";
import { sortBy } from "lodash";
type WeightType = "performance" | "size" | "documentation";
const ResultsConslusion: React.FC = () => {
  const initialResults = useMemo<
    Record<WeightType, Record<FrameworkId, number>>
  >(
    () => ({
      performance: {
        redux: 1.5,
        react_state: 2.5,
        reatom: 5,
        effector: 5,
        mobx: 5,
        nanostores: 5,
      },
      size: {
        redux: 4,
        react_state: 5,
        reatom: 4,
        effector: 3,
        mobx: 2,
        nanostores: 5,
      },
      documentation: {
        redux: 4,
        react_state: 2,
        reatom: 1,
        effector: 5,
        mobx: 4,
        nanostores: 1,
      },
    }),
    []
  );
  const [weights, setWeight] = useState<Record<WeightType, number>>({
    performance: 1,
    size: 1,
    documentation: 1,
  });
  const maxToAdd = useMemo(
    () => Object.values(weights).reduce((accum, value) => accum - value, 3),
    [weights]
  );
  const appropriateDecision = useMemo(() => {
    const computedResults = Object.keys(weights).reduce((accum, key) => {
      return {
        ...accum,
        [key]: Object.keys(initialResults[key as WeightType]).reduce(
          (frameworksObj, frameworkId) => ({
            ...frameworksObj,
            [frameworkId]:
              initialResults[key as WeightType][frameworkId as FrameworkId] *
              weights[key as WeightType],
          }),
          {}
        ),
      };
    }, {}) as typeof initialResults;
    const frameworksValue = FRAMEWORK_IDS.reduce(
      (accum, frameworkId) => ({
        ...accum,
        [frameworkId]:
          computedResults.performance[frameworkId] +
          computedResults.documentation[frameworkId] +
          computedResults.size[frameworkId],
      }),
      {}
    ) as Record<FrameworkId, number>;
    // return Object.keys(frameworksValue).reduce(
    //   (prev, frameworkId) =>
    //     frameworksValue[frameworkId as FrameworkId] >
    //     frameworksValue[prev as FrameworkId]
    //       ? (frameworkId as FrameworkId)
    //       : (prev as FrameworkId),
    //   "redux" as FrameworkId
    // );
    return sortBy(FRAMEWORK_IDS, (frameworkId) => frameworksValue[frameworkId])
      .reverse()
      .slice(0, 3);
  }, [initialResults, weights]);
  return (
    <Container>
      <Row>
        <h1> The application should...</h1>
      </Row>
      <Row>
        <Form.Label htmlFor="performance">Work with many data</Form.Label>
        <Form.Range
          step="0.01"
          name="performance"
          id="performance"
          value={weights.performance}
          min={0.25}
          max={2.5}
          onChange={(e) => {
            if (maxToAdd > 0 || +e.target.value < weights.performance)
              setWeight(({ performance, ...weights }) => ({
                ...weights,
                performance: +e.target.value,
              }));
          }}
        />
      </Row>
      <Row>
        <Form.Label htmlFor="performance">
          Work with low-weight application
        </Form.Label>
        <Form.Range
          step="0.01"
          name="size"
          id="size"
          value={weights.size}
          min={0.25}
          max={2.5}
          onChange={(e) => {
            if (maxToAdd > 0 || +e.target.value < weights.size)
              setWeight(({ size, ...weights }) => ({
                ...weights,
                size: +e.target.value,
              }));
          }}
        />
      </Row>
      <Row>
        <Form.Label htmlFor="performance">
          Work with reliable infrastructure
        </Form.Label>
        <Form.Range
          name="documentation"
          id="documentation"
          step="0.01"
          value={weights.documentation}
          min={0.25}
          max={2.5}
          onChange={(e) => {
            if (maxToAdd > 0 || +e.target.value < weights.documentation)
              setWeight(({ documentation, ...weights }) => ({
                ...weights,
                documentation: +e.target.value,
              }));
          }}
        />
      </Row>
      <Row>
        <Col xs={12}>
          <h3>The most appropriate decisions</h3>
        </Col>
        <Col>
          <ul>
            {appropriateDecision.map((elem) => (
              <li key={elem}>{elem}</li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
};
export default ResultsConslusion;

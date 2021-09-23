import React, { ComponentProps, FC, useMemo } from "react";
import {
  VictoryChart,
  VictoryTooltip,
  VictoryScatter,
  VictoryTheme,
  VictoryAxis,
  Point,
} from "victory";
import { FrameworkId } from "../../utils/generateExperimentPathWithFramework";
import { nanoid } from "nanoid";
import { PerfType } from "../../hooks/useMeasureResult";
import { sortBy, uniqBy } from "lodash";
import { Button, Col, Container, Row } from "react-bootstrap";
const colorsMap: Record<FrameworkId, string> = {
  redux: "red",
  reatom: "blue",
  effector: "green",
  react_ref: "grey",
  react_state: "#FF7F50",
  mobx: "#8bc34a",
  nanostores: "#FF1493",
};
const CustomPoint: React.FC<ComponentProps<typeof Point>> = (props) => {
  return <Point {...props} style={{ fill: props.datum.fill }} />;
};
const PerformanceChart: FC<{
  data: PerformanceEntry[];
  perfState: [PerfType[], (value: PerfType[]) => void];
}> = ({ data, perfState: [perfBuffer, setPerfBuffer] }) => {
  const normalizedData = useMemo(
    () =>
      !data?.length
        ? []
        : data.map(({ name, duration, startTime, entryType }) => ({
            name,
            duration,
            entryType,
            startTime: startTime - data[0].startTime,
            fill: colorsMap[name.split(":")[0] as FrameworkId],
            uid: nanoid(),
          })),
    [data]
  );
  const mergedData = useMemo(() => {
    const sorted = sortBy(
      uniqBy([...perfBuffer, ...normalizedData], "uid"),
      "startTime"
    );
    return sorted;
  }, [normalizedData, perfBuffer]);
  const [maxStartTime, maxDuration] = useMemo(
    () => [
      mergedData.reduce(
        (accum, { startTime }) => (startTime > accum ? startTime : accum),
        0
      ),
      mergedData.reduce(
        (accum, { duration }) => (duration > accum ? duration : accum),
        0
      ),
    ],
    [mergedData]
  );
  return (
    <div style={{ width: 600, height: 600 }}>
      <Container>
        <Row>
          <Col>
            <Button onClick={() => setPerfBuffer(mergedData)}>
              collect data
            </Button>
          </Col>
          <Col>
            <Button onClick={() => setPerfBuffer([])}>clean data</Button>
          </Col>
        </Row>
      </Container>
      <VictoryChart
        theme={VictoryTheme.material}
        domain={{ x: [0, maxStartTime + 10], y: [-10, maxDuration + 10] }}
      >
        <VictoryScatter
          dataComponent={<CustomPoint />}
          labelComponent={<VictoryTooltip />}
          style={{
            parent: { border: "1px solid #ccc" },
          }}
          data={mergedData.map(({ startTime, duration, fill }) => ({
            x: startTime,
            y: duration,
            label: `duration: ${duration.toFixed(3)}ms`,
            fill,
          }))}
          // x="startTime"
          // y="duration"
        />
        <VictoryAxis
          label="start time (ms)"
          style={{
            axisLabel: { padding: 30 },
          }}
        />
        <VictoryAxis
          dependentAxis
          label="duration (ms)"
          style={{
            axisLabel: { padding: 40 },
          }}
        />
      </VictoryChart>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          fontSize: 20,
          marginBottom: 20,
        }}
      >
        Legend
      </div>
      <Container>
        {Object.entries(colorsMap).map(([key, value]) => (
          <Row className="justify-content-md-space-between">
            <Col>
              <div
                style={{
                  backgroundColor: value,
                  width: 15,
                  height: 15,
                  borderRadius: "50%",
                }}
              />
            </Col>
            <Col>{key}</Col>
          </Row>
        ))}
      </Container>
    </div>
  );
};
export default PerformanceChart;

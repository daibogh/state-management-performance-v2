import React, { useCallback, useContext, useMemo } from "react";
import { Button, Col, Container, Dropdown, Form, Row } from "react-bootstrap";
import { useRouteParams } from "../../hooks/useRouteParams";
import { generateUrlonPath } from "../../utils/generateUrlonPath";
import { useHistory } from "react-router-dom";
import { EXPERIMENT_PATH } from "../../constants/routes";
import { EXPERIMENT_IDS, FRAMEWORK_IDS } from "../../constants/collections";
import { SocketConnectionContext } from "../../hooks/useSocketConnection";
import { DEFAULT_SIZE } from "../../constants/params";

const Config: React.FC = () => {
  const { startSocket, stopSocket, isActive } = useContext(
    SocketConnectionContext
  );
  const params = useRouteParams();
  const { experimentId, frameworkId } = params.urlParams;
  const { size, backgroundOp } = params.searchParams;
  const history = useHistory();
  const experimentOptions = useMemo(() => {
    return EXPERIMENT_IDS.map((experimentId) => ({
      path: generateUrlonPath(EXPERIMENT_PATH, {
        routeParams: {
          ...params.urlParams,
          experimentId,
        },
        queryParams: params.searchParams,
      }),
      label: experimentId,
    }));
  }, [params]);
  const frameworkOptions = useMemo(() => {
    if (experimentId) {
      return FRAMEWORK_IDS.map((frameworkId) => ({
        path: generateUrlonPath(EXPERIMENT_PATH, {
          routeParams: {
            ...params.urlParams,
            frameworkId,
          },
          queryParams: params.searchParams,
        }),
        label: frameworkId,
      }));
    }
    return null;
  }, [experimentId, params]);
  const onRangeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      history.push(
        generateUrlonPath(EXPERIMENT_PATH, {
          routeParams: {
            ...params.urlParams,
            frameworkId,
          },
          queryParams: { ...params.searchParams, size: +e.target.value },
        })
      );
    },
    [frameworkId, history, params.searchParams, params.urlParams]
  );
  const onBackgroundOperationToggle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      history.push(
        generateUrlonPath(EXPERIMENT_PATH, {
          routeParams: {
            ...params.urlParams,
            frameworkId,
          },
          queryParams: {
            ...params.searchParams,
            backgroundOp: e.target.checked,
          },
        })
      );
    },
    [frameworkId, history, params.searchParams, params.urlParams]
  );
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label>Choose experiment type</Form.Label>
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            {experimentId || "Experiment"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {experimentOptions.map(({ path, label }) => (
              <Dropdown.Item key={label} onClick={() => history.push(path)}>
                {label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </Form.Group>
      {!!experimentId && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="collectionSize">
            Choose collection size (current: <b>{size || DEFAULT_SIZE}</b>)
          </Form.Label>
          <Form.Range
            id="collectionSize"
            min={20}
            max={400}
            onChange={onRangeChange}
            value={size || DEFAULT_SIZE}
          />
        </Form.Group>
      )}
      {experimentId === "list" && (
        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            id="backgroundOp"
            label="use background operation"
            checked={backgroundOp}
            onChange={onBackgroundOperationToggle}
          />
        </Form.Group>
      )}
      {frameworkOptions && (
        <Form.Group className="mb-3">
          <Form.Label>Choose framework to test</Form.Label>
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              {frameworkId || "Framework"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {frameworkOptions.map(({ path, label }) => (
                <Dropdown.Item key={label} onClick={() => history.push(path)}>
                  {label}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>
      )}
      {experimentId && frameworkId && (
        <>
          {!isActive ? (
            <Button
              size="lg"
              variant="primary"
              type="button"
              onClick={startSocket}
            >
              START
            </Button>
          ) : (
            <Button
              size="lg"
              variant="danger"
              type="button"
              onClick={stopSocket}
            >
              STOP
            </Button>
          )}
        </>
      )}
    </Form>
  );
};
export default Config;

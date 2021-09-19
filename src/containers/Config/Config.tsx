import React, { useContext, useMemo } from "react";
import { Button, Dropdown, Form } from "react-bootstrap";
import { useRouteParams } from "../../hooks/useRouteParams";
import { generateUrlonPath } from "../../utils/generateUrlonPath";
import { useHistory } from "react-router-dom";
import { EXPERIMENT_PATH } from "../../constants/routes";
import { EXPERIMENT_IDS, FRAMEWORK_IDS } from "../../constants/collections";
import { SocketConnectionContext } from "../../hooks/useSocketConnection";

const Config: React.FC = () => {
  const { startSocket, stopSocket } = useContext(SocketConnectionContext);
  const params = useRouteParams();
  const { experimentId, frameworkId } = params.urlParams;
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

      <Button variant="primary" type="button" onClick={startSocket}>
        TEST
      </Button>
      <Button variant="primary" type="button" onClick={stopSocket}>
        STOP
      </Button>
    </Form>
  );
};
export default Config;

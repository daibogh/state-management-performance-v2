export const EXPERIMENT_PATH =
  "/experiment/:experimentId?/framework/:frameworkId?";
export const EXPERIMENT_PATH_STRICT =
  "/experiment/:experimentId/framework/:frameworkId";
export const RESULTS_PATH = `${EXPERIMENT_PATH_STRICT}/results`;

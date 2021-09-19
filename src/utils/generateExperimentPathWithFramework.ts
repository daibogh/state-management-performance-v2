import { EXPERIMENT_PATH_STRICT } from "../constants/routes";

export function generateExperimentPathWithFramework(frameworkId: string) {
  return EXPERIMENT_PATH_STRICT.replace(":frameworkId", frameworkId);
}

import { EXPERIMENT_PATH_STRICT } from "../constants/routes";
import { FRAMEWORK_IDS } from "../constants/collections";
export type FrameworkId = typeof FRAMEWORK_IDS[number];
export function generateExperimentPathWithFramework(frameworkId: FrameworkId) {
  return EXPERIMENT_PATH_STRICT.replace(":frameworkId", frameworkId);
}

import { EXPERIMENT_PATH_STRICT } from "../constants/routes";
import { FRAMEWORK_IDS } from "../constants/collections";

export function generateExperimentPathWithFramework(
  frameworkId: typeof FRAMEWORK_IDS[number]
) {
  return EXPERIMENT_PATH_STRICT.replace(":frameworkId", frameworkId);
}

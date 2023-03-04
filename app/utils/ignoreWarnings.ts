/**
 * Ignore some yellowbox warnings. Some of these are for deprecated functions
 * that we haven't gotten around to replacing yet.
 */
import { LogBox } from "react-native"

// prettier-ignore
LogBox.ignoreLogs([
  "Require cycle:",
  // Need to pass functions to some screens
  'Non-serializable values were found in the navigation state',
  "Dynamically changing 'headerShown' in modals will result in remounting the screen and losing all local state",
])

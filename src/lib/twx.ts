import { createTwc } from "react-twc";
import { cn } from "./utils";

// Create TWC instance with cn utility for proper class merging
export const twx = createTwc({ compose: cn });

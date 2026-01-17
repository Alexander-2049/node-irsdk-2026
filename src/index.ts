import { performance } from "node:perf_hooks";
import { iRacing } from "./app/games/iRacing/iRacing";

export {
  iRacing,
  IracingHeader,
  IracingSnapshot,
  IracingValue,
  IracingVarBuffer,
  IracingVarHeader,
  IracingVarType,
} from "./app/games/iRacing/iRacing";

if (require.main === module) {
  const sdk = new iRacing();
  setInterval(() => {
    const start = performance.now();
    const snapshot = sdk.readIRacingSharedMemory();
    const end = performance.now();
    console.log(`readIRacingSharedMemory: ${(end - start).toFixed(2)} ms`);
    console.log(snapshot.sessionInfo.parsed?.DriverInfo);
  }, 1000);
}

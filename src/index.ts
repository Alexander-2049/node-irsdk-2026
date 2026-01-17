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
  const snapshot = sdk.readIRacingSharedMemory();
  console.log(snapshot);
}

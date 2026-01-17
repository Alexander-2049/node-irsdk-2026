import fs from "node:fs";
import path from "node:path";
import { iRacing } from "./app/games/iRacing/iRacing";

export {
  iRacing,
  IracingHeader,
  IracingSharedMemoryData,
  IracingValue,
  IracingVarBuffer,
  IracingVarHeader,
  IracingVarType,
} from "./app/games/iRacing/iRacing";

export type {
  IracingSessionInfo,
  IracingTelemetry,
  IracingTrackMapRequest,
  IracingTrackMapSvg,
} from "./app/games/iRacing/iRacingInterfaces";

if (require.main === module) {
  const sdk = new iRacing();
  const distDir = path.resolve(process.cwd(), "dist");

  const writeData = () => {
    const data = sdk.readIRacingSharedMemory();
    const payload = {
      header: data.header,
      sessionInfo: data.sessionInfo,
      telemetry: data.telemetry,
    };
    const filename = `data-${Date.now()}.json`;
    fs.mkdirSync(distDir, { recursive: true });
    fs.writeFileSync(
      path.join(distDir, filename),
      JSON.stringify(payload, null, 2),
      "utf8"
    );
  };

  writeData();
  setInterval(writeData, 10000);
}

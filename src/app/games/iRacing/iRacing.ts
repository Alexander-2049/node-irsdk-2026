const sdk = require("../../../../build/Release/irsdk_node.node");

export class iRacing {
  public readIRacingSharedMemory(): any {
    return sdk.readIRacingSharedMemory();
  }
}

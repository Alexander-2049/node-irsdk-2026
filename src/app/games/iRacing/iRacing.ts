const sdk = require("../../../../build/Release/irsdk_node.node");

const VAR_HEADER_SIZE = 144;
const MAX_STRING = 32;
const MAX_DESC = 64;

export enum IracingVarType {
  Char = 0,
  Bool = 1,
  Int = 2,
  BitField = 3,
  Float = 4,
  Double = 5,
}

const VAR_TYPE_BYTES: Record<IracingVarType, number> = {
  [IracingVarType.Char]: 1,
  [IracingVarType.Bool]: 1,
  [IracingVarType.Int]: 4,
  [IracingVarType.BitField]: 4,
  [IracingVarType.Float]: 4,
  [IracingVarType.Double]: 8,
};

export interface IracingVarHeader {
  name: string;
  desc: string;
  unit: string;
  type: IracingVarType;
  offset: number;
  count: number;
  countAsTime: boolean;
}

export interface IracingVarBuffer {
  tickCount: number;
  bufOffset: number;
}

export interface IracingHeader {
  ver: number;
  status: number;
  tickRate: number;
  sessionInfoUpdate: number;
  sessionInfoLen: number;
  sessionInfoOffset: number;
  numVars: number;
  varHeaderOffset: number;
  numBuf: number;
  bufLen: number;
  varBuf: IracingVarBuffer[];
}

export type IracingValue = number | boolean | string | number[] | boolean[];

export type IracingTelemetry = Record<string, IracingValue>;

export type IracingSessionInfo = Record<string, unknown> | null;

export interface IracingSharedMemoryData {
  header: IracingHeader;
  sessionInfo: IracingSessionInfo;
  telemetry: IracingTelemetry;
}

function readCString(buf: Buffer, offset: number, length: number): string {
  const slice = buf.slice(offset, offset + length);
  const zero = slice.indexOf(0);
  return slice.slice(0, zero >= 0 ? zero : length).toString("utf8");
}

function readHeader(buf: Buffer): IracingHeader {
  let offset = 0;

  const ver = buf.readInt32LE(offset);
  offset += 4;
  const status = buf.readInt32LE(offset);
  offset += 4;
  const tickRate = buf.readInt32LE(offset);
  offset += 4;
  const sessionInfoUpdate = buf.readInt32LE(offset);
  offset += 4;
  const sessionInfoLen = buf.readInt32LE(offset);
  offset += 4;
  const sessionInfoOffset = buf.readInt32LE(offset);
  offset += 4;
  const numVars = buf.readInt32LE(offset);
  offset += 4;
  const varHeaderOffset = buf.readInt32LE(offset);
  offset += 4;
  const numBuf = buf.readInt32LE(offset);
  offset += 4;
  const bufLen = buf.readInt32LE(offset);
  offset += 4;

  offset += 8;

  const varBuf: IracingVarBuffer[] = [];
  for (let i = 0; i < numBuf; i += 1) {
    const tickCount = buf.readInt32LE(offset);
    offset += 4;
    const bufOffset = buf.readInt32LE(offset);
    offset += 4;
    offset += 8;
    varBuf.push({ tickCount, bufOffset });
  }

  return {
    ver,
    status,
    tickRate,
    sessionInfoUpdate,
    sessionInfoLen,
    sessionInfoOffset,
    numVars,
    varHeaderOffset,
    numBuf,
    bufLen,
    varBuf,
  };
}

function readVarHeader(buf: Buffer, offset: number): IracingVarHeader {
  let o = offset;

  const type = buf.readInt32LE(o);
  o += 4;
  const dataOffset = buf.readInt32LE(o);
  o += 4;
  const count = buf.readInt32LE(o);
  o += 4;
  const countAsTime = buf.readUInt8(o) !== 0;
  o += 4;

  const name = readCString(buf, o, MAX_STRING);
  o += MAX_STRING;
  const desc = readCString(buf, o, MAX_DESC);
  o += MAX_DESC;
  const unit = readCString(buf, o, MAX_STRING);
  o += MAX_STRING;

  return {
    name,
    desc,
    unit,
    type: type as IracingVarType,
    offset: dataOffset,
    count,
    countAsTime,
  };
}

function readAllVarHeaders(buf: Buffer, header: IracingHeader): IracingVarHeader[] {
  const vars: IracingVarHeader[] = [];
  let offset = header.varHeaderOffset;

  for (let i = 0; i < header.numVars; i += 1) {
    vars.push(readVarHeader(buf, offset));
    offset += VAR_HEADER_SIZE;
  }

  return vars;
}

function coerceYamlScalar(value: string): string | number | boolean | null {
  if (value === "") {
    return "";
  }
  if (value === "null") {
    return null;
  }
  if (value === "true") {
    return true;
  }
  if (value === "false") {
    return false;
  }
  if (!Number.isNaN(Number(value)) && value.trim() !== "") {
    return Number(value);
  }
  const trimmed = value.replace(/^['"]|['"]$/g, "");
  return trimmed;
}

type SessionNodeKind = "object" | "array";
type SessionNode = { indent: number; kind: SessionNodeKind; value: any };

function parseSessionInfoYaml(raw: string): Record<string, unknown> | null {
  const root: Record<string, unknown> = {};
  const stack: SessionNode[] = [{ indent: -1, kind: "object", value: root }];

  const lines = raw.split(/\r?\n/);

  const findParentIndex = (
    kind: SessionNodeKind,
    indent: number,
    allowEqual: boolean
  ): number => {
    for (let i = stack.length - 1; i >= 0; i -= 1) {
      if (stack[i].kind === kind) {
        if (allowEqual ? stack[i].indent <= indent : stack[i].indent < indent) {
          return i;
        }
      }
    }
    return -1;
  };

  const peekNextMeaningfulLine = (startIndex: number): string | null => {
    for (let i = startIndex; i < lines.length; i += 1) {
      const candidate = lines[i];
      if (!candidate.trim() || candidate.trim() === "---") {
        continue;
      }
      return candidate.trim();
    }
    return null;
  };

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex];
    if (!line.trim() || line.trim() === "---") {
      continue;
    }

    const indent = line.match(/^ */)?.[0].length ?? 0;
    const trimmed = line.trim();

    if (trimmed.startsWith("- ")) {
      const content = trimmed.slice(2);
      const parentIndex = findParentIndex("array", indent, true);
      if (parentIndex < 0) {
        continue;
      }
      stack.length = parentIndex + 1;
      const parent = stack[parentIndex].value;
      if (content.includes(":")) {
        const [key, rest] = content.split(/:(.*)/);
        const obj: Record<string, unknown> = {};
        obj[key.trim()] = coerceYamlScalar(rest.trim());
        parent.push(obj);
        stack.push({ indent, kind: "object", value: obj });
      } else {
        parent.push(coerceYamlScalar(content.trim()));
      }
      continue;
    }

    const [rawKey, rawValue] = trimmed.split(/:(.*)/);
    const key = rawKey.trim();
    const value = rawValue === undefined ? "" : rawValue.trim();

    const parentIndex = findParentIndex("object", indent, false);
    if (parentIndex < 0) {
      continue;
    }
    stack.length = parentIndex + 1;
    const parent = stack[parentIndex].value;

    if (value === "") {
      const nextLine = peekNextMeaningfulLine(lineIndex + 1);
      const nextIsList = nextLine?.startsWith("- ") ?? false;
      const container: any = nextIsList ? [] : {};
      if (parent && typeof parent === "object") {
        parent[key] = container;
      }
      stack.push({
        indent,
        kind: nextIsList ? "array" : "object",
        value: container,
      });
      continue;
    }

    if (parent && typeof parent === "object") {
      parent[key] = coerceYamlScalar(value);
    }
  }

  return root;
}

function readSessionInfo(buf: Buffer, header: IracingHeader): IracingSessionInfo {
  if (header.sessionInfoLen <= 0) {
    return null;
  }

  const slice = buf.slice(
    header.sessionInfoOffset,
    header.sessionInfoOffset + header.sessionInfoLen
  );
  const zero = slice.indexOf(0);
  const raw = slice
    .slice(0, zero >= 0 ? zero : header.sessionInfoLen)
    .toString("utf8");

  return parseSessionInfoYaml(raw);
}

function readLatestVarBuffer(buf: Buffer, header: IracingHeader): Buffer {
  if (header.varBuf.length === 0 || header.bufLen <= 0) {
    return Buffer.alloc(0);
  }

  let latest = header.varBuf[0];
  for (const candidate of header.varBuf) {
    if (candidate.tickCount > latest.tickCount) {
      latest = candidate;
    }
  }

  const start = latest.bufOffset;
  const end = latest.bufOffset + header.bufLen;
  if (start < 0 || end > buf.length) {
    return Buffer.alloc(0);
  }
  return buf.slice(start, end);
}

function canReadVarValue(data: Buffer, header: IracingVarHeader): boolean {
  if (header.offset < 0) {
    return false;
  }
  const bytesPerValue = VAR_TYPE_BYTES[header.type] ?? 0;
  if (header.type === IracingVarType.Char && header.count > 1) {
    return header.offset + header.count <= data.length;
  }
  return header.offset + bytesPerValue * header.count <= data.length;
}

function readVarValue(data: Buffer, header: IracingVarHeader): IracingValue | null {
  if (!canReadVarValue(data, header)) {
    return null;
  }
  const bytesPerValue = VAR_TYPE_BYTES[header.type];

  if (header.type === IracingVarType.Char && header.count > 1) {
    return readCString(data, header.offset, header.count);
  }

  const readSingle = (index: number): number | boolean | string => {
    const offset = header.offset + index * bytesPerValue;
    switch (header.type) {
      case IracingVarType.Char:
        return String.fromCharCode(data.readUInt8(offset));
      case IracingVarType.Bool:
        return data.readUInt8(offset) !== 0;
      case IracingVarType.Int:
      case IracingVarType.BitField:
        return data.readInt32LE(offset);
      case IracingVarType.Float:
        return data.readFloatLE(offset);
      case IracingVarType.Double:
        return data.readDoubleLE(offset);
      default:
        return data.readInt32LE(offset);
    }
  };

  if (header.count === 1) {
    return readSingle(0);
  }

  const values: Array<number | boolean | string> = [];
  for (let i = 0; i < header.count; i += 1) {
    values.push(readSingle(i));
  }

  return values as number[] | boolean[];
}

function buildTelemetry(
  data: Buffer,
  varHeaders: IracingVarHeader[]
): IracingTelemetry {
  const telemetry: IracingTelemetry = {};
  for (const entry of varHeaders) {
    if (!entry.name) {
      continue;
    }
    const value = readVarValue(data, entry);
    if (value !== null) {
      telemetry[entry.name] = value;
    }
  }
  return telemetry;
}

export class iRacing {
  private lastSessionInfoReadAt = 0;
  private cachedSessionInfo: IracingSessionInfo = null;

  public readIRacingSharedMemory(): IracingSharedMemoryData {
    const buffer: Buffer = sdk.readIRacingSharedMemory();

    const header = readHeader(buffer);
    const varHeaders = readAllVarHeaders(buffer, header);
    const data = readLatestVarBuffer(buffer, header);
    const now = Date.now();
    let sessionInfo = this.cachedSessionInfo;
    if (!sessionInfo || now - this.lastSessionInfoReadAt >= 5000) {
      sessionInfo = readSessionInfo(buffer, header);
      this.cachedSessionInfo = sessionInfo;
      this.lastSessionInfoReadAt = now;
    }
    const telemetry = buildTelemetry(data, varHeaders);

    return {
      header,
      sessionInfo,
      telemetry,
    };
  }
}

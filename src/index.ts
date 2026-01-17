const addon = require("../build/Release/irsdk_node.node");

const VAR_HEADER_SIZE = 144;

// ===== helpers =====

function readCString(buf: Buffer, offset: number, length: number): string {
  const slice = buf.slice(offset, offset + length);
  const zero = slice.indexOf(0);
  return slice.slice(0, zero >= 0 ? zero : length).toString("utf8");
}

// ===== irsdk_header =====

function readHeader(buf: Buffer) {
  let offset = 0;
  function x(n: number) {
    offset += n;
    return offset;
  }

  const header = {
    ver: buf.readInt32LE(offset),
    status: buf.readInt32LE(x(4)),
    tickRate: buf.readInt32LE(x(4)),

    sessionInfoUpdate: buf.readInt32LE(x(4)),
    sessionInfoLen: buf.readInt32LE(x(4)),
    sessionInfoOffset: buf.readInt32LE(x(4)),

    numVars: buf.readInt32LE(x(4)),
    varHeaderOffset: buf.readInt32LE(x(4)),

    numBuf: buf.readInt32LE(x(4)),
    bufLen: buf.readInt32LE(x(4)),
  };

  return header;
}

// ===== irsdk_varHeader =====

function readVarHeader(buf: Buffer, offset: number) {
  let o = offset;

  const type = buf.readInt32LE(o);
  o += 4;
  const dataOffset = buf.readInt32LE(o);
  o += 4;
  const count = buf.readInt32LE(o);
  o += 4;

  const name = readCString(buf, o, 32);
  o += 32;
  const desc = readCString(buf, o, 64);
  o += 64;
  const unit = readCString(buf, o, 32);
  o += 32;

  return {
    name,
    desc,
    unit,
    type,
    offset: dataOffset,
    count,
  };
}

function readAllVarHeaders(buf: Buffer, header: any) {
  const vars: any[] = [];
  let offset = header.varHeaderOffset;

  for (let i = 0; i < header.numVars; i++) {
    vars.push(readVarHeader(buf, offset));
    offset += VAR_HEADER_SIZE;
  }

  return vars;
}

// ===== usage =====

const buf: Buffer = addon.readIRacingSharedMemory();

const header = readHeader(buf);
console.log("HEADER:", header);
console.log(header.status === 0 ? "iRacing is closed" : "iRacing is open");

const vars = readAllVarHeaders(buf, header);

// пример — найдём Speed
const speedVar = vars.find((v) => v.name === "Speed");
console.log("Speed var:", speedVar);

// показать первые 10 переменных
console.log("First 10 vars:");
vars.slice(0, 10).forEach((v) => console.log(`${v.name} (${v.unit})`));

console.log(vars);
setInterval(() => {}, 1000 / 30);

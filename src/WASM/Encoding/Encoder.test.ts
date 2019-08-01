import { TypedArrayBytestreamConsumer } from "./TypedArrayBytestreamConsumer";
import { Encoder } from "./Encoder";
test("should encode signed numbers using LEB128", () => {
  const cases: Array<[number, number[]]> = [
    [0, [0]],
    [1, [0x01]],
    [2, [0x02]],
    [127, [0xff, 0x00]],
    [128, [0x80, 0x01]],
    [129, [0x81, 0x01]],
    [-1, [0x7f]],
    [-2, [0x7e]],
    [-127, [0x81, 0x7f]],
    [-128, [0x80, 0x7f]],
    [-129, [0xff, 0x7e]]
  ];
  const encoder = new Encoder();
  for (let testCase of cases) {
    let [n, expected] = testCase;
    let consumer = new TypedArrayBytestreamConsumer();
    encoder.encodeNumberAsSignedLEB128(n, consumer);
    let result = consumer.cleanArray;
    let expectedArray = new Uint8Array(expected);
    expect(result).toEqual(expectedArray);
  }
});
test("should encode unsigned numbers using LEB128", () => {
  const cases: Array<[number, number[]]> = [
    [0, [0]],
    [1, [0x01]],
    [2, [0x02]],
    [127, [0x7f]],
    [128, [0x80, 0x01]],
    [129, [0x81, 0x01]],
    [130, [0x82, 0x01]],
    [12857, [0xb9, 0x64]],
    [16256, [0x80, 0x7f]],
    [0x40c, [0x8c, 0x08]],
    [624485, [0xe5, 0x8e, 0x26]]
  ];
  const encoder = new Encoder();
  for (let testCase of cases) {
    let [n, expected] = testCase;
    let consumer = new TypedArrayBytestreamConsumer();
    encoder.encodeNumberAsUnsignedLEB128(n, consumer);
    let result = consumer.cleanArray;
    let expectedArray = new Uint8Array(expected);
    expect(result).toEqual(expectedArray);
  }
});
test("should be able to encode 32-bit floats correctly", () => {
  const encoder = new Encoder();
  const encode = (n: number) => {
    const buffer = new TypedArrayBytestreamConsumer();
    encoder.encodeFloat32(n, buffer);
    return [...buffer.cleanArray];
  };
  expect(encode(12)).toEqual([0x00, 0x00, 0x40, 0x41]);
  expect(encode(820)).toEqual([0x00, 0x00, 0x4d, 0x44]);
});
test("should be able to encode 64-bit floats correctly", () => {
  const encoder = new Encoder();
  const encode = (n: number) => {
    const buffer = new TypedArrayBytestreamConsumer();
    encoder.encodeFloat64(n, buffer);
    return [...buffer.cleanArray];
  };
  expect(encode(200)).toEqual([0, 0, 0, 0, 0, 0, 105, 64]);
  expect(encode(202340)).toEqual([0, 0, 0, 0, 32, 179, 8, 65]);
  expect(encode(234.23412612)).toEqual([67, 145, 15, 246, 125, 71, 109, 64]);
});
test("should be able to encode 8-bit unsigned integers correctly", () => {
  const encoder = new Encoder();
  const encode = (n: number) => {
    const buffer = new TypedArrayBytestreamConsumer();
    encoder.encodeUInt8(n, buffer);
    return [...buffer.cleanArray];
  };
  expect(encode(3)).toEqual([3]);
  expect(encode(149)).toEqual([149]);
  expect(encode(42)).toEqual([42]);
  expect(encode(-12)).toEqual([244]);
});

test("should be able to encode 8-bit signed integers correctly", () => {
  const encoder = new Encoder();
  const encode = (n: number) => {
    const buffer = new TypedArrayBytestreamConsumer();
    encoder.encodeSInt8(n, buffer);
    return [...buffer.cleanArray];
  };
  expect(encode(3)).toEqual([3]);
  expect(encode(149)).toEqual([149]);
  expect(encode(42)).toEqual([42]);
  expect(encode(-12)).toEqual([244]);
});

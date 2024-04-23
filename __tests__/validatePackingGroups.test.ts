// @ts-nocheck

import { PackingGroup, getPackingGroup } from "../helpers/getPackingGroup";
import { expect, test, it } from 'vitest';
import { describe } from 'node:test';

describe("getPackingGroup", () => {
  it("returns null when input is null", () => {
    expect(getPackingGroup(null)).toBeNull();
  });

  it("returns null when input is not a string", () => {
    expect(getPackingGroup(123)).toBeNull();
  });

  it("returns null when input is not a valid packing group", () => {
    expect(getPackingGroup("4")).toBeNull();
  });

  it("returns 'I-Great Danger' when input is '1'", () => {
    expect(getPackingGroup("1")).toBe("I-Great Danger");
  });

  it("returns 'II-Medium Danger' when input is '2'", () => {
    expect(getPackingGroup("2")).toBe("II-Medium Danger");
  });

  it("returns 'III-Minor Danger' when input is '3'", () => {
    expect(getPackingGroup("3")).toBe("III-Minor Danger");
  });
});
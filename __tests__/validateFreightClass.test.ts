import { describe } from "node:test";
import { expect, it, test } from "vitest";
import { validateFreightClass } from "../helpers/validateFreight";

describe("validateFreightClass", () => {
  it("reutrns the valid freight class", () => {
    expect(validateFreightClass(50)).toBe(50);
    expect(validateFreightClass(125)).toBe(125);
    expect(validateFreightClass(500)).toBe(500);
  });
  it("throws an error for invalid freight classes", () => {
    expect(() => validateFreightClass(45)).toThrowError(
      "Invalid freight class",
    );
    expect(() => validateFreightClass(1000)).toThrowError(
      "Invalid freight class",
    );
    expect(() => validateFreightClass(undefined)).toThrowError(
      "Invalid freight class",
    );
  });
});

test("returns a valid freight class");

import { expect, test } from "vitest";
function sum(a: number, b: number) {
  return a + b;
}

test("Testing controller", () => {
  expect(sum(1, 2)).toBe(3);
});

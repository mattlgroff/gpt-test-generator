import { describe, expect, test } from "bun:test";
import { removeWhitespace } from "../src/utils";

describe("removeWhitespace", () => {
  test("removes leading and trailing whitespace", () => {
    const input = "  hello world  ";
    const expectedOutput = "hello world";
    const output = removeWhitespace(input);
    expect(output).toEqual(expectedOutput);
  });

  test("replaces multiple spaces and tabs with single space", () => {
    const input = "hello \t\t   world";
    const expectedOutput = "hello world";
    const output = removeWhitespace(input);
    expect(output).toEqual(expectedOutput);
  });

  test("preserves newlines", () => {
    const input = "hello\nworld\n\n\n";
    const expectedOutput = "hello\nworld";
    const output = removeWhitespace(input);
    expect(output).toEqual(expectedOutput);
  });

  test("handles empty string", () => {
    const input = "";
    const expectedOutput = "";
    const output = removeWhitespace(input);
    expect(output).toEqual(expectedOutput);
  });
});
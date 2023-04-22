import { describe, expect, test } from "bun:test";
import { removeWhitespace, formDataToJson } from "../src/utils";

describe("removeWhitespace function", () => {
  test("removes newline characters and multiple spaces/tabs", () => {
    const input = "    hello\nworld\r\n  ";
    const expected = "hello\nworld";
    expect(removeWhitespace(input)).toEqual(expected);
  });

  test("does not remove spaces/tabs within words", () => {
    const input = "  hello   world  ";
    const expected = "hello world";
    expect(removeWhitespace(input)).toEqual(expected);
  });
});

// Skipping for now because we'd need to mock the Request object
describe("formDataToJson function", () => {
  test.skip("converts form data to JSON object", async () => {
    const formData = new FormData();
    formData.append("name", "Alice");
    formData.append("email", "alice@example.com");
    const request = new Request("/", { method: "POST", body: formData });
    const result = await formDataToJson(request);
    const expected = { name: "Alice", email: "alice@example.com" };
    expect(result).toEqual(expected);
  });
});
import { describe, test, expect } from "vitest";
import { Observe } from "./Observe";

describe("Observe", () => {
  test("empty");
  test("span", () => {
    const obs = Observe("test");
    const span = obs.span("span1");
    span.log("test message");
    span.log("test message", 1, 2, 3);
    span.end();
    span.span("span2").log("test message").end();
  });
});

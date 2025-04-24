import { describe, test, expect } from "vitest";
import { Observe } from "../observe/Observe";
import { ObserveAgent } from "./ObserveAgent";

describe("ObserveAgent", () => {
  test("logging", () => {
    type LogItem = {
      message: string;
      extra: unknown[];
    };
    const logMessages: LogItem[] = [];
    const testLogger = (message: string, ...extra: unknown[]) => {
      logMessages.push({ message, extra });
      // console.log(message, ...extra);
    };
    let clockStep = 0;
    const agent = ObserveAgent({
      logMatchers: ["root.span2"],
      logger: testLogger,
      clock: {
        now: () => clockStep++,
      },
    });
    {
      const obs = Observe("root", agent);
      const span = obs.span("span1");
      span.log("test message");
      span.log("test message", 1, 2, 3);
      span.end();
      obs
        .span("span2")
        .log("test message")
        .log("test message2", "a", "b", 42)
        .end();
      expect(logMessages.length).toEqual(4);
      expect(logMessages[0].message).toEqual("5 root.span2: start");
      expect(logMessages[1].message).toEqual("6 root.span2: test message");
      expect(logMessages[2].message).toEqual("7 root.span2: test message2");
      expect(logMessages[2].extra).toEqual(["a", "b", 42]);
      expect(logMessages[3].message).toEqual("8 root.span2: end");
    }
  });
  test("string matchers", () => {
    type LogItem = {
      message: string;
      extra: unknown[];
    };
    const logMessages: LogItem[] = [];
    const testLogger = (message: string, ...extra: unknown[]) => {
      logMessages.push({ message, extra });
      // console.log(message, ...extra);
    };
    let clockStep = 0;
    const agent = ObserveAgent({
      logMatchers: ["root.*.span3"],
      logger: testLogger,
      clock: {
        now: () => clockStep++,
      },
    });
    {
      const obs = Observe("root", agent);
      const span = obs.span("span1");
      span.log("test message");
      span.log("test message", 1, 2, 3);
      span.end();
      obs
        .span("span2")
        .log("test message")
        .log("test message2", "a", "b", 42)
        .span("span3")
        .log("test message3")
        .end();

      expect(logMessages.length).toEqual(3);
      expect(logMessages[0].message).toEqual("8 root.span2.span3: start");
      expect(logMessages[1].message).toEqual(
        "9 root.span2.span3: test message3"
      );
      expect(logMessages[2].message).toEqual("10 root.span2.span3: end");
    }
  });

  test("logMatcher object matchers", () => {
    type LogItem = {
      message: string;
      extra: unknown[];
    };
    const logMessages: LogItem[] = [];
    const testLogger = (message: string, ...extra: unknown[]) => {
      logMessages.push({ message, extra });
      // console.log(message, ...extra);
    };
    let clockStep = 0;
    const agent = ObserveAgent({
      logMatchers: [
        {
          traceId: "root.*.span",
          message: "test message",
          extra: (extra) => {
            return extra.length === 3;
          },
        },
      ],
      logger: testLogger,
      clock: {
        now: () => clockStep++,
      },
    });
    {
      const obs = Observe("root", agent);
      const span = obs.span("span1");
      span.log("test message");
      span.log("test message", 1, 2, 3);
      span.end();
      obs
        .span("span2")
        .log("test message")
        .log("test message2", "a", "b", 42)
        .span("span3")
        .log("test message3")
        .end();

      expect(logMessages.length).toEqual(2);
      expect(logMessages[0].message).toEqual("3 root.span1: test message");
      expect(logMessages[0].extra).toEqual([1, 2, 3]);
      expect(logMessages[1].message).toEqual("7 root.span2: test message2");
      expect(logMessages[1].extra).toEqual(["a", "b", 42]);
    }
  });

  test("logMatcher transform", () => {
    type LogItem = {
      message: string;
      extra: unknown[];
    };
    const logMessages: LogItem[] = [];
    const testLogger = (message: string, ...extra: unknown[]) => {
      logMessages.push({ message, extra });
      // console.log(message, ...extra);
    };
    let clockStep = 0;
    const agent = ObserveAgent({
      logMatchers: [
        {
          traceId: "root.*.span",
          message: "test message",
          extra: (extra) => {
            return extra.length === 3;
          },
          transform: (logEntry) => {
            return { ...logEntry, message: `transformed ${logEntry.message}` };
          },
        },
      ],
      logger: testLogger,
      clock: {
        now: () => clockStep++,
      },
    });
    {
      const obs = Observe("root", agent);
      const span = obs.span("span1");
      span.log("test message");
      span.log("test message", 1, 2, 3);
      span.end();
      obs
        .span("span2")
        .log("test message")
        .log("test message2", "a", "b", 42)
        .span("span3")
        .log("test message3")
        .end();

      expect(logMessages.length).toEqual(2);
      expect(logMessages[0].message).toEqual(
        "3 root.span1: transformed test message"
      );
      expect(logMessages[0].extra).toEqual([1, 2, 3]);
      expect(logMessages[1].message).toEqual(
        "7 root.span2: transformed test message2"
      );
      expect(logMessages[1].extra).toEqual(["a", "b", 42]);
    }
  });
  test("count stats", () => {
    type LogItem = {
      message: string;
      extra: unknown[];
    };
    const logMessages: LogItem[] = [];
    const testLogger = (message: string, ...extra: unknown[]) => {
      logMessages.push({ message, extra });
      console.log(message, ...extra);
    };
    let clockStep = 0;
    const agent = ObserveAgent({
      logMatchers: [
        // {
        //   // traceId: "root.*.span",
        //   // message: "test message",
        //   // extra: (extra) => {
        //   //   return extra.length === 3;
        //   // },
        //   // transform: (logEntry) => {
        //   //   return { ...logEntry, message: `transformed ${logEntry.message}` };
        //   // },
        // },
      ],
      logger: testLogger,
      clock: {
        now: () => clockStep++,
      },
    });
    {
      const obs = Observe("root", agent);
      obs.span("span1").log("test message");
      obs.span("span1").log("test message2");
      obs.span("span1").log("test message3");

      obs.span("span2").counter("counter1");
      obs.span("span2").counter("counter1");
      obs.span("span2").counter("counter1");
      obs.span("span2").counter("counter2");
      obs.span("span2").counter("counter2");

      const timer1 = obs.timer("test1");
      timer1.end();
      const timer2 = obs.timer("test1");
      timer2.end();

      expect(agent.getStats("root").getTimes().length).toEqual(1);
      expect(agent.getStats("root").getTimes()[0].getDuration()).greaterThan(0);
      expect(agent.getStats("root").getCount()).toEqual(1);
      expect(agent.getStats("root.span1").getCount()).toEqual(3);
      expect(agent.getStats("root.span2").getCounter("counter1")).toEqual(3);
      expect(agent.getStats("root.span2").getCounter("counter2")).toEqual(2);
      expect(agent.getTraceIds()).toEqual(["root", "root.span1", "root.span2"]);
      expect(agent.getStats("root").getTimers("test1").length).toEqual(2);
      expect(
        agent.getStats("root").getTimers("test1")[0].getDuration()
      ).greaterThan(0);
    }
  });
});

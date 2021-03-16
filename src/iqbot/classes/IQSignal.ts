import moment from "moment";
import { IQSignalConfig } from "../types";

export default class IQSignal {
  readonly m: IQSignalConfig["m"];
  readonly pair: IQSignalConfig["pair"];
  private readonly _time: IQSignalConfig["time"];
  readonly action: IQSignalConfig["action"];

  constructor(config: IQSignalConfig) {
    this.m = config.m;
    this.pair = config.pair;
    this._time = config.time;
    this.action = config.action;
  }

  get name() {
    return this.pair.join("/");
  }

  getTime = () => {
    const momentObj = this._time;
    const remaining = momentObj.diff(moment());

    return {
      moment: momentObj,
      s: momentObj.seconds(),
      m: momentObj.minutes(),
      h: momentObj.hours(),
      remaining,
      hasPassed: remaining <= 0,
    };
  };

  static parse = (text: string) => {
    const matches = [
      ...text.matchAll(/M(\d);(\w{3})(\w{3});(\d{2}:\d{2}:\d{2});(CALL|PUT)/gm),
    ];

    return matches
      .filter((match) => match.length >= 6)
      .map(
        (match) =>
          new IQSignal({
            m: parseInt(match[1]!),
            pair: [match[2]!, match[3]!],
            time: moment(match[4]!, "HH:mm:ss"),
            action: match[5] as "CALL" | "PUT",
          })
      )
      .filter((signal) => !signal.getTime().hasPassed);
  };
}

import { Moment } from "moment";

export type IQSignalConfig = {
  m: number;
  pair: [string, string];
  time: Moment;
  action: "CALL" | "PUT";
};

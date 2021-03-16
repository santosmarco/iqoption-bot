import chalk from "chalk";
import ora from "ora";

type StepName = "LAUNCH" | "INIT PAGE" | "SIGN IN" | "TRADE ROOM" | "SIGNAL";

class Ora {
  private readonly ora = ora();

  constructor(private readonly stepName: StepName) {}

  private formatText = (text: string, done = false) => {
    return `${chalk[done ? "green" : "blue"].bold(
      `[${this.stepName}]`
    )} ${text}`;
  };

  start = (text: string) => {
    if (this.ora.isSpinning) {
      return this.text(text);
    }
    this.ora.start(this.formatText(text));
    return this;
  };

  text = (text: string) => {
    this.ora.text = this.formatText(text);
    return this;
  };

  done = (text: string) => {
    this.ora.succeed(this.formatText(text, true));
  };
}

export const stepOras: {
  [step in StepName]: Ora;
} = {
  LAUNCH: new Ora("LAUNCH"),
  "INIT PAGE": new Ora("INIT PAGE"),
  "SIGN IN": new Ora("SIGN IN"),
  "TRADE ROOM": new Ora("TRADE ROOM"),
  SIGNAL: new Ora("SIGNAL"),
};

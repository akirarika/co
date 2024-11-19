export type Params = {
  command: string;
  commands: Array<string>;
  options: Record<string, string | true>;
  raw: Array<string>;
};

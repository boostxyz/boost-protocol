export type Options = {
  help?: boolean;
  version?: boolean;
  chain?: string;
  privateKey?: string;
  out?: string;
  cacheDir?: string;
  force?: string;
  format?: 'env' | 'json';
};

export type Command<T extends Record<string, unknown> = {}> = (
  options: Options,
) => Promise<T>;

export function objectToEnv<T extends object>(obj: T) {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    return `${acc}${key}=${JSON.stringify(value)}\n`;
  }, '');
}

export function envToObject(str: string): object {
  return str.split('\n').reduce(
    (acc, envPair) => {
      let [key, value] = envPair.split('=');
      if (!key || !value) return acc;
      try {
        value = JSON.parse(value);
        // biome-ignore lint/suspicious/noEmptyBlockStatements: we don't care if a value isn't valid, let it be
      } catch {}
      acc[key] = value;
      return acc;
    },
    {} as Record<string, unknown>,
  );
}

export function validateJson(str: string): Record<string, unknown> | false {
  try {
    return JSON.parse(str);
  } catch (_e) {
    return false;
  }
}

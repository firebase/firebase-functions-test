/** Mock values returned by `functions.config()`. */
export function mockSecretManager(conf: Record<string, string>) {
  for (const [key, value] of Object.entries(conf)) {
    process.env[key] = value;
  }
}

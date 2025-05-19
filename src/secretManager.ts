/** Mock values returned by `functions.config()`. */
export function mockSecretManager(conf: { [key: string]: any }) {
  for (const [key, value] of Object.entries(conf)) {
    process.env[key] = value;
  }
}

import dotenv from 'dotenv';
import path from 'path';

// Self-contained .env bootstrap — works whether loaded via playwright.config.ts or standalone.
// dotenv.config() is idempotent: it will not overwrite vars already set by the config or the shell.
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default class EnvProvider {
  /**
   * Retrieves an environment variable by name.
   * Throws an explicit error if the variable is missing to prevent silent failures.
   */
  private static _requireEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
      throw new Error(`CRITICAL: Environment variable "${name}" is missing! Please check your .env file.`);
    }
    return value;
  }

  /**
   * Standard login credentials.
   */
  static get testUser(): string {
    return this._requireEnv('TEST_USER');
  }

  static get testPassword(): string {
    return this._requireEnv('TEST_PASSWORD');
  }

  /**
   * Credentials for Basic Authentication popups.
   */
  static get basicAuthUser(): string {
    return this._requireEnv('BASIC_AUTH_USER');
  }

  static get basicAuthPassword(): string {
    return this._requireEnv('BASIC_AUTH_PASSWORD');
  }
}

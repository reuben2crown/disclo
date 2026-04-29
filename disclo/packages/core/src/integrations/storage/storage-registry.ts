import { cloudFlareR2Provider as r2Provider } from './providers/cloudflare-r2.server.js';
import type { IStorageProvider } from './storage-contract.js';

/**
 * Registry for external service providers.
 * Decouples business logic from specific vendor implementations by 
 * providing a single point of access for all integration contracts.
 */
class StorageRegistry {
  private storageProvider: IStorageProvider;

  constructor() {
    this.storageProvider = r2Provider;
  }

  getStorageProvider(): IStorageProvider {
    return this.storageProvider;
  }
    /**
   * Allows overriding providers for testing (Dependency Injection).
   */
  setStorageProvider(provider?: IStorageProvider) {
    this.storageProvider = provider ?? r2Provider;
  }
}

/**
 * Single access point for the active storage implementation.
 * Default provider is created lazily so tests can inject mocks before first use.
 */
export function createStorageRegistry(initial?: IStorageProvider) {
  let activeProvider = initial;

  return {
    getStorageProvider(): IStorageProvider {
      return activeProvider ?? r2Provider;
    },

    setStorageProvider(nextProvider: IStorageProvider) {
      activeProvider = nextProvider;
    },
  };
}

export const storageRegistry = createStorageRegistry();

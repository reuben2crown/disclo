import type { PlatformAdapter } from "@disclo/core";

export function createAdapter(): PlatformAdapter {
  return {
    async fetchContent() {
      return [];
    },
    async writeLabel() {
      return;
    },
    async registerWebhooks() {
      return;
    },
    async revokeAccess() {
      return;
    },
  };
}

import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import r2IncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/r2-incremental-cache";

// R2-backed ISR/data cache (ADR-003/ADR-012) - the NEXT_INC_CACHE_R2_BUCKET
// binding in wrangler.jsonc. Requires R2 enabled on the Cloudflare account
// and that bucket created before this is live (see docs/architecture/adrs.md ADR-012).
export default defineCloudflareConfig({
  incrementalCache: r2IncrementalCache,
});

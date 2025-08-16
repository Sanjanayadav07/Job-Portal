// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"

Sentry.init({
  dsn: "https://2c75ad4cc0bd6b4cad271d41bc0414ae@o4509852771876864.ingest.us.sentry.io/4509852781903872",

  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
});


const dotenv = require("dotenv");

let ENV_FILE_NAME = "";
switch (process.env.NODE_ENV) {
  case "production":
    ENV_FILE_NAME = ".env.production";
    break;
  case "staging":
    ENV_FILE_NAME = ".env.staging";
    break;
  case "test":
    ENV_FILE_NAME = ".env.test";
    break;
  case "development":
  default:
    ENV_FILE_NAME = ".env";
    break;
}

try {
  dotenv.config({ path: process.cwd() + "/" + ENV_FILE_NAME });
} catch (e) {}

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001";

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || "http://localhost:8000";

const DATABASE_URL =
  process.env.DATABASE_URL || "postgres://localhost/medusa-starter-default";

const REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: "@medusajs/admin",
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      // serve: true,
      autoRebuild: true,
      develop: {
        open: process.env.OPEN_BROWSER !== "false",
      },
    },
  },
  // {
  //   resolve: `medusa-storage-supabase`,
  //   options: {
  //     referenceID: process.env.STORAGE_BUCKET_REF,
  //     serviceKey: process.env.STORAGE_SERVICE_KEY,
  //     bucketName: process.env.BUCKET_NAME,
  //   },
  // },
  // {
  //   resolve: "medusa-file-r2",
  //   options: {
  //     account_id: process.env.CLOUDFLARE_R2_ACCOUNT_ID,
  //     access_key: process.env.CLOUDFLARE_R2_ACCESS_KEY,
  //     secret_key: process.env.CLOUDFLARE_R2_SECRET_KEY,
  //     bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
  //     public_url: process.env.CLOUDFLARE_R2_PUBLIC_URL,
  //   },
  // },
  {
    resolve: `medusa-plugin-sendgrid`,
    options: {
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM,
      user_password_reset_template: process.env.SENDGRID_FORGOT_PASSWORD_ID,
      order_placed_template: process.env.SENDGRID_ORDER_PLACED_ID,
    },
  },
];

const modules = {
  eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
};

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  // Uncomment the following lines to enable REDIS
  redis_url: REDIS_URL
};

const featureFlags = {
  product_categories: true
}

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
  featureFlags
};

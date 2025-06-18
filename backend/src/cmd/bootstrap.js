import { fastify } from "fastify";

import { cors } from "./plugins/cors.js";
import { multipart } from "./plugins/multipart.js";
import { swagger } from "./plugins/swagger.js";

export const withApp = (app) => (fn) => fn(app);

export const bootstrap = async () => {
  const app = fastify({
    logger: true,
    connectionTimeout: 10 * 60 * 1000,
    requestTimeout: 10 * 60 * 1000,
  });

  await Promise.all([cors, multipart, swagger].map(withApp(app)));

  return app;
};

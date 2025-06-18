export const cors = (fastify) =>
  fastify.register(import("@fastify/cors"), { origin: "*" });

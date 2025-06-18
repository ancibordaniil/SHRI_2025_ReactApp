export const swagger = (fastify) =>
  Promise.all([
    // swagger
    fastify.register(import("@fastify/swagger"), {
      swagger: {
        info: {
          title: "Report API",
          description: "API для генерации отчетов",
          version: "1.0.0",
        },
        host: "localhost:3000",
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json", "text/csv"],
        tags: [
          { name: "reports", description: "Операции с отчетами" },
          { name: "aggregates", description: "Агрегация данных" },
        ],
      },
    }),
    // swagger-ui
    fastify.register(import("@fastify/swagger-ui"), {
      routePrefix: "/swagger",
      uiConfig: {
        docExpansion: "full",
        deepLinking: false,
      },
      uiHooks: {
        onRequest: function (request, reply, next) {
          next();
        },
        preHandler: function (request, reply, next) {
          next();
        },
      },
      staticCSP: true,
      transformStaticCSP: (header) => header,
      transformSpecification: (swaggerObject) => swaggerObject,
      transformSpecificationClone: true,
    }),
  ]);

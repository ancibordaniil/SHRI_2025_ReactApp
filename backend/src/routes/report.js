import { generateReport } from "../pkg/generateReport/index.js";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export const reportRoute = async (fastify) => {
  fastify.get(
    "/report",
    {
      schema: {
        tags: ["reports"],
        summary: "Генерация отчета",
        description: "Генерирует CSV отчет с заданными параметрами",
        querystring: {
          type: "object",
          required: ["size"],
          properties: {
            size: {
              type: "number",
              description: "Размер отчета в ГБ",
            },
            withErrors: {
              type: "string",
              default: "off",
              description: "Включать ли ошибки в отчет",
            },
            maxSpend: {
              type: "string",
              default: "1000",
              description: "Максимальная сумма расходов",
            },
          },
        },
        response: {
          200: {
            type: "string",
            description: "CSV файл с отчетом",
            headers: {
              "Content-Type": {
                type: "string",
                default: "text/csv",
              },
              "Content-Disposition": { type: "string" },
            },
          },
          400: {
            type: "object",
            description: "Ошибка валидации параметров",
            properties: {
              error: { type: "string" },
            },
          },
          500: {
            type: "object",
            description: "Внутренняя ошибка сервера",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    (request, reply) => {
      const { size, withErrors, maxSpend } = request.query;

      try {
        const reportGenerator = generateReport({
          targetSizeGb: size,
          withErrors: withErrors === "on",
          civs: ["humans", "blobs", "monsters"],
          maxSpend: Number(maxSpend) || 1000,
        });

        reply.type("text/csv");
        reply.header("Content-Disposition", "attachment; filename=report.csv");
        reply.header("Cache-Control", "no-cache");

        return reply.send(reportGenerator);
      } catch (error) {
        fastify.log.error(error);
        if (!reply.sent) {
          reply.status(500).send({ error: "Внутренняя ошибка сервера" });
        }
      }
    }
  );
};

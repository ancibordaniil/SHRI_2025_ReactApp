import { pipeline } from "stream/promises";
import { aggregate } from "../pkg/aggregator/index.js";
import { PassThrough } from "stream";
import { setTimeout } from "node:timers/promises";

/**
 * @param {import("fastify").FastifyInstance} fastify
 */
export const aggregateRoute = async (fastify) => {
    fastify.post(
        "/aggregate",
        {
            schema: {
                tags: ["aggregate"],
                summary: "Агрегация данных",
                description: "Агрегирует данные с заданными параметрами",
                consumes: ["multipart/form-data"],
                querystring: {
                    type: "object",
                    required: ["rows"],
                    properties: {
                        rows: {
                            type: "number",
                            description:
                                "Количество строк для промежуточного агрегирования",
                        },
                    },
                },
                response: {
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
        async (request, reply) => {
            try {
                if (!request.isMultipart()) {
                    return reply.status(400).send({
                        error: "Запрос должен содержать multipart/form-data с файлом",
                    });
                }
                const data = await request.file();

                if (!data) {
                    return reply.status(400).send({ error: "Файл не найден" });
                }

                const aggregator = aggregate({ rows: request.query.rows });
                const result = new PassThrough({
                    objectMode: true,
                    transform(chunk, _, cb) {
                        setTimeout(100).then(() => {
                            this.push(JSON.stringify(chunk) + "\n");
                            cb();
                        });
                    },
                });

                pipeline(data.file, aggregator, result).catch((error) => {
                    fastify.log.error(error);
                    result.destroy(error);
                    if (!reply.sent) {
                        reply
                            .status(500)
                            .send({ error: "Внутренняя ошибка сервера" });
                    }
                });

                return reply.send(result);
            } catch (error) {
                fastify.log.error(error);
                if (!reply.sent) {
                    return reply
                        .status(500)
                        .send({ error: "Внутренняя ошибка сервера" });
                }
            }
        }
    );
};

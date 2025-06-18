import { reportRoute } from "../routes/report.js";
import { aggregateRoute } from "../routes/aggregate.js";

/**
 * @param {import("fastify").FastifyInstance} app
 */
export const serve = async (app) => {
    try {
        await app.register(reportRoute);
        await app.register(aggregateRoute);

        await app.listen({ port: 3000 });
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

export const multipart = (fastify) =>
    fastify.register(import("@fastify/multipart"), {
        limits: {
            fileSize: 6 * 1024 * 1024 * 1024,
            files: 1,
            fields: 10,
            parts: 1000,
        },
        throwFileSizeLimit: false,
        attachFieldsToBody: false,
    });

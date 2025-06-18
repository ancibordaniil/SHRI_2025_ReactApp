import { createRecordGenerator } from "./recordGenerator.js";
import { ReadableStream } from "stream/web";
import { Readable } from "stream";

/**
 * @param {Object} params
 * @param {number} params.targetSizeGb
 * @param {boolean} params.withErrors
 * @param {string[]} params.civs
 * @param {number} params.maxSpend
 * @returns {Promise<ReadableStream>}
 */
export const generateReport = (params) => {
  const { targetSizeGb, withErrors, civs, maxSpend } = params;
  const recordGenerator = createRecordGenerator({
    withErrors,
    civs,
    maxSpend,
  });

  let isHeadersWritten = false;
  const targetSize = targetSizeGb * 1024 * 1024 * 1024;
  let currentSize = 0;

  const stream = new ReadableStream({
    async pull(controller) {
      if (currentSize >= targetSize) {
        controller.close();
        return;
      }

      let data;
      if (!isHeadersWritten) {
        data = recordGenerator.generateHeaders();
        isHeadersWritten = true;
      } else {
        data = recordGenerator.generateRecordsBlock(100);
      }

      currentSize += data.length;
      controller.enqueue(data);
    },
  });

  return Readable.fromWeb(stream);
};

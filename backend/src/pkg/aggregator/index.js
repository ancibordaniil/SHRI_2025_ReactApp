import { TransformStream } from "node:stream/web";
import { Transform } from "node:stream";

const CharCodes = {
    NEW_LINE: 10,
    COMMA: 44,
    MINUS: 45,
    ZERO: 48,
    NINE: 57,
};

const Buffers = {
    SPEND: Buffer.from("spend"),
    DATE: Buffer.from("date"),
    CIV: Buffer.from("civ"),
    HUMAN: Buffer.from("humans"),
    BLOBS: Buffer.from("blobs"),
    MONSTERS: Buffer.from("monsters"),
};

const compareBuffers = (target, offset, length, candidate) => {
    if (length !== candidate.length) return false;

    for (let i = 0; i < length; i++) {
        if (target[offset + i] !== candidate[i]) return false;
    }

    return true;
};

const parseNumberFromBuffer = (buffer, start, end) => {
    let result = 0;
    let negative = false;

    for (let i = start; i < end; i++) {
        const currentCharCode = buffer[i];
        if (currentCharCode === CharCodes.MINUS) {
            negative = true;
            continue;
        }

        const isDigit =
            currentCharCode >= CharCodes.ZERO &&
            currentCharCode <= CharCodes.NINE;

        if (isDigit) {
            result = result * 10 + (currentCharCode - CharCodes.ZERO);
        }
    }

    return negative ? -result : result;
};

const hashBuffer = (buffer, start, end) => {
    let hash = 0;

    for (let i = start; i < end; i++) {
        hash = (hash << 5) - hash + buffer[i];
    }

    return hash >>> 0;
};

const exchangeRate = new Map();
exchangeRate.set(hashBuffer(Buffers.HUMAN, 0, Buffers.HUMAN.length), 0.5);
exchangeRate.set(hashBuffer(Buffers.BLOBS, 0, Buffers.BLOBS.length), 1);
exchangeRate.set(hashBuffer(Buffers.MONSTERS, 0, Buffers.MONSTERS.length), 1.5);

/**
 * @param {Object} params
 * @param {number} params.rows
 * @returns {TransformStream}
 */
export const aggregate = (params) => {
    const { rows } = params;

    let buffer = Buffer.alloc(256000);
    let bufferOffset = 0;

    let isHeadersParsed = false;
    let spendIndex = -1;
    let dateIndex = -1;
    let civIndex = -1;

    const spendsByDate = new Map();
    const spendsByCiv = new Map();

    let rowCount = 0;
    let totalSpendGalactic = 0;

    let currentSpend = 0;
    let currentDateHash = 0;
    let currentCivHash = 0;

    const dateHashToString = new Map();
    const civHashToString = new Map();
    civHashToString.set(
        hashBuffer(Buffers.HUMAN, 0, Buffers.HUMAN.length),
        "humans"
    );
    civHashToString.set(
        hashBuffer(Buffers.BLOBS, 0, Buffers.BLOBS.length),
        "blobs"
    );
    civHashToString.set(
        hashBuffer(Buffers.MONSTERS, 0, Buffers.MONSTERS.length),
        "monsters"
    );

    const processHeaders = (lineStart, lineEnd) => {
        isHeadersParsed = true;

        let colIndex = 0;
        let fieldStart = lineStart;

        const processField = (fieldEnd) => {
            const compare = compareBuffers.bind(
                null,
                buffer,
                fieldStart,
                fieldEnd - fieldStart
            );

            if (compare(Buffers.SPEND)) {
                spendIndex = colIndex;
            } else if (compare(Buffers.DATE)) {
                dateIndex = colIndex;
            } else if (compare(Buffers.CIV)) {
                civIndex = colIndex;
            }
        };

        for (let i = lineStart; i < lineEnd; i++) {
            if (buffer[i] === CharCodes.COMMA) {
                processField(i);

                colIndex++;
                fieldStart = i + 1;
            }
        }

        processField(lineEnd);
    };

    const processData = (lineStart, lineEnd) => {
        rowCount++;

        let colIndex = 0;
        let fieldStart = lineStart;

        currentSpend = 0;
        currentDateHash = 0;
        currentCivHash = 0;

        let isInvalidLine = false;

        const processField = (fieldEnd) => {
            if (fieldEnd === lineEnd && colIndex === 0) {
                isInvalidLine = true;
                return;
            }

            if (colIndex === spendIndex) {
                currentSpend = parseNumberFromBuffer(
                    buffer,
                    fieldStart,
                    fieldEnd
                );

                if (currentSpend < 0) {
                    isInvalidLine = true;
                    return;
                }
            } else if (colIndex === dateIndex) {
                currentDateHash = hashBuffer(buffer, fieldStart, fieldEnd);
                if (!dateHashToString.has(currentDateHash)) {
                    const dateStr = buffer.toString(
                        "utf8",
                        fieldStart,
                        fieldEnd
                    );
                    dateHashToString.set(currentDateHash, dateStr);
                }
            } else if (colIndex === civIndex) {
                currentCivHash = hashBuffer(buffer, fieldStart, fieldEnd);
                if (!civHashToString.has(currentCivHash)) {
                    isInvalidLine = true;
                    return;
                }
            }
        };

        for (let i = lineStart; i <= lineEnd; i++) {
            if (i === lineEnd || buffer[i] === CharCodes.COMMA) {
                processField(i);
                if (isInvalidLine) {
                    rowCount--;
                    return;
                }

                colIndex++;
                fieldStart = i + 1;
            }
        }

        currentSpend *= exchangeRate.get(currentCivHash);
        totalSpendGalactic += currentSpend;

        let dateSpend = spendsByDate.get(currentDateHash) || 0;
        spendsByDate.set(currentDateHash, dateSpend + currentSpend);

        let civSpend = spendsByCiv.get(currentCivHash) || 0;
        spendsByCiv.set(currentCivHash, civSpend + currentSpend);
    };

    const processLine = (lineStart, lineEnd) => {
        if (!isHeadersParsed) {
            processHeaders(lineStart, lineEnd);
            return;
        }

        processData(lineStart, lineEnd);
    };

    const aggregateStats = () => {
        if (rowCount === 0) {
            return {
                total_spend_galactic: 0,
                rows_affected: 0,
                average_spend_galactic: 0,
            };
        }

        let minDateHash = null;
        let maxDateHash = null;
        let minDateSpend = Infinity;
        let maxDateSpend = -Infinity;

        for (const [dateHash, spend] of spendsByDate.entries()) {
            if (spend < minDateSpend) {
                minDateSpend = spend;
                minDateHash = dateHash;
            }
            if (spend > maxDateSpend) {
                maxDateSpend = spend;
                maxDateHash = dateHash;
            }
        }

        let minCivHash = null;
        let maxCivHash = null;
        let minCivSpend = Infinity;
        let maxCivSpend = -Infinity;

        for (const [civHash, spend] of spendsByCiv.entries()) {
            if (spend < minCivSpend) {
                minCivSpend = spend;
                minCivHash = civHash;
            }
            if (spend > maxCivSpend) {
                maxCivSpend = spend;
                maxCivHash = civHash;
            }
        }

        const lessSpentAt = dateHashToString.get(minDateHash);
        const bigSpentAt = dateHashToString.get(maxDateHash);
        const lessSpentCiv = civHashToString.get(minCivHash);
        const bigSpentCiv = civHashToString.get(maxCivHash);

        const averageSpendGalactic = totalSpendGalactic / rowCount;

        return {
            total_spend_galactic: totalSpendGalactic,
            rows_affected: rowCount,
            less_spent_at: parseInt(lessSpentAt),
            big_spent_at: parseInt(bigSpentAt),
            less_spent_value: minDateSpend,
            big_spent_value: maxDateSpend,
            average_spend_galactic: averageSpendGalactic,
            big_spent_civ: bigSpentCiv,
            less_spent_civ: lessSpentCiv,
        };
    };

    const stream = new TransformStream({
        async transform(chunk, controller) {
            if (bufferOffset + chunk.length > buffer.length) {
                const newBuffer = Buffer.alloc(buffer.length * 2);
                buffer.copy(newBuffer, 0, 0, bufferOffset);
                buffer = newBuffer;
            }

            chunk.copy(buffer, bufferOffset);
            const newDataEnd = bufferOffset + chunk.length;

            let lineStart = 0;
            for (let i = 0; i < newDataEnd; i++) {
                if (buffer[i] === CharCodes.NEW_LINE) {
                    processLine(lineStart, i);
                    lineStart = i + 1;

                    if (rowCount % rows === 0) {
                        const result = aggregateStats();
                        controller.enqueue(result);
                    }
                }
            }

            if (lineStart < newDataEnd) {
                const remainingLength = newDataEnd - lineStart;
                buffer.copy(buffer, 0, lineStart, newDataEnd);
                bufferOffset = remainingLength;
            } else {
                bufferOffset = 0;
            }
        },
        flush(controller) {
            if (bufferOffset > 0) {
                processLine(0, bufferOffset);
            }

            const result = aggregateStats();
            controller.enqueue(result);
        },
    });

    return Transform.fromWeb(stream, {
        objectMode: true,
        highWaterMark: 100 * 1024 * 1024,
    });
};

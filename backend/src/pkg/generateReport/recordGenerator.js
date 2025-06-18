import { buffy } from "./buffy.js";

const MAX_DEVELOPER_ID = 10_000_000_000_000;
const ERROR_CHANCE = 0.01;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {Object} params
 * @param {boolean} params.withErrors
 * @param {string[]} params.civs
 * @param {number} params.maxSpend
 * @returns {Object}
 */
export function createRecordGenerator({ withErrors, civs, maxSpend }) {
  const CIVILIZATIONS = civs.map((civ) => Buffer.from(civ));

  let recordId = 0;

  function shouldGenerateError() {
    return withErrors && Math.random() < ERROR_CHANCE;
  }

  const generateRecord = () => {
    // Генерируем полностью невалидную строку
    if (shouldGenerateError()) {
      const length = getRandomInt(16, 32);
      return Buffer.concat([buffy.createRandomString(length), buffy.newline]);
    }

    const civ = CIVILIZATIONS[getRandomInt(0, CIVILIZATIONS.length - 1)];

    const developer_id = buffy.numToBuffer(getRandomInt(0, MAX_DEVELOPER_ID));
    const date = buffy.numToBuffer(getRandomInt(0, 364));

    // Генерируем отрицательный spend
    let spend = getRandomInt(1, maxSpend);
    if (shouldGenerateError()) {
      spend = -getRandomInt(1, maxSpend);
    }
    spend = buffy.numToBuffer(spend);

    let finalCiv = civ;
    if (shouldGenerateError()) {
      finalCiv = Buffer.concat([
        Buffer.from("unknown_"),
        buffy.createRandomString(5),
      ]);
    }

    recordId++;

    return Buffer.concat([
      buffy.numToBuffer(recordId),
      buffy.comma,
      finalCiv,
      buffy.comma,
      developer_id,
      buffy.comma,
      date,
      buffy.comma,
      spend,
      buffy.newline,
    ]);
  };

  const generateRecordsBlock = (size) => {
    let data = Buffer.alloc(0);

    for (let i = 0; i < size; i++) {
      data = Buffer.concat([data, generateRecord()]);
    }

    return data;
  };

  const generateHeaders = () => buffy.headers;

  return {
    generateRecord,
    generateRecordsBlock,
    generateHeaders,
  };
}

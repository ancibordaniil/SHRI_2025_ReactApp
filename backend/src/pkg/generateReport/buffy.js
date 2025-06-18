const HEADERS = Buffer.from("id,civ,developer_id,date,spend\n");
const CHARS = Buffer.from(
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:<>?"
);
const COMMA = Buffer.from(",");
const NEWLINE = Buffer.from("\n");

export const buffy = {
    getStringBufferFromNumber: (number) => {
        return Buffer.from(number.toString());
    },

    get headers() {
        return HEADERS;
    },

    get comma() {
        return COMMA;
    },

    get newline() {
        return NEWLINE;
    },

    get chars() {
        return CHARS;
    },

    createRandomString(length) {
        const result = Buffer.alloc(length);

        for (let i = 0; i < length; i++) {
            const charIndex = Math.floor(Math.random() * CHARS.length);
            result[i] = CHARS[charIndex];
        }

        return result;
    },

    numToBuffer(number) {
        return Buffer.from(number.toString());
    },
};

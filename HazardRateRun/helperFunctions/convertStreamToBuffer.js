module.exports = async function (stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data));
        });
        stream.on("end", () => {
            resolve(Buffer.concat(chunks));
        });
        stream.on("error", reject);
    });
};

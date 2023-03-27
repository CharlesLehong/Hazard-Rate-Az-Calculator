const { BlobServiceClient } = require("@azure/storage-blob");
const convertStreamToBuffer = require("./convertStreamToBuffer");
module.exports = async function (connectionString, containerName, fileName) {
    const blobServiceClient = await BlobServiceClient.fromConnectionString(
        connectionString
    );
    const containerClient = await blobServiceClient.getContainerClient(
        containerName
    );
    const blobClient = containerClient.getBlobClient(fileName);
    const blob = await blobClient.download();
    const blobBuffer = await convertStreamToBuffer(blob.readableStreamBody);
    return blobBuffer.toString();
};

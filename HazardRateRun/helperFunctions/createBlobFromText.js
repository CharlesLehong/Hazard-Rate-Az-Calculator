const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (
    connectionString,
    containerName,
    fileName,
    fileStringContent
) {
    const blobServiceClient = await BlobServiceClient.fromConnectionString(
        connectionString
    );

    const containerClient = await blobServiceClient.getContainerClient(
        containerName
    );

    const blockBlobClient = await containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.upload(fileStringContent, fileStringContent.length, {
        contentSettings: { contentType: "application/json" },
    });
};

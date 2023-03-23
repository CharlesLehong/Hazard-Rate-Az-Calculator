const { BlobServiceClient } = require("@azure/storage-blob");

module.exports = async function (
    accountName,
    accountKey,
    containerName,
    fileName,
    fileStringContent
) {
    const blobServiceClient = await BlobServiceClient.fromConnectionString(
        `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`
    );

    const containerClient = await blobServiceClient.getContainerClient(
        containerName
    );

    const blockBlobClient = await containerClient.getBlockBlobClient(fileName);

    await blockBlobClient.upload(fileStringContent, fileStringContent.length, {
        contentSettings: { contentType: "application/json" },
    });
};

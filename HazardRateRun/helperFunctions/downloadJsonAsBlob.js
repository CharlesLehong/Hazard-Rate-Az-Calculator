const { BlobServiceClient } = require("@azure/storage-blob");
const convertStreamToBuffer = require("./convertStreamToBuffer");
module.exports = async function (
    accountName,
    accountKey,
    containerName,
    fileName
) {
    const blobServiceClient = await BlobServiceClient.fromConnectionString(
        `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`
    );
    const containerClient = await blobServiceClient.getContainerClient(
        containerName
    );
    const blobClient = containerClient.getBlobClient(fileName);
    const blob = await blobClient.download();
    const blobBuffer = await convertStreamToBuffer(blob.readableStreamBody);
    // const jsonData = (
    //     await convertStreamToBuffer(blob.readableStreamBody)
    // ).toString();
    return blobBuffer.toString();
};

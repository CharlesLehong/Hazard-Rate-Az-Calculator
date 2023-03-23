const { QueueServiceClient } = require("@azure/storage-queue");
module.exports = async function (
    accountName,
    accountKey,
    queueName,
    messageText
) {
    const queueServiceClient = QueueServiceClient.fromConnectionString(
        `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`
    );
    const queueClient = queueServiceClient.getQueueClient(queueName);
    await queueClient.sendMessage(messageText);
};

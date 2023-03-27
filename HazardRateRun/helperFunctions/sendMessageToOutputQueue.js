const { QueueServiceClient } = require("@azure/storage-queue");
module.exports = async function (connectionString, queueName, messageText) {
    const queueServiceClient =
        QueueServiceClient.fromConnectionString(connectionString);
    const queueClient = queueServiceClient.getQueueClient(queueName);
    await queueClient.sendMessage(messageText);
};

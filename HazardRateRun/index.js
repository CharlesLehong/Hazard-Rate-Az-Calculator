require("dotenv").config();
const downloadBlobAsJson = require("./helperFunctions/downloadBlobAsJson");
const createBlobFromText = require("./helperFunctions/createBlobFromText");
const sendMessageToOutputQueue = require("./helperFunctions/sendMessageToOutputQueue");
const {
    HazardRateFacade,
} = require("@turnbuckle/aprs-calculator-services/lib/facades/hazard-rate-facade/hazard-rate-facade.js");

module.exports = async function (context, queueMessageItem) {
    const accountName = process.env.STORAGE_ACCOUNT_NAME;
    const accountKey = process.env.STORAGE_ACCOUNT_KEY;
    const connectionString = `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`;

    const input = await downloadBlobAsJson(
        connectionString,
        queueMessageItem.inputContainerName,
        queueMessageItem.inputFileName
    );

    const output = await HazardRateFacade.calculateAllMatrices(
        JSON.parse(input)
    );

    const outputFileName = `${context.bindingData.id}.json`;

    await createBlobFromText(
        connectionString,
        queueMessageItem.outputContainerName,
        outputFileName,
        JSON.stringify(output)
    );

    await sendMessageToOutputQueue(
        connectionString,
        queueMessageItem.outputQueueName,
        JSON.stringify({
            outputFileName: outputFileName,
            accountName: accountName,
            containerName: queueMessageItem.outputContainerName,
        })
    );
};

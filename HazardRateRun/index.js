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

    const input = await downloadBlobAsJson(
        accountName,
        accountKey,
        queueMessageItem.inputContainerName,
        queueMessageItem.inputFileName
    );

    const output = await HazardRateFacade.calculateAllMatrices(
        JSON.parse(input)
    );

    const outputFileName = `${context.bindingData.id}.json`;

    await createBlobFromText(
        accountName,
        accountKey,
        queueMessageItem.outputContainerName,
        outputFileName,
        JSON.stringify(output)
    );

    await sendMessageToOutputQueue(
        accountName,
        accountKey,
        queueMessageItem.outputQueueName,
        JSON.stringify({
            outputFileName: outputFileName,
            accountName: accountName,
            containerName: queueMessageItem.outputContainerName,
        })
    );
};

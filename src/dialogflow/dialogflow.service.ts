import {response} from "express";

const uuid = require('uuid');
const dialogflow = require('dialogflow');
const {Storage} = require('@google-cloud/storage');

export class DialogFlowService {
    constructor(private dialogFlowEntityRepository: string) {}
    async sendMessage(sessionId:string,message:string) {
        // A unique identifier for the given session
        const projectId = 'betsbi-chatbot';
        // Create a new session
        const sessionClient = new dialogflow.SessionsClient({keyFilename:"betsbi-chatbot-2b9665f1368b.json"});
        const sessionPath = sessionClient.sessionPath(projectId, sessionId);

        // The text query request.
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    // The query to send to the dialogflow agent
                    text: message,
                    // The language used by the client (en-US)
                    languageCode: 'fr-FR',
                },
            },
        };

        // Send request and log result
        const responses = await sessionClient.detectIntent(request);
        //console.log('Detected intent');
        const result = responses[0].queryResult;
        //console.log(`  Response: ${result.fulfillmentText}`);
        /*
        if (result.intent) {
            console.log(`  Intent: ${result.intent.displayName}`);
        } else {
            console.log(`  No intent matched.`);
        }*/
        return result.fulfillmentText;

    }
}

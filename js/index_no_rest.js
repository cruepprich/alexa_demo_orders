'use strict';

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: '1.0',
        sessionAttributes,
        response: speechletResponse,
    };
}
function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    console.log('build speech response ',title);
    return {
        outputSpeech: {
            type: 'PlainText',
            text: output,
        },
        card: {
            type: 'Simple',
            title: `SessionSpeechlet - ${title}`,
            content: `SessionSpeechlet - ${output}`,
        },
        reprompt: {
            outputSpeech: {
                type: 'PlainText',
                text: repromptText,
            },
        },
        shouldEndSession,
    };
}

function onIntent(intentRequest, session, callback) {

    const repromptText = null;
    const sessionAttributes = {};
    let shouldEndSession = false;
    let speechOutput = 'Hello there';
    const intent = intentRequest.intent;
    const firstName = intentRequest.intent.slots.firstName.value;
    const lastName = intentRequest.intent.slots.lastName.value;
    const intentName = intentRequest.intent.name;
    console.log('intentName',intentName, firstName, lastName);
    console.log('onIntent requestId=${intentRequest.requestId}, sessionId=${session.sessionId}');

    if (intentName === 'NumberOfOrdersForCustomer') {
        speechOutput = 'Customer ' + firstName + lastName + ' placed 15 orders';
    }

    callback(sessionAttributes,
         buildSpeechletResponse('hello', speechOutput, repromptText, shouldEndSession));

}

exports.handler = (event, context, callback) => {
    try {
        console.log('starting yo!')
        console.log('event.session.application.applicationId=${event.session.application.applicationId}');

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== 'amzn1.echo-sdk-ams.app.[unique-value-here]') {
             callback('Invalid Application ID');
        }
        */

        if (event.session.new) {
            onSessionStarted({ requestId: event.request.requestId }, event.session);
        }

        if (event.request.type === 'LaunchRequest') {
            onLaunch(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'IntentRequest') {
            onIntent(event.request,
                event.session,
                (sessionAttributes, speechletResponse) => {
                    callback(null, buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === 'SessionEndedRequest') {
            onSessionEnded(event.request, event.session);
            callback();
        }
    } catch (err) {
        callback(err);
    }
};
/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log(`onSessionStarted requestId=${sessionStartedRequest.requestId}, sessionId=${session.sessionId}`);
}
/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log(`onLaunch requestId=${launchRequest.requestId}, sessionId=${session.sessionId}`);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}
/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log(`onSessionEnded requestId=${sessionEndedRequest.requestId}, sessionId=${session.sessionId}`);
    // Add cleanup logic here
}
function getWelcomeResponse(callback) {
    console.log('getWelcomeResponse','Yowsa!');
    // If we wanted to initialize the session to have some attributes we could add those here.
    const sessionAttributes = {};
    const cardTitle = 'Welcome';
    const speechOutput = 'Welcome to the demo orders skil. ' +
        'Please ask how many orders someone placed.';
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    const repromptText = 'Yo! I said to please ask how many orders someone placed.';
    const shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}
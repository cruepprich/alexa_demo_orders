/**
    Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

    Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at

        http://aws.amazon.com/apache2.0/

    or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/



/**
 * App ID for the skill
 */
var APP_ID = undefined; //replace with 'amzn1.echo-sdk-ams.app.[your-unique-value-here]';

var https = require('https');

/**
 * The AlexaSkill Module that has the AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');

/**
 * URL prefix to download history content from Wikipedia
 */
var urlPrefix = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&explaintext=&exsectionformat=plain&redirects=&titles=';

/**
 * Variable defining number of events to be read at one time
 */
var paginationSize = 3;

/**
 * Variable defining the length of the delimiter between events
 */
var delimiterSize = 2;

/**
 * DemoOrdersSkill is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var DemoOrdersSkill = function() {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
DemoOrdersSkill.prototype = Object.create(AlexaSkill.prototype);
DemoOrdersSkill.prototype.constructor = DemoOrdersSkill;

DemoOrdersSkill.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("DemoOrdersSkill onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session init logic would go here
};

DemoOrdersSkill.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("DemoOrdersSkill onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    getWelcomeResponse(response);
};

DemoOrdersSkill.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);

    // any session cleanup logic would go here
};

DemoOrdersSkill.prototype.intentHandlers = {

    "NumberOfOrdersForCustomer": function (intent, session, response) {
        handleNumberOfOrdersForCustomer(intent, session, response);
    },

    "NumberOfItemsForCustomer": function (intent, session, response) {
        handleNumberOfItemsForCustomer(intent, session, response);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        var speechText = "Demo Orders queries the demo_orders table from the APEX sample schema.  " +
            "You can as how many orders did John Dulles place?";
        var repromptText = "Who's orders do you want to count?";
        var speechOutput = {
            speech: speechText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        var repromptOutput = {
            speech: repromptText,
            type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.ask(speechOutput, repromptOutput);
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Goodbye",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = {
                speech: "Goodbye",
                type: AlexaSkill.speechOutputType.PLAIN_TEXT
        };
        response.tell(speechOutput);
    }
};

/**
 * Function to handle the onLaunch skill behavior
 */

function getWelcomeResponse(response) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var cardTitle = "This Day in History";
    var repromptText = "With History Buff, you can get historical events for any day of the year. For example, you could say today, or August thirtieth. Now, which day do you want?";
    var speechText = "<p>History buff.</p> <p>What day do you want events for?</p>";
    var cardOutput = "History Buff. What day do you want events for?";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.

    var speechOutput = {
        speech: "<speak>" + speechText + "</speak>",
        type: AlexaSkill.speechOutputType.SSML
    };
    var repromptOutput = {
        speech: repromptText,
        type: AlexaSkill.speechOutputType.PLAIN_TEXT
    };
    response.askWithCard(speechOutput, repromptOutput, cardTitle, cardOutput);
}










function getRest(pQuery,pFirstName,pLastName,pCustomer,eventCallback) {
    var responseString='';
    var https = require('https');

    /**
     * HOW TO Make an HTTP Call - GET
     */
    // options for GET
    var headers = {};
    var firstName,lastName,customer;

    headers = {"RESPONSE":""
              ,"QUERY":pQuery
              ,"FIRST_NAME":pFirstName+""
              ,"LAST_NAME":pLastName+""
              ,"CUSTOMER":pCustomer
              ,"DATE":""
            };

    var optionsget = {
        host : 'apex.accenture.com', // here only the domain name
        // (no http/https !)
        port : 443,
        path : '/acdev/test2/alexa/', // the rest of the url with parameters if needed
        headers: headers,
        method : 'GET' // do GET
    };

    // console.info('Options prepared:');
    // console.info(optionsget);
    // console.info('Do the GET call');

    // do the GET request
    var reqGet = https.request(optionsget, function(res) {
        //console.log("statusCode: ", res.statusCode);
        // uncomment it for header details
        //console.log("headers: ", res.headers.response);

        res.on('data', function(data) {
            //console.info('GET result:\n');
            //process.stdout.write(d);
            //console.info('\n\nCall completed');
            responseString += data;
        });

        res.on('end', function() {
            eventCallback(responseString);
        })

    });


    reqGet.end();
    reqGet.on('error', function(e) {
        console.error(e);
    });   
}












function handleNumberOfOrdersForCustomer(intent, session, response) {
    var cardTitle         = "Orders For Customer",
        sessionAttributes = session.attributes,
        result            = sessionAttributes.text,
        speechText        = "",
        cardContent       = "",
        firstName         = intent.slots.firstName.value,
        lastName          = intent.slots.lastName.value,
        customer          = intent.slots.customer.value,
        repromptText      = "Do you want to know more about what happened on this date?";

    console.log('name',firstName, lastName);


    if (firstName === undefined) {firstName = ''; };
    if (lastName  === undefined) {lastName  = ''; };
    if (customer  === undefined) {customer  = ''; };

    getRest('NBR_OF_ORDERS_FOR_CUSTOMER',firstName,lastName,customer,function (events) {
            var speechText = "",
                repromptText ="This is the reprompt.",
                i;
            sessionAttributes.text = events;
            session.attributes = sessionAttributes;
            if (events.length == 0) {
                speechText = "There is a problem connecting to the web service at this time. Please try again later.";
                cardContent = speechText;
                response.tell(speechText);
            } else {
                speechText = events;
                var speechOutput = {
                    speech: "<speak>" + speechText + "</speak>",
                    type: AlexaSkill.speechOutputType.SSML
                };
                var repromptOutput = {
                    speech: repromptText,
                    type: AlexaSkill.speechOutputType.PLAIN_TEXT
                };
                response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
            }
        });
}











function handleNumberOfItemsForCustomer(intent, session, response) {
    var cardTitle         = "Items For Customer",
        sessionAttributes = session.attributes,
        result            = sessionAttributes.text,
        speechText        = "",
        cardContent       = "",
        firstName         = intent.slots.firstName.value,
        lastName          = intent.slots.lastName.value,
        customer          = intent.slots.customer.value,
        repromptText      = "Do you want to know more about what happened on this date?";

    console.log('name',firstName, lastName);


    if (firstName === undefined) {firstName = ''; };
    if (lastName  === undefined) {lastName  = ''; };
    if (customer  === undefined) {customer  = ''; };

    getRest('NBR_OF_ITEMS_FOR_CUSTOMER',firstName,lastName,customer,function (events) {
            var speechText = "",
                repromptText ="This is the reprompt.",
                i;
            sessionAttributes.text = events;
            session.attributes = sessionAttributes;
            if (events.length == 0) {
                speechText = "There is a problem connecting to the web service at this time. Please try again later.";
                cardContent = speechText;
                response.tell(speechText);
            } else {
                speechText = events;
                var speechOutput = {
                    speech: "<speak>" + speechText + "</speak>",
                    type: AlexaSkill.speechOutputType.SSML
                };
                var repromptOutput = {
                    speech: repromptText,
                    type: AlexaSkill.speechOutputType.PLAIN_TEXT
                };
                response.askWithCard(speechOutput, repromptOutput, cardTitle, cardContent);
            }
        });
}







function parseJson(inputText) {
    // sizeOf (/nEvents/n) is 10
    var text = inputText.substring(inputText.indexOf("\\nEvents\\n")+10, inputText.indexOf("\\n\\n\\nBirths")),
        retArr = [],
        retString = "",
        endIndex,
        startIndex = 0;

    if (text.length == 0) {
        return retArr;
    }

    while(true) {
        endIndex = text.indexOf("\\n", startIndex+delimiterSize);
        var eventText = (endIndex == -1 ? text.substring(startIndex) : text.substring(startIndex, endIndex));
        // replace dashes returned in text from Wikipedia's API
        eventText = eventText.replace(/\\u2013\s*/g, '');
        // add comma after year so Alexa pauses before continuing with the sentence
        eventText = eventText.replace(/(^\d+)/,'$1,');
        eventText = 'In ' + eventText;
        startIndex = endIndex+delimiterSize;
        retArr.push(eventText);
        if (endIndex == -1) {
            break;
        }
    }
    if (retString != "") {
        retArr.push(retString);
    }
    retArr.reverse();
    return retArr;
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the HistoryBuff Skill.
    var skill = new DemoOrdersSkill();
    skill.execute(event, context);
};


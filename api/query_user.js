'use strict';

const AWS      = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * @function queryUsersByName
 * @description 
 *   Queries users by name using the DynamoDB Global Secondary Index (GSI) "NameIndex".
 *   Supports pagination via `lastKey` and sorting via `order` (asc/desc).
 * 
 * @param   {Object} event - Lambda event with query parameters: name, limit, lastKey, order
 * 
 * @returns {Object}       - JSON response with matched users and pagination token
 */
module.exports.queryUsersByName = async (event) => {
    const queryName = event.queryStringParameters?.name;
    const limit     = parseInt(event.queryStringParameters?.limit) || 5;
    const lastKey   = event.queryStringParameters?.lastKey;
    const order     = event.queryStringParameters?.order === 'desc' ? false : true;

    if (!queryName) {
        return {
            statusCode : 400,
            body       : JSON.stringify({ error: 'Missing query parameter: name' }),
        };
    }

    const params = {
        TableName                 : 'Users',
        IndexName                 : 'NameIndex',
        KeyConditionExpression    : '#name = :name',
        ExpressionAttributeNames  : {
            '#name' : 'name',
        },
        ExpressionAttributeValues : {
            ':name' : queryName,
        },
        Limit            : limit,
        ScanIndexForward : order,
    };

    if (lastKey) {
        params.ExclusiveStartKey = {
            name : queryName,
            id   : lastKey,
        };
    }

    try {
        const data = await dynamoDB.query(params).promise();

        return {
            statusCode : 200,
            body       : JSON.stringify({
                items             : data.Items,
                lastEvaluatedKey  : data.LastEvaluatedKey?.id || null,
            }),
        };
    } catch (error) {
        console.error('Error querying users by name:', error);

        return {
            statusCode : 500,
            body       : JSON.stringify({ error: 'Could not query users by name' }),
        };
    }
};

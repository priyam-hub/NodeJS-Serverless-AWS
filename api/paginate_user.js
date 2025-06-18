'use strict';

const AWS      = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * @function paginateUsers
 * @description 
 *   Retrieves a paginated list of users from the DynamoDB "Users" table.
 *   Uses base64-encoded `lastKey` for pagination state tracking.
 * 
 * @param {Object} event - Lambda event object, with optional `limit` and `lastKey` in query parameters.
 * 
 * @returns {Object} - Returns paginated list of users and the next page token (lastKey).
 */
module.exports.paginateUsers = async (event) => {
    const queryParams = event.queryStringParameters || {};
    const limit       = parseInt(queryParams.limit) || 5;
    const lastKey     = queryParams.lastKey 
                        ? JSON.parse(Buffer.from(queryParams.lastKey, 'base64').toString('utf-8')) 
                        : undefined;

    const params = {
        TableName         : 'Users',
        Limit             : limit,
        ExclusiveStartKey : lastKey,
    };

    try {
        const data = await dynamoDB.scan(params).promise();

        const response = {
            items   : data.Items,
            lastKey : data.LastEvaluatedKey
                        ? Buffer.from(JSON.stringify(data.LastEvaluatedKey)).toString('base64')
                        : null,
        };

        return {
            statusCode : 200,
            body       : JSON.stringify(response),
        };
    } catch (error) {
        console.error('Error paginating users:', error);

        return {
            statusCode : 500,
            body       : JSON.stringify({ error: 'Could not paginate users' }),
        };
    }
};


/**
 * @function paginateAndSortUsers
 * @description 
 *   Paginates and sorts users from the DynamoDB "Users" table based on a provided key (`id` or `name`).
 *   Sorting is done in-memory after fetching a page using scan.
 * 
 * @param {Object} event - Lambda event object with optional `limit`, `lastKey`, and `sortBy` in query parameters.
 * 
 * @returns {Object} - Returns a sorted and paginated list of users along with the next page token.
 */
module.exports.paginateAndSortUsers = async (event) => {
    const limit           = parseInt(event.queryStringParameters?.limit) || 3;
    const lastKeyEncoded  = event.queryStringParameters?.lastKey;
    const sortBy          = event.queryStringParameters?.sortBy || 'name';

    const validSortKeys = ['id', 'name'];
    if (!validSortKeys.includes(sortBy)) {
        return {
            statusCode : 400,
            body       : JSON.stringify({ error: 'Invalid sort key. Use "id" or "name".' }),
        };
    }

    let ExclusiveStartKey;
    if (lastKeyEncoded) {
        try {
            ExclusiveStartKey = JSON.parse(Buffer.from(lastKeyEncoded, 'base64').toString('utf8'));
        } catch (err) {
            return {
                statusCode : 400,
                body       : JSON.stringify({ error: 'Invalid lastKey encoding' }),
            };
        }
    }

    const params = {
        TableName         : 'Users',
        Limit             : limit,
        ExclusiveStartKey : ExclusiveStartKey,
    };

    try {
        const data = await dynamoDB.scan(params).promise();

        const sortedItems = data.Items.sort((a, b) => {
            const valA = a[sortBy]?.toLowerCase?.() || a[sortBy];
            const valB = b[sortBy]?.toLowerCase?.() || b[sortBy];
            return valA > valB ? 1 : valA < valB ? -1 : 0;
        });

        const response = {
            items   : sortedItems,
            lastKey : data.LastEvaluatedKey
                        ? Buffer.from(JSON.stringify(data.LastEvaluatedKey)).toString('base64')
                        : null,
        };

        return {
            statusCode : 200,
            body       : JSON.stringify(response),
        };
    } catch (error) {
        console.error('Error paginating and sorting users:', error);

        return {
            statusCode : 500,
            body       : JSON.stringify({ error: 'Could not paginate and sort users' }),
        };
    }
};

'use strict';

const AWS      = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * @function sortUsers
 * @description 
 *   Retrieves all users from the "Users" table and sorts them by either name or id.
 * 
 * @param {Object} event - Lambda event object, expects optional query parameter `sortBy`
 * 
 * @returns {Object} - JSON response with sorted user list or error
 */
module.exports.sortUsers = async (event) => {
    const sortBy = event.queryStringParameters?.sortBy || 'name';

    const validSortKeys = ['name', 'id'];
    if (!validSortKeys.includes(sortBy)) {
        return {
            statusCode : 400,
            body       : JSON.stringify({ error: 'Invalid sort key. Use "name" or "id".' }),
        };
    }

    const params = {
        TableName : 'Users',
    };

    try {
        const data = await dynamoDB.scan(params).promise();

        const sortedUsers = data.Items.sort((a, b) => {
            const valA = a[sortBy]?.toLowerCase?.() || a[sortBy];
            const valB = b[sortBy]?.toLowerCase?.() || b[sortBy];
            return valA > valB ? 1 : valA < valB ? -1 : 0;
        });

        return {
            statusCode : 200,
            body       : JSON.stringify(sortedUsers),
        };
    } catch (error) {
        console.error('Error sorting users:', error);
        return {
            statusCode : 500,
            body       : JSON.stringify({ error: 'Could not sort users' }),
        };
    }
};

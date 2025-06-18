'use strict';

const AWS      = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * @function getUsers
 * @description 
 *   Retrieves all users from the "Users" DynamoDB table who are not soft-deleted.
 *   Users with `isDeleted = true` are filtered out using a scan operation.
 * 
 * @returns {Object} - JSON response containing a list of users or error
 */
module.exports.getUsers = async () => {
    const params = {
        TableName                 : 'Users',
        FilterExpression          : 'attribute_not_exists(isDeleted) OR isDeleted = :false',
        ExpressionAttributeValues : {
            ':false' : false,
        },
    };

    try {
        const data = await dynamoDB.scan(params).promise();
        return {
            statusCode : 200,
            body       : JSON.stringify(data.Items),
        };
    } catch (error) {
        console.error('Error fetching users:', error);
        return {
            statusCode : 500,
            body       : JSON.stringify({ error: 'Could not fetch users' }),
        };
    }
};

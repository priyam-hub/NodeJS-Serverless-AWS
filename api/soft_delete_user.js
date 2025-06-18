'use strict';

const AWS      = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * @function softDeleteUser
 * @description 
 *   Marks a user as soft-deleted by setting `isDeleted = true` in the "Users" table.
 *   The user remains in the database but is filtered out in standard fetches.
 * 
 * @param {Object} event - Lambda event object containing pathParameters.id
 * 
 * @returns {Object} - JSON response with success or error message
 */
module.exports.softDeleteUser = async (event) => {
    const { id } = event.pathParameters;

    const params = {
        TableName                 : 'Users',
        Key                       : { id },
        UpdateExpression          : 'set isDeleted = :deleted',
        ExpressionAttributeValues : {
            ':deleted' : true,
        },
        ReturnValues              : 'UPDATED_NEW',
    };

    try {
        await dynamoDB.update(params).promise();
        return {
            statusCode : 200,
            body       : JSON.stringify({ message: `User with id ${id} soft-deleted.` }),
        };
    } catch (error) {
        console.error('Soft delete error:', error);
        return {
            statusCode : 500,
            body       : JSON.stringify({ error: 'Soft delete failed.' }),
        };
    }
};

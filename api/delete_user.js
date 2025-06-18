'use strict';

const AWS      = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * @function deleteUser
 * @description 
 *   Permanently deletes a user from the DynamoDB "Users" table by their ID.
 * 
 * @param   {Object} event - The Lambda event object, which should include the user's `id` in pathParameters.
 * 
 * @returns {Object} - Returns a JSON response with:
 *                     - 200 if deletion is successful
 *                     - 500 if an internal error occurs
 * 
 * @throws   {Error} - If DynamoDB delete operation fails
 */
module.exports.deleteUser = async (event) => {
    const userID = event.pathParameters.id;

    const params = {
        TableName : 'Users',
        Key       : {
            id : userID
        }
    };

    try {
        await dynamoDB.delete(params).promise();

        return {
            statusCode : 200,
            body       : JSON.stringify({ message: 'User deleted successfully' })
        };

    } catch (error) {
        console.error('Error deleting user:', error);

        return {
            statusCode : 500,
            body       : JSON.stringify({ error: 'Could not delete user' })
        };
    }
};

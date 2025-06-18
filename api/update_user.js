'use strict';

const AWS      = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * @function updateUser
 * @description 
 *   Updates the name and email of a user in the "Users" table based on their ID.
 * 
 * @param {Object} event - Lambda event object containing pathParameters (id) and request body (name, email)
 * 
 * @returns {Object} - JSON response with updated user attributes or error message
 */
module.exports.updateUser = async (event) => {
    const userID          = event.pathParameters.id;
    const { name, email } = JSON.parse(event.body);

    const params = {
        TableName                 : 'Users',
        Key                       : { id : userID },
        UpdateExpression          : 'set #name = :name, email = :email',
        ExpressionAttributeNames  : { '#name': 'name' },
        ExpressionAttributeValues : {
            ':name'  : name,
            ':email' : email
        },
        ReturnValues              : 'ALL_NEW'
    };

    try {
        const result = await dynamoDB.update(params).promise();
        return {
            statusCode : 200,
            body       : JSON.stringify(result.Attributes)
        };
    } catch (error) {
        console.error('Error updating user:', error);
        return {
            statusCode : 500,
            body       : JSON.stringify({ error: 'Could not update user' })
        };
    }
};

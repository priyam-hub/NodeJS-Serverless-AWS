'use strict';

const AWS      = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

/**
 * @function createUser
 * @description 
 *   Creates a new user in the DynamoDB "Users" table with id, name, and email.
 * 
 * @param {Object} event - The Lambda event object. Expected to contain the HTTP request body with `id`, `name`, and `email`.
 * 
 * @returns {Object} - Returns a JSON response with a status code and message:
 *                     - 200 on success
 *                     - 400 if required fields are missing
 *                     - 500 on internal server error
 * 
 * @throws {Error} - If DynamoDB put operation fails
 */
module.exports.createUser = async (event) => {
    try {
        const body                = JSON.parse(event.body);
        const { id, name, email } = body;

        if (!id || !name || !email) {
            return {
                statusCode : 400,
                body       : JSON.stringify({ error: 'Missing id, name, or email' }),
            };
        }

        const params = {
            TableName : 'Users',
            Item      : {
                id    : id,
                name  : name,
                email : email
            }
        };

        await dynamoDB.put(params).promise();

        return {
            statusCode : 200,
            body       : JSON.stringify({ message: 'User created successfully' }),
        };

    } catch (error) {
        console.error('Error creating user:', error);

        return {
            statusCode : 500,
            body       : JSON.stringify({ error: 'Could not create user' }),
        };
    }
};

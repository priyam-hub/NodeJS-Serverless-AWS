'use strict';

const AWS      = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// CREATING USER

module.exports.createUser = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const { id, name, email } = body;

    if (!id || !name || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing id, name, or email' }),
      };
    }

    const params = {
      TableName: 'Users', 
      Item: {
        id,
        name,
        email,
      },
    };

    await dynamoDB.put(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User created successfully' }),
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not create user' }),
    };
  }
};

// READ ALL USERS

module.exports.getUsers = async () => {
  const params = {
    TableName: 'Users'
  };

  try {
    const data = await dynamoDB.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items)
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch users' })
    };
  }
};

// UPDATE USER

module.exports.updateUser = async (event) => {
  const userID = event.pathParameters.id;
  const { name, email } = JSON.parse(event.body);

  const params = {
    TableName: 'Users',
    Key: {
      id: userID
    },
    UpdateExpression: 'set #name = :name, email = :email',
    ExpressionAttributeNames: {
      '#name': 'name'
    },
    ExpressionAttributeValues: {
      ':name': name,
      ':email': email
    },
    ReturnValues: 'ALL_NEW'
  };

  try {
    const result = await dynamoDB.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes)
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not update user' })
    };
  }
};

// DELETE USER

module.exports.deleteUser = async (event) => {
  const userID = event.pathParameters.id;

  const params = {
    TableName: 'Users',
    Key: {
      id: userID
    }
  };

  try {
    await dynamoDB.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'User deleted successfully' })
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not delete user' })
    };
  }
};
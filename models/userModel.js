const { getDB } = require("../config/db");

function usersCollection() {
    return getDB().collection("users");
}

async function createUser(userData) {
    const result = await usersCollection().insertOne(userData);

    return usersCollection().findOne({
        _id: result.insertedId
    });
}

async function findUserByEmail(email) {
    return usersCollection().findOne({
        email: email.toLowerCase()
    });
}

async function findUserById(id) {
    const { ObjectId } = require("mongodb");

    if (!ObjectId.isValid(id)) {
        return null;
    }

    return usersCollection().findOne({
        _id: new ObjectId(id)
    });
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};

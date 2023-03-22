const users = []

const adduser = (user) => {
    const exsisteduser = users.find(existed => existed == user)
    if (!exsisteduser) {
        users.push(user)
    } else {
        return users
    }
}

module.exports = { users, adduser }
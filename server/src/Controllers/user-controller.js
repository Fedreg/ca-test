import users from '../DB/users.js'

export async function getUser(id) {
    let a = id - 1
    console.log(users[a])
    return users[a]
}
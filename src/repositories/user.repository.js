//Capa repository para usuarios



class UserRepository {
    constructor(dao) {
        this.dao = dao
    }

    createUser = async (first_name, last_name, email, age, password)=> {
        return this.dao.createUser(first_name, last_name, email, age, password)
    }

    findUser = async (email)=> {
        return this.dao.findUser(email)
    }

    updatePassword = async (email, password)=>{
        return this.dao.updatePassword(email, password)
    }

    changeUserRoleById = async (uid)=>{
        return this.dao.changeUserRoleById(uid)
    }

    updateUserLastconnection = async (uid)=>{
        return this.dao.updateUserLastconnection(uid)
    }

    addUserDocument = async (uid, filename, filePath)=>{
        return this.dao.addUserDocument(uid, filename, filePath)
    }

    getAllUsers = async () => {
        return this.dao.getAllUsers()
    }

}

module.exports = UserRepository
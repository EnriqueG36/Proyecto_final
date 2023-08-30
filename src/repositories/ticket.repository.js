//Capa repository para tickets

class TicketRepository {
    constructor(dao){
        this.dao = dao
    }

    createTicket = async (amount, email)=>{
        return this.dao.createTicket(amount, email)
    }

}

module.exports = TicketRepository
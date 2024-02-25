require('dotenv').config()
const { MongoClient } = require("mongodb")

class DataBaseService {
    client;
    db;
    constructor() {
        this.connect()
    }

    connect = async () => {
        try {
            this.client = await MongoClient.connect(process.env.MONGODB_URL)
            this.db = this.client.db(process.env.MONGODB_NAME)
        }catch(exception){
            throw exception
        }
    }
}

const dbSvc = new DataBaseService()
module.exports = {dbSvc, DataBaseService}
const MenuModel = require("./menu.model")

class MenuService {

    create = async (payload) => {
        try {
            const create = MenuModel(payload)
            return await create.save()
        } catch (exception) {
            throw exception
        }
    }

    countData = async (filter) => {
        try {
            const count = await MenuModel.countDocuments(filter)
            return count;
        } catch (exception) {
            throw exception
        }
    }

    getData = async (filter, { limit = 15, skip = 0 }) => {
        try {
            let data = await MenuModel.find(filter)
                .populate("parentId", ['_id', 'title', 'slug', 'status'])
                .populate("createdBy", ['_id', 'title', 'status'])
                .sort({ _id: "desc" })
                .skip(skip)
                .limit(limit)
            return data;
        } catch (exception) {
            throw exception
        }
    }

    getBySlugWithProduct = async (filter) => {
        try {
            const pipeline = [
                {
                    '$match':{
                        ...filter
                    }
                },
                {
                  '$lookup': {
                    'from': 'users', 
                    'localField': 'createdBy', 
                    'foreignField': '_id', 
                    'as': 'createdBy'
                  }
                }, {
                  '$lookup': {
                    'from': 'menus', 
                    'localField': 'parentId', 
                    'foreignField': '_id', 
                    'as': 'parentId'
                  }
                }, {
                  '$unwind': {
                    'path': '$parentId',
                    preserveNullAndEmptyArrays: true
                  }
                }, {
                  '$unwind': {
                    'path': '$createdBy',
                    preserveNullAndEmptyArrays: true
                  }
                }, {
                  '$project': {
                    '_id': '$_id', 
                    'title': '$title', 
                    'description': '$description', 
                    'slug': '$slug', 
                    'status': '$status', 
                    'parentId': '$parentId', 
                    'image': '$image', 
                    'createdAt': '$createdAt', 
                    'updatedAt': '$updatedAt', 
                    'createdBy': {
                      '_id': '$createdBy._id', 
                      'name': '$createdBy.name'
                    }
                  }
                }
              ]
            let data = await MenuModel.aggregate(pipeline)
            if (!data) {
                throw { code: 404, message: "Menu does not exists" }
            }
            return data
        } catch (exception) {
            throw exception
        }
    }

    getById = async (filter) => {
        try {
            let data = await MenuModel.findOne(filter)
                .populate("parentId", ['_id', 'title', 'slug', 'status'])
                .populate("createdBy", ['_id', 'name'])
            if (!data) {
                throw { code: 404, message: "Menu does not exists" }
            }
            return data
        } catch (exception) {
            throw exception
        }
    }

    updateById = async (id, data) => {
        try {
            const update = await MenuModel.findByIdAndUpdate(id, {
                $set: data
            })
            return update
        } catch (exception) {
            throw exception
        }
    }

    deleteById = async (id) => {
        try {
            let deleted = await MenuModel.findByIdAndDelete(id)
            if(deleted){
                return deleted
            }else{
                throw{code: 404, message: "Menu does not exists"}
            }
        } catch (exception) {
            throw exception
        }
    }
}

const menuSvc = new MenuService
module.exports = menuSvc
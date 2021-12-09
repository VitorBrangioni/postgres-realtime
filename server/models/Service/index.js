const Database = require('../../services/Database');

class Service {

  constructor() {
    throw new Error('It is not instantiable')
  }

  static async findAll() {
    let servicesFound = [];

    try {
      const database = new Database();
      await database.connect();
    
      const result = await database.query({
        text: 'SELECT * FROM public.service',
        params: []
      });

      servicesFound = result?.rows || [];
      
    } catch (error) {
      console.log(error);
    }

    return servicesFound;
  }

}

module.exports = Service;
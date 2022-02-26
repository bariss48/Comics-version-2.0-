const mongoose = require('mongoose');

const connect_db = async () => {
    try{
     const conn = await mongoose.connect(process.env.MONGO_URI,{
         useNewUrlParser: true,
         useCreateIndex: true,
         useFindAndModify: false,
         useUnifiedTopology: true
     });
     console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(error);
      process.exit(1);    
    }
}

module.exports = connect_db;
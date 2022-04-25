import mongoose from 'mongoose';

export let mongoConnection;
export const getMongoDB = async (SERVER_MODE, DB_ADDRESS) => {

    mongoConnection = await mongoose.connect(DB_ADDRESS)
    .then(() => { if (SERVER_MODE !== 'test') console.log('MongoDB is running on Atlas'); })
    .catch(error => { if (SERVER_MODE !== 'test') console.log('MongoDB is stucked on Atlas', JSON.stringify(error)); });
    
}

import mongoose from "mongoose";
import config from 'config'

export  const dbConnect = async() =>{
    mongoose.connect(config.get('dbUrl')).then(()=>console.log('Db connected')).catch(err=>console.log(err,'error in connecting db'))
}
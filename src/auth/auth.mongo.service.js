import userModel from "./classes/user.model";
import bcrypt from 'bcrypt';

/**
 * @returns true or false
 */
export const isUserExists = async (email) => {
    return await userModel.exists({ email }) !== null;
}

/**
 * 
 * @param {*} email
 * @param {*} password 
 * @returns user
 */
export const joinUser = async (email, password) => {
    return await userModel.create({ email, password });
}
/**
 * 
 * @param {*} email 
 * @param {*} password 
 * @returns user or null
 */
export const loginUser = async (email, password) => {
    const user =  await userModel.findOne({ email }).select('email password');
    const isSame = await bcrypt.compare(password, user.password);
    
    if (!isSame) return null;
    return user;
}

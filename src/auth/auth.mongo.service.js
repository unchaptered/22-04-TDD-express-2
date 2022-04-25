import userModel from "./classes/user.model";
import bcrypt from 'bcrypt';

/**
 * @returns **boolean**
 */
export const isUserExists = async (email) => {
    return await userModel.exists({ email }) !== null;
}

/**
 * @returns **boolean**
 */
export const isUserExistsById = async (_id) => {
    return await userModel.exists({ _id }) !== null;
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

export const getProfileById = async (_id) => {
    return await userModel.findById(_id);
}

export const deleteProfileByEmailAndPassowrd = async (email, password) => {
    const passwordEncrypt = await bcrypt.hash(password, 5);

    const user = await userModel.findOneAndDelete({ $and: [{ email }, { password: passwordEncrypt }] });
    return user;
}

export const patchProfileByIdAndOptions = async (_id, {
    nickname, short, long, email, social
}) => {
    
    const user = await userModel.findById(_id);
    user.nickname = nickname === undefined ?  user.nickname : nickname;
    user.short = short === undefined ? user.short : short;
    user.long = long === undefined ? user.long : long;
    user.email = email === undefined ? user.email : email;
    user.social = social === undefined ? user.social : social;
    await user.save();
    
    return user;

}
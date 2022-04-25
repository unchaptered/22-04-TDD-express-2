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

export const deleteProfileByEmailAndPassowrd = async (_id, password) => {
    const userDB =  await userModel.findById(_id).select('email password');
    const isSame = await bcrypt.compare(password, userDB.password);
    const user = await userModel.deleteOne({ _id });

    if (!isSame) return null;
    return user;
}

export const patchProfileByIdAndOptions = async (_id, {
    nickname, short, long, email, social
}) => {
    
    const user = await userModel.findById(_id);
    user.nickname = nickname === undefined ?  user.nickname : nickname;
    user.description.short = short === undefined ? user.description.short : short;
    user.description.long = long === undefined ? user.description.long : long;
    user.meta.email = email === undefined ? user.meta.email : email;
    
    if (social !== undefined) {
        if (user.meta.social.length === 0) {
            user.meta.social.push(social);
        } else {
            const socialSet = new Set(user.meta.social);
            if (!socialSet.has(social)) socialSet.add(social);
            user.meta.social = [ ...socialSet ];
        }
    }
    await user.save();
    
    return user;

}
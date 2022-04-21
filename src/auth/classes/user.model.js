import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    email: { type: String, required: true, unique:true },
    password: { type: String, required: true },

    nickname: { type: String, default: undefined },
    description: {
        short: { type: String, default: undefined },
        long: { type: String, default: undefined }
    },
    meta: {
        email: { type: String, default: undefined },
        social: [{ type: String }]
    }
});
userSchema.pre('save', async function() {
    if(this.isModified(`password`)){
        this.password=await bcrypt.hash(this.password, 5);
    }
});

const userModel = model('User', userSchema);

export default userModel;

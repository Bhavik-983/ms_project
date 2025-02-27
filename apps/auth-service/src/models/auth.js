import {mongoose} from '@myorg/common';

const authSchema = await mongoose.Schema({
    name: { type: String,},
    age: { type: Number, },
    email: { type: String, unique: true },
    password: { type: String},
})

export const AuthModel = mongoose.model('Auth', authSchema);
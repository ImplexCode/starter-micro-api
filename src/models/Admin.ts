import mongoose, { Schema, Document, Model } from 'mongoose';

interface AdminDoc extends Document {
    email: string;
    password: string;
    firstName: string;

}

const AdminSchema = new Schema({
    email: {type: String, required: true},
    password:  {type: String, required: true},
    firstName:  {type: String, required: true},
},{
    toJSON: {
        transform(doc, ret){

            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;

        }
    },
    timestamps: true
});

export const Admin = mongoose.model<AdminDoc>('admin', AdminSchema);
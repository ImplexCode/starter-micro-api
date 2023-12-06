import mongoose, { Schema, Document, Model } from 'mongoose';


export interface FoodDoc extends Document {
  name: string;
  description: string;
}


const CategorySchema = new Schema({
  name: { type: String, required: true},
  description: { type: String},
},{
    toJSON: {
        transform(doc, ret){
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;

        }
    },
    timestamps: true
});


const Category = mongoose.model<FoodDoc>('category', CategorySchema);

export { Category }
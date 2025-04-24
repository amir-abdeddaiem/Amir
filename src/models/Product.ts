import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name:{type:String,require:true},
  description:{type:String,require:true},
  price:{type:Number,require:true},
  image:{type:String,require:true},
  category:{type:String,require:true},
//   stock:{type:Number,require:true},
  quantity:{type:Number,require:true},
//   user:{type:mongoose.Schema.Types.ObjectId,require:true}
})

export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema)
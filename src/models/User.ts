import mongoose from 'mongoose'


const UserSchema = new mongoose.Schema({
  birthDate :{type:Date,require:true},
  email :{type:String,require:true},
  firstName:{type:String, require:true },
  gender:{type:String , require:true},
  lastName:{type:String,require:true},
  location:{type:String,require:true},
  password:{type:String,require:true},
  phone:{type:String,require:true},
  avatar: { type: String },
  bio: { type: String },  
  pets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' }],
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }]

})

export const User = mongoose.models.User || mongoose.model('User', UserSchema)


// birthDate
// businessName
// businessType
// certifications
// description
// email
// firstName
// gender
// lastName
// location
// password
// phone
// services
// website

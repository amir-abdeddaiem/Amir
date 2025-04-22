import mongoose from 'mongoose'
import { tree } from 'next/dist/build/templates/app-page'

const UserSchema = new mongoose.Schema({
  birthDate :{type:Date,require:true},
  email :{type:String,require:true},
  firstName:{type:String, require:true },
  gender:{type:String , require:true},
  lastName:{type:String,require:true},
  location:{type:String,require:true},
  password:{type:String,require:true},
  phone:{type:String,require:true}

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

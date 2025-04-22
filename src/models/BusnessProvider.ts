import mongoose from 'mongoose'

const BusinessProviderSchema = new mongoose.Schema({
  services: { type: String, required: true },
  website: { type: String, required: true },
  businessName: { type: String, required: true },
  businessType: { type: String, required: true },
  certifications: { type: String, required: true },
  description: { type: String, required: true },
  Userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})
export const BusinessProvider = mongoose.models.BusinessProvider || mongoose.model('BusinessProvider', BusinessProviderSchema)

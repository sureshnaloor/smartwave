import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema({
  name: String,
  title: String,
  company: String,
  photo: String,
  workEmail: String,
  personalEmail: String,
  workPhone: String,
  homePhone: String,
  mobile: String,
  website: String,
  workStreet: String,
  workCity: String,
  workState: String,
  workZipcode: String,
  workCountry: String,
  homeStreet: String,
  homeCity: String,
  homeState: String,
  homeZipcode: String,
  homeCountry: String,
  shorturl: { type: String, unique: true, sparse: true },
})

export const Profile = mongoose.models.Profile || mongoose.model('Profile', profileSchema) 
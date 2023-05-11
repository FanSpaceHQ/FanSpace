const EMAIL='email'
const PASSWORD='password'
const FIRST_NAME='firstName'
const LAST_NAME='lastName'
const DISCORD='discord'
const INSTAGRAM='instagram'
const TWITTER='twitter'
const BIO='bio'
// const ZIPCODE='zip'
const LOCATION = "location"
const IMAGE_URL='imageUrl'

const required_fields=[EMAIL, PASSWORD, FIRST_NAME, LAST_NAME, IMAGE_URL]
const update_fields=[DISCORD, INSTAGRAM, TWITTER, BIO, LOCATION]
module.exports={
    required_fields, 
    update_fields
}
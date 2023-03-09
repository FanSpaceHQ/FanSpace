const EMAIL='email'
const PASSWORD='password'
const FIRST_NAME='firstName'
const LAST_NAME='lastName'
const DISCORD='discord'
const INSTAGRAM='instagram'
const TWITTER='twitter'
const BIO='bio'
const ZIPCODE='zip'

const required_fields=[EMAIL, PASSWORD, FIRST_NAME, LAST_NAME]
const update_fields=[DISCORD, INSTAGRAM, TWITTER, BIO, ZIPCODE]
module.exports={
    required_fields, 
    update_fields
}
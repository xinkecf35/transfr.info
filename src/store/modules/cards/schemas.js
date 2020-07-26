import {schema} from 'normalizr';

export const addressSchema = new schema.Entity('address', {}, {
  idAttribute: '_id',
});

export const emailSchema = new schema.Entity('email', {}, {
  idAttribute: '_id',
});

export const telephoneSchema = new schema.Entity('telephone', {}, {
  idAttribute: '_id',
});

export const profile = new schema.Entity('profile', {
  address: [addressSchema],
  email: [emailSchema],
  telephone: [telephoneSchema],
}, {idAttribute: 'profileId'});
export const profiles = [profile];

import {schema} from 'normalizr';
import {cardAttributes, complexAttributes} from '@/global-vars';

export const addressSchema = new schema.Entity('address', {}, {
  idAttribute: '_id',
});

export const emailSchema = new schema.Entity('email', {}, {
  idAttribute: '_id',
});

export const telephoneSchema = new schema.Entity('telephone', {}, {
  idAttribute: '_id',
});

const profileSchemaOptions = {
  idAttribute: 'profileId',
  processStrategy: function(input) {
    const existingKeys = Object.keys(input);
    const missingKeys = cardAttributes.filter((attr) => {
      return existingKeys.indexOf(attr) === -1;
    });
    const emptyData = {};
    missingKeys.forEach((key) => {
      if (complexAttributes.indexOf(key) > -1) {
        emptyData[key] = [];
      }
      emptyData[key] = '';
    });
    const newData = {...input, ...emptyData};
    return newData;
  },
};

export const profileSchema = new schema.Entity('profile', {
  address: [addressSchema],
  email: [emailSchema],
  telephone: [telephoneSchema],
}, profileSchemaOptions);
export const profiles = [profileSchema];

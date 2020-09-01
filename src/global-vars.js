export const baseURL = process.env.NODE_ENV === 'development' ?
  'https://api.transfr.test/v1' :
  'https://api.transfr.info/v1';

export const requiredAttributes = ['description'];
export const optionalAttributes = [
  'telephone',
  'email',
  'organization',
  'address',
  'nickname',
  'note',
  'birthday',
  // 'impp', Future development
];
export const cardAttributes = requiredAttributes.concat(optionalAttributes);
export const complexAttributes = ['address', 'email', 'telephone'];
export const simpleAttributes = cardAttributes.filter((attr) => {
  return complexAttributes.indexOf(attr) === -1;
});

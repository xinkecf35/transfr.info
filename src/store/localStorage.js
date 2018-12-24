const userMutations = [
  'setUserDataFromAPI',
  'setName',
  'setEmail',
  'addCard',
  'removeCard',
];

const localStoragePlugin = (store) => {
  store.subscribe((mutation, state) => {
    const payload = mutation.payload;
    // Checking if mutation type is part of CSRF
    if (mutation.type === 'setToken') {
      sessionStorage.setItem('csrf', JSON.stringify(payload));
    }
    if (userMutations.indexOf(mutation.type) > -1) {
      sessionStorage.setItem('userdata', JSON.stringify(payload));
    }
  });
};

export default localStoragePlugin;

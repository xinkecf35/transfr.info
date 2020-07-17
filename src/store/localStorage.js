const userMutations = [
  'setUserDataFromAPI',
  'setName',
  'setEmail',
  'addCard',
  'removeCard',
];

const localStoragePlugin = (store) => {
  store.subscribe((mutation, state) => {
    // Checking if mutation type is part of CSRF
    if (mutation.type === 'setToken') {
      sessionStorage.setItem('csrf', JSON.stringify(state.csrf));
    }
    if (userMutations.indexOf(mutation.type) > -1) {
      sessionStorage.setItem('userdata', JSON.stringify(state.userdata));
    }
  });
};

export default localStoragePlugin;

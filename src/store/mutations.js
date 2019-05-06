export default {
  SET_VALUE: (state, { storeKey, value }) => {
    state[storeKey] = value;
  },
};

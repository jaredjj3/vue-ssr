export default {
  SET_CREATED_BY: (state, { pageName, createdBy }) => {
    state[pageName] = createdBy;
  },
};

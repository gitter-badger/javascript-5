module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  env: {
    es6: true,
    node: true,
  },
  rules: {
    'consistent-return': 0,
    'func-names': 0,
    'indent': [2, 'tab'],
    'no-restricted-syntax': 0,
    'no-underscore-dangle': 0,
  }
};

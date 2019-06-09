module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'new-cap': 'off', // amCharts constructors are in lowercase
    radix: ['error', 'as-needed'], // Please Oberführer
    indent: ['error', 2, { MemberExpression: 0 }],
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};

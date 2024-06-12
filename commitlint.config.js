export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0, 'always', ['start-case', 'pascal-case', 'upper-case']],
  },
};

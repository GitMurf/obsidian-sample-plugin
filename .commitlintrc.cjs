/**
 * [LEVEL, APPLICABILITY, VALUE]
 * LEVEL: 0 = disable, 1 = warning, 2 = error
 * APPLICABILITY: always, never ... never creates inverse of rule
 */
const Configuration = {
  extends: ['@commitlint/config-conventional'],
  // definitions of rule types: https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type
  rules: {
    // ERRORS
    'type-enum': [
      2,
      'always',
      [
        'abstraction',
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'tests',
        'types',
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-min-length': [2, 'always', 2],

    // WARNINGS
    'header-max-length': [1, 'always', 100],
    'subject-full-stop': [1, 'never', '.'],

    // DISABLED
    'body-max-line-length': [0, 'always', 100],
    'subject-case': [0, 'always', 'lower-case'],
    'header-case': [0, 'always', 'sentence-case'],
    'body-case': [0, 'always', 'sentence-case'],

    // commented out rest of options available
    /*
    'body-full-stop': [0, 'never', '.'],
    'body-leading-blank': [0, 'always'],
    'body-empty': [0, 'never'],
    'body-max-length': [0, 'always', 300],
    'body-min-length': [0, 'always', 0],
    'footer-leading-blank': [0, 'always'],
    'footer-empty': [0, 'never'],
    'footer-max-line-length': [0, 'always', 100],
    'footer-max-length': [0, 'always', 300],
    'footer-min-length': [0, 'always', 0],
    // header equals => type(scope): subject
    'header-full-stop': [0, 'never', '.'],
    'header-min-length': [0, 'always', 0],
    'references-empty': [0, 'never'],
    'scope-empty': [0, 'never'],
    'scope-enum': [0, 'always', []],
    'scope-max-length': [0, 'always', 100],
    'scope-min-length': [0, 'always', 0],
    'subject-max-length': [0, 'always', 100],
    'subject-exclamation-mark': [0, 'never', '!'],
    'type-empty': [0, 'never'],
    'type-max-length': [0, 'always', 100],
    'type-min-length': [0, 'always', 0],
    'signed-off-by': [0, 'never'],
    'trailer-exists': [0, 'never'],
    */
    /*
      [
        'lower-case',     // default
        'upper-case',     // UPPERCASE
        'camel-case',     // camelCase
        'kebab-case',     // kebab-case
        'pascal-case',    // PascalCase
        'sentence-case',  // Sentence case
        'snake-case',     // snake_case
        'start-case',     // Start Case
      ];
    */
  },
  helpUrl: 'https://github.com/angular/angular/blob/22b96b9/CONTRIBUTING.md#type',
  ignores: [
    (commit) => commit.toLowerCase().startsWith('release'),
    (commit) => commit.toLowerCase().startsWith('merge'),
    (commit) => commit.toLowerCase().startsWith('shawn/'),
    (commit) => commit.toLowerCase().startsWith('update'),
  ],
};

module.exports = Configuration;

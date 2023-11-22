module.exports = {
  /** change to 'eslint --fix --max-warnings=0' when ready to prevent/stop commits with warnings (and not just errors)
   * this is required because we are using eslint-plugin-only-warn to downgrade all eslint errors to warnings
   */
  // 'src/**/*.{ts,tsx,js,jsx,json}': ['eslint --fix'],

  /**
   * --fix-dry-run will allow you to see the changes --fix would make, but leave your local files unchanged
   */
  // 'src/**/*.{ts,tsx,js,jsx,json}': ['eslint --fix-dry-run'],

  /**
   * commenting out (for speed) as not auto fixing anyways at this point
   */
  // 'src/**/*.{ts,tsx,js,jsx,json}': ['eslint'],

  '**/*.{ts,tsx,js,jsx,json,html,css,scss,md,yaml,yml}': [
    'prettier --check --ignore-unknown',
  ],

  // instead run tsc on push with pre-push hook
  // 'src/**/*.{ts,tsx}': [() => 'tsc --noEmit'],
};

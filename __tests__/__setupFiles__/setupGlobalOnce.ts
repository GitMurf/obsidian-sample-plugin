// IGNORE FOR NOW

// I am not exactly sure how to properly use globalSetup, but it is not what I initially expected (see notes below)
// URL for Details: https://vitest.dev/config/#globalsetup

// A global setup file can either export named functions setup and teardown or a default function that returns a teardown function
// Beware that the global setup is run in a different global scope, so your tests don't have access to variables defined here.

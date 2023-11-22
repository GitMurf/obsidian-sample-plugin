/* eslint-disable tsdoc/syntax -- use jsdoc instead of tsdoc in this file */
import { readFileSync, writeFileSync } from 'node:fs';

// const targetVersion = process.env.npm_package_version;

// update package.json with 0.1 version increment
const packageVersion = getJsonKey('package.json', 'version');
const manifestVersion = getJsonKey('manifest.json', 'version');
const newPackageVersion =
  packageVersion !== manifestVersion ? packageVersion : (
    versionIncrement(packageVersion, 'patch')
  );
updateJsonKey('package.json', 'version', newPackageVersion);

// read minAppVersion from manifest.json and bump version to target version
const minAppVersion = getJsonKey('manifest.json', 'minAppVersion');
updateJsonKey('manifest.json', 'version', newPackageVersion);

// update versions.json with target version and minAppVersion from manifest.json
updateJsonKey('versions.json', newPackageVersion, minAppVersion);

/**
 * Increment version number based on incrementType
 * @param {string} currentVersion - current version number
 * @param {'major' | 'minor' | 'patch'} incrementType - Increment
 */
function versionIncrement(currentVersion, incrementType = 'patch') {
  const parseCurrentVersion = currentVersion.split('.');
  const major = parseCurrentVersion[0];
  const minor = parseCurrentVersion[1];
  const patch = parseCurrentVersion[2];
  switch (incrementType) {
    case 'major':
      return `${parseInt(major) + 1}.0.0`;
    case 'minor':
      return `${major}.${parseInt(minor) + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${parseInt(patch) + 1}`;
    default:
      return currentVersion;
  }
}

function getJsonKey(file, key) {
  let json = JSON.parse(readFileSync(file, 'utf8'));
  return json[key];
}

function updateJsonKey(file, key, value) {
  let json = JSON.parse(readFileSync(file, 'utf8'));
  json[key] = value;
  writeFileSync(file, JSON.stringify(json, null, '  ') + '\n');
}

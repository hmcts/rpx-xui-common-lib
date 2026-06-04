import { readFileSync, writeFileSync } from 'node:fs';

const rootPackagePath = new URL('../package.json', import.meta.url);
const libraryPackagePath = new URL('../projects/exui-common-lib/package.json', import.meta.url);
const distPackagePath = new URL('../dist/exui-common-lib/package.json', import.meta.url);

const rootPackage = JSON.parse(readFileSync(rootPackagePath, 'utf8'));
const libraryPackage = JSON.parse(readFileSync(libraryPackagePath, 'utf8'));
const distPackage = JSON.parse(readFileSync(distPackagePath, 'utf8'));

const libraryPeerDependencies = libraryPackage.peerDependencies || {};
const distDependencies = distPackage.dependencies || {};
const rootDependencies = rootPackage.dependencies || {};

const sortDependencies = (dependencies) => Object.keys(dependencies)
  .sort()
  .reduce((sortedDependencies, dependencyName) => {
    sortedDependencies[dependencyName] = dependencies[dependencyName];
    return sortedDependencies;
  }, {});

const mergedDependencies = Object.entries(distDependencies)
  .filter(([dependencyName]) => !libraryPeerDependencies[dependencyName])
  .reduce((dependencies, [dependencyName, version]) => {
    dependencies[dependencyName] = version;
    return dependencies;
  }, {});

for (const [dependencyName, version] of Object.entries(rootDependencies)) {
  if (libraryPeerDependencies[dependencyName]) {
    continue;
  }

  if (!mergedDependencies[dependencyName]) {
    mergedDependencies[dependencyName] = version;
  }
}

distPackage.peerDependencies = sortDependencies(libraryPeerDependencies);
distPackage.dependencies = sortDependencies(mergedDependencies);

writeFileSync(distPackagePath, `${JSON.stringify(distPackage, null, 2)}\n`);

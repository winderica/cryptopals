const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions: { paths } } = require('./tsconfig');

module.exports = {
    roots: [
        "<rootDir>/test"
    ],
    transform: {
        "^.+\\.ts?$": "ts-jest"
    },
    testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.ts?$",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    moduleNameMapper: pathsToModuleNameMapper(paths, { prefix: '<rootDir>/' }),
    testEnvironment: "node"
};

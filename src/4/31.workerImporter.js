const path = require('path');
const { compilerOptions: { paths }} = require('../../tsconfig');

require('tsconfig-paths').register({
    baseUrl: './',
    paths
});
require('ts-node').register();
require(path.resolve(__dirname, './31.worker.ts'));

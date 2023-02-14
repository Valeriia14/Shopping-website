// eslint-disable-next-line no-undef
const tsConfig = require('./tsconfig.json');
// eslint-disable-next-line no-undef
const tsConfigPaths = require('tsconfig-paths');
const baseUrl = './'; // Either absolute or relative path. If relative it's resolved to current working directory.
const paths = Object.keys(tsConfig.compilerOptions.paths).reduce((prev, path) => {
    prev[path] = tsConfig.compilerOptions.paths[path].map((path) => "./dist/" + path.replace('./',''));
    return prev;
}, {});
tsConfigPaths.register({
    baseUrl,
    paths: paths || {},
});

"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var rollup_plugin_node_resolve_1 = __importDefault(require("rollup-plugin-node-resolve"));
var rollup_plugin_commonjs_1 = __importDefault(require("rollup-plugin-commonjs"));
var rollup_plugin_sourcemaps_1 = __importDefault(require("rollup-plugin-sourcemaps"));
var rollup_plugin_typescript2_1 = __importDefault(require("rollup-plugin-typescript2"));
var rollup_plugin_replace_1 = __importDefault(require("rollup-plugin-replace"));
var rollup_plugin_json_1 = __importDefault(require("rollup-plugin-json"));
var rollup_plugin_terser_1 = require("rollup-plugin-terser");
var package_json_1 = __importDefault(require("./package.json"));
var libraryName = 'builder-react';
var resolvePlugin = (0, rollup_plugin_node_resolve_1.default)();
var externalDependencies = Object.keys(package_json_1.default.dependencies)
    .concat(Object.keys(package_json_1.default.optionalDependencies || {}))
    .filter(function (item) { return item !== 'tslib'; })
    .concat(Object.keys(package_json_1.default.peerDependencies || {}));
var options = {
    input: "src/".concat(libraryName, ".ts"),
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: ['vm2'],
    watch: {
        include: '../**',
    },
    plugins: [
        (0, rollup_plugin_typescript2_1.default)({
            include: ['*.js+(|x)', '*.ts+(|x)', '**/*.ts+(|x)'],
            tsconfigOverride: {
                compilerOptions: {
                    // No need to type check and gen over and over, we do once at beginning of builder with `tsc`
                    declaration: false,
                    checkJs: false,
                    allowJs: true,
                },
            },
        }),
        (0, rollup_plugin_replace_1.default)({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        // Allow json resolution
        (0, rollup_plugin_json_1.default)(),
        // Compile TypeScript files
        // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
        (0, rollup_plugin_commonjs_1.default)({
            exclude: ['node_modules/vm2/**'],
            namedExports: {
                'node_modules/react/index.js': [
                    'cloneElement',
                    'createContext',
                    'useContext',
                    'Component',
                    'createElement',
                    'forwardRef',
                    'Fragment',
                    'useEffect',
                    'useState',
                ],
                'node_modules/react-dom/index.js': ['render', 'hydrate'],
                'node_modules/react-is/index.js': ['isElement', 'isValidElementType', 'ForwardRef'],
            },
        }),
        // Allow node_modules resolution, so you can use 'external' to control
        // which external modules to include in the bundle
        // https://github.com/rollup/rollup-plugin-node-resolve#usage
        // resolve({}),
        resolvePlugin,
        // Resolve source maps to the original source
        (0, rollup_plugin_sourcemaps_1.default)(),
        (0, rollup_plugin_terser_1.terser)(),
    ],
};
exports.default = [
    __assign(__assign({}, options), { output: {
            file: 'dist/builder-react.browser.js',
            name: 'BuilderReact',
            format: 'umd',
            sourcemap: true,
            amd: {
                id: '@builder.io/react',
            },
        } }),
    __assign(__assign({}, options), { output: [
            { file: package_json_1.default.module, format: 'es', sourcemap: true },
            { file: package_json_1.default.main, format: 'cjs', sourcemap: true },
        ], external: externalDependencies.concat('node-fetch'), plugins: options.plugins
            .filter(function (plugin) { return plugin !== resolvePlugin; })
            .concat([
            (0, rollup_plugin_node_resolve_1.default)({
                only: [/^\.{0,2}\//],
            }),
        ]) }),
    __assign(__assign({}, options), { input: "src/".concat(libraryName, "-lite.ts"), output: [
            {
                file: "dist/".concat(libraryName, "-lite.esm.js"),
                format: 'es',
                sourcemap: true,
            },
            {
                file: "dist/".concat(libraryName, "-lite.cjs.js"),
                format: 'cjs',
                sourcemap: true,
            },
        ], external: externalDependencies, plugins: options.plugins.map(function (plugin) {
            return plugin !== resolvePlugin
                ? plugin
                : (0, rollup_plugin_node_resolve_1.default)({
                    only: [/^\.{0,2}\//],
                });
        }) }),
    __assign(__assign({}, options), { output: {
            file: package_json_1.default.unpkg,
            format: 'iife',
            name: 'BuilderReact',
            sourcemap: true,
        } }),
];
//# sourceMappingURL=rollup.config.js.map
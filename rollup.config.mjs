import prettier from 'rollup-plugin-prettier';
import nodeResolve from '@rollup/plugin-node-resolve';

export default [
  {
    input: './meteor-runtime-browser.js',
    output: {
      file: './dist/meteor-runtime-browser.js',
      format: 'es',
    },
    external: [/node_modules/, 'vue'],
    plugins: [
      nodeResolve({
        browser: true,
      }),
      prettier({
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'avoid',
        htmlWhitespaceSensitivity: 'ignore',
        parser: 'espree',
      }),
    ],
  },
  {
    input: './meteor-runtime-node.js',
    output: {
      file: './dist/meteor-runtime-node.js',
      format: 'es',
    },
    external: [/node_modules/],
    plugins: [
      nodeResolve({
        exportConditions: ['default', 'module', 'import', 'node'],
      }),
      prettier({
        singleQuote: true,
        trailingComma: 'all',
        arrowParens: 'avoid',
        htmlWhitespaceSensitivity: 'ignore',
        parser: 'espree',
      }),
    ],
  },
];

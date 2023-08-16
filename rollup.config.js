import babel from '@rollup/plugin-babel';
// import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs',
  },
  plugins: [
    babel({
      //exclude: 'node_modules/**', // 排除 node_modules 目录下的文件
      babelHelpers: 'bundled',
    }),
    //terser() //压缩
  ],
};
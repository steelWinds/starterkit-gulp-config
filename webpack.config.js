import path from 'path';
import { fileURLToPath } from 'url';
import ESLintPlugin from 'eslint-webpack-plugin';

const dirname = path.dirname(fileURLToPath(import.meta.url));

const PATHS = {
    appPoint: path.resolve(dirname, 'src/assets/js/app.js'),
    appOutput: path.resolve(dirname, 'dist/assets/js/')
};

export default () => {
    return {
        entry: {
            app: PATHS.appPoint
        },

        output: {
            filename: 'app.build.js',
            path: PATHS.appOutput
        },

        resolve: {
            modules: ['node_modules']
        },

        module: {
            rules: [
                {
                    test: /\.js$/i,
                    use: [
                        {
                            loader: 'cache-loader',
                            options: {
                                cacheDirectory: path.resolve(
                                    dirname,
                                    '.cache/js-cache'
                                )
                            }
                        },
                        'babel-loader'
                    ]
                }
            ]
        },

        watchOptions: {
            aggregateTimeout: 100
        },

        plugins: [new ESLintPlugin()]
    };
};

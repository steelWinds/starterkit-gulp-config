import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PATHS = {
	appPoint: path.resolve(__dirname, 'src/assets/js/app.js'),
	appOutput: path.resolve(__dirname, 'dist/assets/js/'),
};

export default (env, args) => {

	return {
		entry: {
			app: PATHS.appPoint,
		},

		output: {
			filename: 'app.build.js',
			path: PATHS.appOutput,
		},

		resolve: {
			modules: ['node_modules'],
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
									__dirname,
									'.cache/js-cache'
								),
							},
						},
						'babel-loader',
					],
				},
			],
		},

		// Options

		watchOptions: {
			aggregateTimeout: 100,
		},
	};
};

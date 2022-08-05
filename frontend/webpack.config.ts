import * as path from "path";
import { Configuration } from "webpack";

const config = {
	entry: "./src/main.tsx",
	mode: "development",
	module: {
		rules: [
			{
				test: /\.(ts|js)x?$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-env",
							"@babel/preset-react",
							"@babel/preset-typescript",
						],
					},
				},
			},
			{
				test: /\.css$/,
				use: [
					"style-loader",
					"css-loader",
				],
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "main.js",
	},
	devServer: {
		static: path.join(__dirname, "dist"),
		compress: true,
		port: 4000,
	},
} as Configuration;

export default config;
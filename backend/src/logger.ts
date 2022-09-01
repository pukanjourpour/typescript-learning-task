import log4js from "log4js";

log4js.configure({
	appenders: {
		file: {
			type: "dateFile",
			alwaysIncludePattern: true,
			pattern: "yyyy-MM-dd",
			daysToKeep: 90,
			filename: "log/app.log",
			keepFileExt: true,
			enableCallStack: true,
			layout: {
				type: "pattern",
				pattern: "[%d{yyy-MM-dd hh-mm-ss}] [%p] %m",
			},
		},
		console: {
			type: "console",
			enableCallStack: true,
			layout: {
				type: "pattern",
				pattern: "[%d{yyy-MM-dd hh-mm-ss}] [%p] %m",
			},
		},
	},
	categories: {
		default: {
			appenders: [
				"file",
				"console",
			],
			level: "debug",
		},
	},
});

const logger = log4js.getLogger("console");

export default logger;
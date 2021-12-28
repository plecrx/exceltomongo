import winston from 'winston';

const levels = {
	error: 0,
	warn: 1,
	info: 2,
	http: 3,
	debug: 4
};

const colors = {
	error: 'red',
	warn: 'yellow',
	info: 'green',
	http: 'magenta',
	debug: 'white'
};

winston.addColors(colors);

const format = winston.format.combine(
	winston.format.timestamp({ format: 'MMM-DD-YYYY HH:mm:ss' }),
	winston.format.align(),
	winston.format.printf(
		(log) => `${log.level}: ${[log.timestamp]}: ${log.message}`
	)
);

const transports = [
	new winston.transports.Console({
		format: winston.format.combine(winston.format.colorize({ all: true }))
	}),
	new winston.transports.File({
		filename: 'logs/error.log',
		level: 'error'
	}),
	new winston.transports.File({ filename: 'logs/all.log' })
];

export const Logger = winston.createLogger({
	levels,
	format,
	transports,
	exitOnError: false
});

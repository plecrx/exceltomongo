import { Logger } from './logger';

export class LoggerStream {
	write(message: string) {
		Logger.info(message.substring(0, message.lastIndexOf('\n')));
	}
}

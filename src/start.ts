import app from './app';
import { Logger } from 'utils/libs/logger/logger';
const port = 3001;

app.listen(port, () => {
	Logger.info(`Server running on port : ${port}!`);
});

import app from './app';
import { Logger } from 'utils/libs/logger/logger';
const port = process.env.PORT || 3001;

app.listen(port, () => {
	Logger.info(`Server running on port : ${port}!`);
});

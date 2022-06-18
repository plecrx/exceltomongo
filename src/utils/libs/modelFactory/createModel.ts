import { Schema } from 'mongoose';

const createModel = (
	connection: {
		model: any;
	},
	schema: { [x: string]: any },
	modelName: string
) => {
	const mongooseSchema = new Schema(schema);
	try {
		return connection.model(modelName, mongooseSchema);
	} catch (_error) {
		//In case of the model already exists in the memory
		//This is added so that this package can be used with loops.
		return connection.model(modelName);
	}
};

export default createModel;

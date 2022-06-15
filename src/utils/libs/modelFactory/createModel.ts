import { Model, Schema, SchemaDefinitionProperty } from 'mongoose';

const createModel = (
	connection: {
		model: (
			modelName: string,
			arg1?: Schema<unknown, Model<unknown>>
		) => unknown;
	},
	modelName: string,
	schema?:
		| { [path: string]: SchemaDefinitionProperty }
		| { [x: string]: SchemaDefinitionProperty<unknown> }
) => {
	const mongooseSchema = new Schema(schema);
	const { model } = connection;
	try {
		return model(modelName, mongooseSchema);
	} catch (_error) {
		//In case of the model already exists in the memory
		//This is added so that this package can be used with loops.
		return model(modelName);
	}
};

export default createModel;

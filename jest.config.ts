/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
	clearMocks: true,
	moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
	roots: ['<rootDir>'],
	testEnvironment: 'node',
	transform: {
		'^.+\\.tsx?$': 'ts-jest'
	},
	moduleNameMapper: {
		'app/(.*)': '<rootDir>src/$1',
		'controllers/(.*)': '<rootDir>/src/controllers/$1',
		'routes/(.*)': '<rootDir>/src/index/$1',
		'utils/(.*)': '<rootDir>/src/utils/$1'
	},
	moduleDirectories: ['node_modules', 'src'],
	modulePathIgnorePatterns: ['<rootDir>/dist/']
};

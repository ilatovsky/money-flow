import glob from 'glob';
import { readFileSync, writeFileSync } from 'fs';
import { parse } from 'graphql';
import { codegen } from '@graphql-codegen/core';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import * as typescriptResolversPlugin from '@graphql-codegen/typescript-resolvers';

const typeDefs = glob.sync('./sdl/**/*.graphql').map(
	path => readFileSync(path, 'utf-8')
);

codegen({
	filename: 'filename.ts',
	documents: [],
	config: {
		namingConvention: {
            enumValues: 'keep',
        },
	},
	plugins: [
		{ typescript: {} },
		{
			typescriptResolvers: {
				noSchemaStitching: true,
				contextType: 'object',
				avoidOptionals: true,
			},
		}
	],
	pluginMap: {
		typescript: typescriptPlugin,
		typescriptResolvers: typescriptResolversPlugin,
	},
	schema: parse(typeDefs.join('\n\n')),	
}).then(typings => {
	writeFileSync('./typings.ts', typings, { flag: 'w' });
})



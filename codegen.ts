import glob from 'glob';
import { readFileSync, writeFileSync } from 'fs';
import { getFieldsWithDirectives, DirectiveUsage } from '@graphql-toolkit/common';
import { unflatten } from 'flat';
import { parse } from 'graphql';
import { codegen } from '@graphql-codegen/core';
import * as typescriptPlugin from '@graphql-codegen/typescript';
import * as typescriptResolversPlugin from '@graphql-codegen/typescript-resolvers';

const typeDefs = glob.sync('./sdl/**/*.graphql').map(
	path => readFileSync(path, 'utf-8')
);

const schema = parse(typeDefs.join('\n\n'));

const fieldsWithModelExcludeDirective: Record<string, Record<string, DirectiveUsage[]>> = unflatten(Object.fromEntries(Object.entries(getFieldsWithDirectives(schema)).filter(
	([fieldName, directiveUsages]) => directiveUsages.some(
		directiveUsage => directiveUsage.name === 'excludeFieldFromModel' 
	)
))) || {};

const fieldsWithReplaceFieldInModelDirective: Record<string, Record<string, DirectiveUsage[]>> = unflatten(Object.fromEntries(Object.entries(getFieldsWithDirectives(schema)).filter(
	([fieldName, directiveUsages]) => directiveUsages.some(
		directiveUsage => directiveUsage.name === 'replaceFieldInModel' 
	)
))) || {};

const models = Object.keys({...fieldsWithModelExcludeDirective, ...fieldsWithReplaceFieldInModelDirective}).reduce(
	(result, type) => {
		const replacements = Object.entries(fieldsWithReplaceFieldInModelDirective[type] || {}).map(
			([fieldName, directiveUsages]) => `${fieldName}: ${
				directiveUsages.find(directiveUsage => directiveUsage.name === 'replaceFieldInModel')?.args['replacement']
			}`
		).join(';\n')
		
		return {
			...result,
			[type]: `export type ${type}Model = Omit<${type}, ${
				Object.keys({ ...fieldsWithModelExcludeDirective[type], ...fieldsWithReplaceFieldInModelDirective[type]}).map(
					fieldName => `'${fieldName}'`
				).join(' | ')
			}>${replacements.length ? ` & { ${replacements} }`: ''}`
		}
	}, {})


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
				mappers: Object.keys(models).reduce((result, type) => ({...result, [type]: `${type}Model`}), {})
			},
		}
	],
	pluginMap: {
		typescript: typescriptPlugin,
		typescriptResolvers: typescriptResolversPlugin,
	},
	schema
}).then(typings => {
	writeFileSync('./typings.ts', [typings, Object.values(models).join(';\n')].join('\n\n'), { flag: 'w' });
})



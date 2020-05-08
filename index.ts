import { ApolloServer } from 'apollo-server';
import glob from 'glob';
import { DateTimeResolver } from 'graphql-scalars';
import { readFileSync } from 'fs';
import { 
	allAccountQueryResolver, 
	allCategoryQueryResolver, 
	allTransactionQueryResolver, 
	accountTransactionResolver, 
	categoryTransactionResolver, 
	amountAccountResolver,
	transactionsAccountResolver
} from './resolvers';

const typeDefs = glob.sync('./sdl/**/*.graphql').map(path => readFileSync(path, 'utf-8'));

const resolvers = {
	Query: {
		account: () => ({}),
		category: () => ({}),
		transaction: () => ({}),
	},
	AccountQuery: {
		all: allAccountQueryResolver
	},
	CategoryQuery: {
		all: allCategoryQueryResolver
	},
	TransactionQuery: {
		all: allTransactionQueryResolver
	},
	Transaction: {
		account: accountTransactionResolver,
		category: categoryTransactionResolver
	},
	Account: {
		amount: amountAccountResolver,
		transactions: transactionsAccountResolver,
	},
	DateTime: DateTimeResolver
}

const server = new ApolloServer({
	typeDefs,
	resolvers
});

server.listen({ port: 8800 }).then(
	({ port }) => { console.log(`Running on ${port}`); }
);
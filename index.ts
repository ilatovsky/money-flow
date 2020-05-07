import { ApolloServer, gql } from 'apollo-server';
import glob from 'glob';
import { DateTimeResolver } from 'graphql-scalars';
import { readFileSync } from 'fs';
import { accounts, categories, transactions } from './data';
import { AccountResolvers, TransactionResolvers } from './typings';

const typeDefs = glob.sync('./sdl/**/*.graphql').map(path => readFileSync(path, 'utf-8'));

const amountAccountResolver: AccountResolvers['amount'] = (parent) => transactions
	.filter(transaction => transaction.account === parent.id)
	.reduce(
		(result, transaction) => (
			result + transaction.amount * (transaction.direction === 'OUTCOMING' ? -1 : 1)
		), 0
	)

const accountTransactionResolver: TransactionResolvers['account'] = (parent) => {
	const account = accounts.find(
		account => account.id === (parent as typeof parent & { account: string }).account
	);
	
	if (!account) {
		throw new Error(`Can't resolve account with id ${parent.account}`)
	}

	return account;
}

const resolvers = {
	Query: {
		account: () => ({}),
		category: () => ({}),
		transaction: () => ({}),
	},
	AccountQuery: {
		all: () => accounts
	},
	CategoryQuery: {
		all: () => categories
	},
	TransactionQuery: {
		all: () => transactions
	},
	Transaction: {
		account: accountTransactionResolver,
		category: (parent: any) => categories.find(category => category.id === parent.category)
	},
	Account: {
		amount: amountAccountResolver
	},
	DateTime: DateTimeResolver
}

const server = new ApolloServer({
	typeDefs,
	resolvers
});

server.listen({ port: 8800 }).then(({ port }) => { console.log(`Running on ${port}`); });
import { AccountResolvers, TransactionResolvers, AccountQueryResolvers, CategoryQueryResolvers, TransactionQueryResolvers } from './typings';
import { transactions, accounts, categories } from './data';

export const amountAccountResolver: AccountResolvers['amount'] = (parent) => transactions
	.filter(transaction => transaction.account === parent.id)
	.reduce(
		(result, transaction) => (
			result + transaction.amount * (transaction.direction === 'OUTCOMING' ? -1 : 1)
		), 0
)

export const accountTransactionResolver: TransactionResolvers['account'] = (parent) => {
	const account = accounts.find(
		account => account.id === (parent as typeof parent & { account: string }).account
	);

	if (!account) {
		throw new Error(`Can't resolve account with id ${parent.account}`)
	}

	return account;
}

export const categoryTransactionResolver: TransactionResolvers['category'] = (parent) => {
	const category = categories.find(category => category.id === parent.category);

	if (!category) {
		throw new Error(`Can't resolve category with id ${parent.category}`)
	}

	return category;
}

export const transactionsAccountResolver: AccountResolvers['transactions'] = (parent) => transactions.filter(
	transaction => transaction.account === parent.id
)

export const allAccountQueryResolver: AccountQueryResolvers['all'] = () => accounts;
export const allCategoryQueryResolver: CategoryQueryResolvers['all'] = () => categories;
export const allTransactionQueryResolver: TransactionQueryResolvers['all'] = () => transactions;
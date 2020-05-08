import { Transaction_Direction, AccountModel, CategoryModel, TransactionModel } from './typings'

export const accounts: AccountModel[] = [
	{
		id: 'm0001',
		name: 'Основной'
	},
	{
		id: 'q0002',
		name: 'На случай карантина'
	},
	{
		id: 'b0003',
		name: 'Заначка на черный день'
	}
]

export const categories: CategoryModel[] = [
	{
		id: 'ot0001',
		name: 'Запланированные расходы'
	},
	{
		id: 'os0002',
		name: 'Незапланированные расходы'
	},
	{
		id: 'is0003',
		name: 'Зарплата'
	},
	{
		id: 'ij0004',
		name: 'В куртке нашел'
	},
]

export const transactions: TransactionModel[] = [
	{
		id: '0001',
		account: 'm0001',
		direction: Transaction_Direction.INCOMING,
		timestamp: 'Thu, 07 May 2020 14:36:13 GMT',
		category: 'is0003',
		amount: 100000.33
	},
	{
		id: '0002',
		account: 'm0001',
		direction: Transaction_Direction.OUTCOMING,
		timestamp: 'Thu, 07 May 2020 14:49:26 GMT',
		category: 'ot0001',
		amount: 5600
	}
]
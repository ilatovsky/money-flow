import { ApolloServer, gql } from 'apollo-server';

const server = new ApolloServer({
	typeDefs: gql`
		type Query {
			hello: String
		}
	`,
	resolvers: {
		Query: {
			hello: () => 'world'
		}
	}
});

server.listen({ port: 8800 }).then(({ port }) => { console.log(`Running on ${port}`); });
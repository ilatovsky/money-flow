import { ApolloServer, gql } from 'apollo-server';
import glob from 'glob';
import { readFileSync } from 'fs';

const sdls = glob.sync('./sdl/**/*.graphql');


const server = new ApolloServer({
	typeDefs: sdls.map(path => readFileSync(path, 'utf-8'))
});

server.listen({ port: 8800 }).then(({ port }) => { console.log(`Running on ${port}`); });
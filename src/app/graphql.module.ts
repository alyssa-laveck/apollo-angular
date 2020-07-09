import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { RestLink } from 'apollo-link-rest';
import { HttpLink } from 'apollo-angular-link-http';
import { ApolloLink } from 'apollo-link';

const restLink = new RestLink({ uri: 'https://swapi.dev/api/' });

export function createApollo(httpLink: HttpLink) {
  const graphQlLink = httpLink.create({ uri: 'http://localhost:4000' });

  return {
    link: ApolloLink.from([restLink, graphQlLink]),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    },
  ],
})
export class GraphQLModule {}

import { ApolloClient, InMemoryCache, ApolloProvider ,gql} from '@apollo/client';
import { createRoot } from 'react-dom/client';
// import App from './App';
// import App from './UpdateUser';
import App from './DeleteUser';
 
const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

client.query({
    query: gql`
    query {
        users {
          id
          name
          email
        }
      }
    `,
  })
  .then((result) => console.log(result));

const root = createRoot(document.getElementById('root'));

root.render(
    <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

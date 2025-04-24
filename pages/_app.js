// pages/_app.js
import '../styles/globals.css';
import { ApolloWrapper } from '../lib/apollo-client';

function MyApp({ Component, pageProps }) {
  return (
    <ApolloWrapper>
      <Component {...pageProps} />
    </ApolloWrapper>
  );
}

export default MyApp;
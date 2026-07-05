import { Layout } from './layout/Layout';
import { GlobalProviders } from './providers/GlobalProviders';
import { Router } from './Router/Router';

function App() {
  return (
    <GlobalProviders>
      <Layout>
        <Router />
      </Layout>
    </GlobalProviders>
  );
}

export default App;

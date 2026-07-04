import { Layout } from './layout/Layout';
import { GlobalProviders } from './providers/GlobalProviders';
import { Routes } from './Router/Routes';

function App() {
  return (
    <GlobalProviders>
      <Layout>
        <Routes />
      </Layout>
    </GlobalProviders>
  );
}

export default App;

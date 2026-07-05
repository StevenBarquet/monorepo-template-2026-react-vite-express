import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

// styles
import 'src/styles/_index.scss';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

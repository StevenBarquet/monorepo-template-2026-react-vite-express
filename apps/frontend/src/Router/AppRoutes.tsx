import { Route, Routes } from 'react-router-dom';
import HomePage from 'src/pages/Home/Home';
import Page404 from 'src/pages/Page404/Page404';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='*' element={<Page404 />} />
    </Routes>
  );
}

import { RouterProvider } from 'react-router-dom';
import { router } from '@/core/router/routes';
import { AppProviders } from '@/core/providers';

export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}

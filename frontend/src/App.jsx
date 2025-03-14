import AppRoutes from './routes';
import { AuthProvider } from './hooks/useAuth'; 
import NotificationContainer from './components/system/NotificationContainer';

const App = () => {
  return (
    <AuthProvider>
      <NotificationContainer>
        <AppRoutes />
      </NotificationContainer>
    </AuthProvider>
  );
};

export default App;
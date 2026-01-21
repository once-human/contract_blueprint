import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BlueprintList from './pages/BlueprintList';
import BlueprintBuilder from './pages/BlueprintBuilder';
import CreateContract from './pages/CreateContract';
import ContractView from './pages/ContractView';
import { ToastProvider } from './components/Toast';

const App: React.FC = () => {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="blueprints" element={<BlueprintList />} />
            <Route path="blueprints/new" element={<BlueprintBuilder />} />
            <Route path="blueprints/:id/edit" element={<BlueprintBuilder />} />
            <Route path="contracts/new" element={<CreateContract />} />
            <Route path="contracts/:id" element={<ContractView />} />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
};

export default App;

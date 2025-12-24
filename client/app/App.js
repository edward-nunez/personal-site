import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.scss';

// Views are provided via the router in index.js

import Header from './components/elements/Header';
import Footer from './components/elements/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <div className="container">
          <Outlet />
        </div>
      </main>
      <ToastContainer />
      <Footer />
    </div>
  );
}

export default App;

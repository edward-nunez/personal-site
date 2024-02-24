import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.scss';

// Views
import Home from './views/Home';
import NoMatch from './views/NoMatch';
import Portfolio from './views/Portfolio';
import Project from './views/Project';
import BlogPost from './views/BlogPost';
import About from './views/About';
import Contact from './views/Contact';

import Header from './components/elements/Header';
import Footer from './components/elements/Footer';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <div className="container">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route path="/portfolio/:id" element={<Project />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NoMatch />} />
          </Routes>
        </div>
      </main>
      <ToastContainer />
      <Footer />
    </div>
  );
}

export default App;

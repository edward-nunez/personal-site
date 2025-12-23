import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

// Old Test
// TODO: Add old test stuff to new
// import React from 'react';
// import ReactDOM from 'react-dom';
// import { Router } from 'react-router-dom';
// import { createMemoryHistory } from 'history';
// import App from './App';

// const history = createMemoryHistory();

// it('renders without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(
//     <Router history={history}>
//       <App />
//     </Router>,
//     div
//   );
//   ReactDOM.unmountComponentAtNode(div);
// });

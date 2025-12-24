import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders app container', () => {
  const { container } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  expect(container.querySelector('.App')).toBeInTheDocument();
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

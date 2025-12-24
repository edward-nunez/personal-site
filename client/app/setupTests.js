// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Suppress noisy React Router "Future Flag" warnings during tests.
// These are non-actionable in tests and cause spurious console output.
const _originalConsoleWarn = console.warn;
console.warn = (...args) => {
  const first = args[0];
  if (typeof first === 'string') {
    if (
      first.includes('React Router Future Flag Warning') ||
      first.includes('Relative route resolution within Splat routes is changing') ||
      first.includes('v7_startTransition') ||
      first.includes('v7_relativeSplatPath')
    ) {
      return;
    }
  }
  _originalConsoleWarn.apply(console, args);
};

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const {container} =  render(<App />);
  const linkElement = container.querySelector('.App-link')
  // const linkElement = screen.getByText(/learn react/i);
  expect(linkElement?.textContent).toMatch(/learn react/i)
});

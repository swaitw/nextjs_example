import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';  // Adjust path if needed
import '@testing-library/jest-dom';


describe('HomePage Component', () => {
  test('renders the Open a bank account link', () => {
    render(<HomePage />);
    const linkElement = screen.getByText('Open a bank account');
    expect(linkElement).toBeInTheDocument();
  });

  test('RouterLink has the correct href', () => {
    render(<HomePage />);

    const linkElement = screen.getByRole('link', { name: /open a bank account/i });
    expect(linkElement).toHaveAttribute('href', '/account/create-account');
  });
});
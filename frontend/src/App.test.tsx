import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

describe('App Component', () => {
  it('should render the application without crashing', () => {
    render(<App />);
    expect(document.body).toBeTruthy();
  });

  it('should render the Navbar component', () => {
    render(<App />);
    const navbar = document.querySelector('nav');
    expect(navbar).toBeTruthy();
  });
});

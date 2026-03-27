import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import App from './App.jsx';
import { vi } from 'vitest';

// Глобальний mock для fetch
const mockFetch = vi.fn();
Object.defineProperty(window, 'fetch', {
  value: mockFetch,
  writable: true
});

// Wrapper для React Router
const AppWrapper = ({ children }) => (
    <MemoryRouter>
      {children}
    </MemoryRouter>
);

describe('GreenMonitor Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  test('1. Заголовок відображається', () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => [] });
    render(<App />, { wrapper: AppWrapper });
    expect(screen.getByRole('heading', { name: /GreenMonitor/i })).toBeInTheDocument();
  });

  test('2. Loading спінер', async () => {
    mockFetch.mockResolvedValue({ ok: true, json: () => [] });
    render(<App />, { wrapper: AppWrapper });
    expect(screen.getByText(/завантаження/i)).toBeInTheDocument();
  });

  test('3. Завантажує та відображає список зон', async () => {
    const zones = [{ _id: '1', name: 'Теплиця №1' }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(zones)
    });

    render(<App />, { wrapper: AppWrapper });
    await waitFor(() => {
      expect(screen.getByText('Теплиця №1')).toBeInTheDocument();
    });
  });

  test('4. Обробляє порожній список зон', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([])
    });

    render(<App />, { wrapper: AppWrapper });
    await waitFor(() => {
      expect(screen.queryByTestId('zone-card')).not.toBeInTheDocument();
    });
  });

  test('5. Обробляє мережеву помилку', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    render(<App />, { wrapper: AppWrapper });
    await waitFor(() => {
      expect(screen.getByText(/помилка/i)).toBeInTheDocument();
    });
  });

  test('6. Зона відображається', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => [{ _id: '1', name: 'Теплиця 1', optimalParams: {} }]
    });
    render(<App />, { wrapper: AppWrapper });
    await waitFor(() => {
      expect(screen.getByText('Теплиця 1')).toBeInTheDocument();
    });
  });

  // test('7. ЗЛАМАНИЙ ТЕСТ (Крок 5)', async () => {
  //   // Mock дані
  //   const zones = [{ _id: '1', name: 'Теплиця №1' }];
  //   mockFetch.mockResolvedValueOnce({
  //     ok: true,
  //     json: () => Promise.resolve(zones)
  //   });

    render(<App />, { wrapper: AppWrapper });

/*    // НАМИСНИЙ БАГ: шукаємо НЕІСНУЮЧИЙ текст!
    await waitFor(() => {
      expect(screen.getByText('НЕІСНУЮЧА ТЕПЛИЦЯ')).toBeInTheDocument();
    }, { timeout: 3000 });
  });*/
});
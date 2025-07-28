import { render, fireEvent, screen } from '@testing-library/react';
import { WindowProvider, useWindows } from '../../context/WindowContext';
import React from 'react';

type AppDefinition = {
  id: string;
  title: string;
  icon: React.FC;
  component: React.FC;
  defaultSize: { width: number; height: number };
};

const testApp: AppDefinition = {
  id: 'test',
  title: 'Test',
  icon: () => null,
  component: () => <div>App</div>,
  defaultSize: { width: 100, height: 100 },
};

const TestComponent: React.FC = () => {
  const { windows, openWindow, closeWindow } = useWindows();
  return (
    <div>
      <span data-testid="count">{windows.length}</span>
      <button onClick={() => openWindow(testApp)}>open</button>
      <button onClick={() => closeWindow('win-1')}>close</button>
    </div>
  );
};

describe('WindowContext', () => {
  it('opens and closes windows', () => {
    render(
      <WindowProvider>
        <TestComponent />
      </WindowProvider>
    );

    const count = screen.getByTestId('count');
    expect(count.textContent).toBe('0');

    fireEvent.click(screen.getByText('open'));
    expect(count.textContent).toBe('1');

    fireEvent.click(screen.getByText('close'));
    expect(count.textContent).toBe('0');
  });
});

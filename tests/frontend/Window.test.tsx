import { render, fireEvent } from '@testing-library/react';
import Window from '../../components/Window';
import React from 'react';

// simple component for children
const Child: React.FC = () => <div>child</div>;

describe('Window component', () => {
  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    const { getAllByRole } = render(
      <Window
        id="1"
        title="Test"
        initialPosition={{ x: 0, y: 0 }}
        initialSize={{ width: 100, height: 100 }}
        zIndex={1}
        isMaximized={false}
        onClose={onClose}
        onMinimize={() => {}}
        onMaximize={() => {}}
        onFocus={() => {}}
        onPositionChange={() => {}}
      >
        <Child />
      </Window>
    );

    const buttons = getAllByRole('button');
    fireEvent.click(buttons[2]); // close button
    expect(onClose).toHaveBeenCalled();
  });
});

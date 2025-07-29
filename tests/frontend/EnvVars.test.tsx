import { render } from '@testing-library/react';
import React from 'react';
import { describe, it, expect } from 'vitest';

const EnvComponent: React.FC = () => (
  <div>
    <span data-testid="max">{process.env.AGENT_MAX_CONCURRENT}</span>
    <span data-testid="timeout">{process.env.AGENT_TIMEOUT_MS}</span>
    <span data-testid="retries">{process.env.AGENT_RETRY_ATTEMPTS}</span>
    <span data-testid="url">{process.env.AGENT_ZERO_API_URL}</span>
    <span data-testid="debug">{process.env.AGENT_DEBUG}</span>
  </div>
);

describe('agent env variables', () => {
  it('are available via process.env in React components', () => {
    process.env.AGENT_MAX_CONCURRENT = '5';
    process.env.AGENT_TIMEOUT_MS = '1000';
    process.env.AGENT_RETRY_ATTEMPTS = '3';
    process.env.AGENT_ZERO_API_URL = 'http://localhost';
    process.env.AGENT_DEBUG = 'true';

    const { getByTestId } = render(<EnvComponent />);

    expect(getByTestId('max').textContent).toBe('5');
    expect(getByTestId('timeout').textContent).toBe('1000');
    expect(getByTestId('retries').textContent).toBe('3');
    expect(getByTestId('url').textContent).toBe('http://localhost');
    expect(getByTestId('debug').textContent).toBe('true');
  });
});

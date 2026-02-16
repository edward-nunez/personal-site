import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/hooks/useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 500));
    expect(result.current).toBe('hello');
  });

  it('debounces value updates', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'hello', delay: 500 },
    });

    // Update value
    rerender({ value: 'world', delay: 500 });

    // Before delay: still old value
    expect(result.current).toBe('hello');

    // After delay: updated
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe('world');
  });

  it('resets timer on rapid updates', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'a', delay: 300 },
    });

    // Rapid updates
    rerender({ value: 'ab', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'abc', delay: 300 });
    act(() => {
      vi.advanceTimersByTime(100);
    });

    rerender({ value: 'abcd', delay: 300 });

    // Still the initial value (timer keeps resetting)
    expect(result.current).toBe('a');

    // After final delay
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current).toBe('abcd');
  });
});

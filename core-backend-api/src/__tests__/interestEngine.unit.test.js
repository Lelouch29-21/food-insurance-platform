import { calculateAdjustment } from '../services/interestEngine.js';

describe('interest engine rule calculation', () => {
  test('applies positive rules and cap', () => {
    const result = calculateAdjustment({
      totalAmount: 5000,
      healthyPercentage: 90,
      recentOrderCount: 12,
    });

    expect(result.adjustment).toBe(1.15);
    expect(result.reason).toContain('Order amount > 1000');
  });

  test('applies unhealthy penalty', () => {
    const result = calculateAdjustment({
      totalAmount: 100,
      healthyPercentage: 20,
      recentOrderCount: 0,
    });

    expect(result.adjustment).toBe(-0.3);
  });

  test('caps negative value', () => {
    const result = calculateAdjustment({
      totalAmount: 100,
      healthyPercentage: 0,
      recentOrderCount: 0,
    });

    expect(result.adjustment).toBe(-0.3);
  });
});

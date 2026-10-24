const PercentageThresholdDiscountStrategy = require('../../src/domain/strategies/PercentageThresholdDiscountStrategy');
const NoDiscountStrategy = require('../../src/domain/strategies/NoDiscountStrategy');

describe('PercentageThresholdDiscountStrategy', () => {
  it('não aplica desconto abaixo do limite', () => {
    const strategy = new PercentageThresholdDiscountStrategy(50, 0.1);
    expect(strategy.calcular(49.99)).toBe(0);
  });

  it('aplica desconto percentual quando atinge o limite', () => {
    const strategy = new PercentageThresholdDiscountStrategy(50, 0.1);
    expect(strategy.calcular(100)).toBe(10);
  });

  it('aplica desconto exatamente no limite', () => {
    const strategy = new PercentageThresholdDiscountStrategy(50, 0.1);
    expect(strategy.calcular(50)).toBe(5);
  });
});

describe('NoDiscountStrategy', () => {
  it('nunca aplica desconto', () => {
    const strategy = new NoDiscountStrategy();
    expect(strategy.calcular(1000)).toBe(0);
  });
});
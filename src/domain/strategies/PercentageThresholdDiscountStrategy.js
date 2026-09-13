const discountStrategy = require('./DiscountStrategy');

class PercentageThresholdDiscountStrategy extends discountStrategy {
    constructor(threshold = 50, percentage = 0.1) {
        super();
        this.threshold = threshold;
        this.percentage = percentage;
    }

    calcular (valorTotal) {
        if (valorTotal >= this.threshold) {
            return Number ((valorTotal * this.percentage).toFixed(2));
        }
        return 0;
    }
}

module.exports = PercentageThresholdDiscountStrategy;
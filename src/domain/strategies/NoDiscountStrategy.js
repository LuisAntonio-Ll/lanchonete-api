const DiscountStrategy = require('./DiscountStrategy');

class NOdiscountStrategy extends DiscountStrategy {
    calcular (_valorTotal){
        return 0;
    }
}

module.exports = NOdiscountStrategy;
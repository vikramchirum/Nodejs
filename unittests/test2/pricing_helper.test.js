const expect = require('chai').expect;
const pricing_helper = require('../../lib/helpers/pricing.helper');

const plans = require('./product_test_cases.json');

describe('Pricing Helper Tests', function () {
    describe('get_calcs_for_usage Tests', function () {
        plans.forEach(function (plan) {
            context('Plan: ' + plan.Name, function () {
                it('should return ' + plan.Price_500 + ' at 500 kWh', function () {
                    let price_500 = pricing_helper.get_calcs_for_usage(plan, 500);
                    let price_per_kWh = Math.round(price_500.per_kWh * 1000) / 1000;
                    console.log(JSON.stringify(plan.Charges));
                    console.log(price_500);
                    expect(price_per_kWh).to.equal(plan.Price_500);
                });
                it('should return ' + plan.Price_1000 + ' at 1000 kWh', function () {
                    let price_1000 = pricing_helper.get_calcs_for_usage(plan, 1000);
                    let price_per_kWh = Math.round(price_1000.per_kWh * 1000) / 1000;
                    console.log(JSON.stringify(plan));
                    console.log(price_1000);
                    expect(price_per_kWh).to.equal(plan.Price_1000);
                });
                it('should return ' + plan.Price_2000 + ' at 2000 kWh', function () {
                    let price_2000 = pricing_helper.get_calcs_for_usage(plan, 2000);
                    let price_per_kWh = Math.round(price_2000.per_kWh * 1000) / 1000;
                    console.log(JSON.stringify(plan));
                    console.log(price_2000);
                    expect(price_per_kWh).to.equal(plan.Price_2000);
                });
            });
        });
    });

    describe('format_charges Tests', function () {
        plans.forEach(function (plan) {
            context('Plan: ' + plan.Name, function () {
                plan.Charges = pricing_helper.format_charges(plan.Charges);
                plan.Charges.forEach(function (charge) {
                    context('Charge: ' + charge.Name, function () {
                        charge.Cost_Components.forEach(function (cost_component) {
                            context('Cost Component English', function () {
                                it('should return: ' + cost_component.Expected.English, function () {
                                    console.log(cost_component.Display.English);
                                    console.log(cost_component.Expected.English);
                                    expect(cost_component.Display.English).to.deep.equal(cost_component.Expected.English);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
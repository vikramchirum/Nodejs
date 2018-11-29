const expect = require('chai').expect;
const tests = require('./promo_code_test_cases.json');
const evaluate_rules = require('../../lib/helpers/rules.helper');

describe('Promotion code logic Tests', function () {
    tests.forEach(function (test) {
        context('Test Case: ' + JSON.stringify(test.fact), function () {
            it('should return ' + test.response || 'Nothing', async function () {
                try {
                    let event = await evaluate_rules('Promo_Code', {request: test.fact}, true);
                    console.log(event);

                    if (test.response && test.response.length) {
                        expect(event.length).to.not.equal(null);
                        expect(event.params).to.have.property('promo_code');
                        expect(event.params.promo_code).to.equal(test.response);
                    }
                    else {
                        expect(event).to.equal(null);
                    }
                }
                catch (err) {
                    if (test.response && test.response.length) {
                        expect(err).to.equal(null);
                    }
                    else {
                        expect(err).to.equal('No matching rule');
                    }
                }
            });
        });
    });
});
const expect = require('chai').expect;
const credit_helper = require('../../lib/helpers/credit.helper');
const test_cases = require('./credit_test_cases');
const _ = require('lodash');

describe('Credit Tests', function () {
    test_cases.forEach(function (test) {
        context(JSON.stringify(test.info), function () {
            let response = {};
            response.Segments = credit_helper.get_segments(test.data);
            credit_helper.process_segments(response);
            const decision = credit_helper.process_decision(response);
            it('should be an object', function () {
                expect(decision).to.be.a('object');
            });
            it('should have a property of "Status"', function () {
                expect(decision).to.have.property('Status');
            });
            it('should have a Status of ' + test.Decision.Status, function () {
                expect(decision.Status).to.equal(test.Decision.Status);
            });
            if (test.Decision.Is_Fraud_Alert) {
                it('should have Is_Fraud_Alert flag', function () {
                    expect(decision.Is_Fraud_Alert).to.equal(test.Decision.Is_Fraud_Alert);
                })
            }
            if (test.Decision.Is_Credit_Review) {
                it('should have Is_Credit_Review flag', function () {
                    expect(decision.Is_Credit_Review).to.equal(test.Decision.Is_Credit_Review);
                })
            }
        });
    });
});
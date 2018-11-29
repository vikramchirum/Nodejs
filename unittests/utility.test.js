const expect = require('chai').expect;
const utility_helper = require('../lib/helpers/utility.helper');

describe('Utility Helper Tests', function () {
    describe('move_date_days Tests', function () {
        describe('move_date_days(24, new Date())', function () {
            it('should return a date 24 days from now', function () {
                let today = new Date();
                let new_date = utility_helper.move_date_days(24, today);
                console.log(new_date);
                expect(new_date - today).to.equal(24 * 60 * 60 * 24 * 1000);
            });
        });
        describe('move_date_days(24, non_date)', function () {
            it('should return 24 days from now', function () {
                let today = new Date();
                let new_date = utility_helper.move_date_days(24, {});
                console.log(new_date);
                expect(new_date - today).to.equal(24 * 60 * 60 * 24 * 1000);
            });
        });
    });
    describe('move_date_hours Tests', function () {
        describe('move_date_hours(36, new Date())', function () {
            it('should return a date 36 hours from now', function () {
                let today = new Date();
                let new_date = utility_helper.move_date_hours(36, today);
                console.log(new_date);
                expect(new_date - today).to.equal(36 * 60 * 60 * 1000);
            });
        });
        describe('move_date_hours(36, non_date)', function () {
            it('should return 36 hours from now', function () {
                let today = new Date();
                let new_date = utility_helper.move_date_hours(36, {});
                console.log(new_date);
                expect(new_date - today).to.equal(36 * 60 * 60 * 1000);
            });
        });
    });
    describe('format_note Tests', function () {
        describe('format_note("Special Note")', function () {
            it('should return "{Note: "Special Note", Entered_By: "Service API", Date_Entered: Today\'s Date}', function () {
                let today = new Date();
                let result = utility_helper.format_note('Special Note');
                const expected = {Note: 'Special Note', Entered_By: 'Service API', Date_Entered: today};
                expect(result).to.have.property('Entered_By');
                expect(result.Entered_By).to.be.equal('Service API');
                expect(result).to.have.property('Date_Entered');
                expect(result.Date_Entered).to.be.a('Date');
            });
        });
    });
    describe('calculate_age Tests', function () {
        [10, 20, 30, 40, 50, 60].forEach(function (age) {
            it('should return ' + age, function () {
                let today = new Date();
                let dob = today.setFullYear(today.getFullYear() - age);

                let result = utility_helper.calculate_age(dob);
                expect(result).to.be.a('number');
                expect(result).to.equal(age);
            });
        });
    });
    describe('date_to_MMddyyyy Tests', function () {
        ['1979-05-26', '1986-12-25', '1992-01-01', '1998-12-31'].forEach(function (date_string) {
            context('Input: ' + date_string, function () {
                let expected = date_string.substring(5, 7) + date_string.substring(8, 10) + date_string.substring(0, 4);
                it('should return ' + expected, function () {
                    let today = new Date(date_string);
                    let result = utility_helper.date_to_MMddyyyy(today);
                    expect(result).to.be.a('string');
                    expect(result).to.equal(expected);
                });
            })
        })
    });
});
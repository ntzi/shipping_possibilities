import { expect } from 'chai'
import Delivery from '../src/delivery'


describe("Delivery", () => {
    // Test the class Delivery for different input answers.

    describe("shipping possiblities", () => {
        context('national delivery, country holidays, supplier holiday, 1 supplier, 1 carrier', () => {
            it("should return result/pack_1/test_1.json", () => {
                let carriers = require('./data/pack_1/carriers.json')
                let countries = require('./data/pack_1/countries.json')
                let suppliers = require('./data/pack_1/suppliers.json')

                let input = {
                    "start_date": "2021-05-07",
                    "end_date": "2021-05-11",
                    "sender_country": "fr",
                    "receiver_country": "fr"
                }

                let shipping = new Delivery(input, carriers, countries, suppliers);
                let shipping_possibilities = shipping.possibilities();

                let result = require( './result/pack_1/test_1.json' )

                expect(shipping_possibilities).to.eql(result);
            });
        });
        context('national delivery, consecutive country/supplier holiday, multiple suppliers, multiple carriers,' +
                'multiple carriers for country only one for supplier', () => {
            it("should return result/pack_1/test_2.json", () => {
                let carriers = require('./data/pack_1/carriers.json')
                let countries = require('./data/pack_1/countries.json')
                let suppliers = require('./data/pack_1/suppliers.json')

                let input = {
                    "start_date": "2021-05-04",
                    "end_date": "2021-05-09",
                    "sender_country": "nl",
                    "receiver_country": "nl"
                }

                let shipping = new Delivery(input, carriers, countries, suppliers);
                let shipping_possibilities = shipping.possibilities();

                let result = require( './result/pack_1/test_2.json' )

                expect(shipping_possibilities).to.eql(result);
            });
        });
        context('sender country with no supplier', () => {
            it("should return result/pack_1/test_3.json", () => {
                let carriers = require('./data/pack_1/carriers.json')
                let countries = require('./data/pack_1/countries.json')
                let suppliers = require('./data/pack_1/suppliers.json')

                let input = {
                    "start_date": "2021-05-04",
                    "end_date": "2021-05-06",
                    "sender_country": "be",
                    "receiver_country": "nl"
                }

                let shipping = new Delivery(input, carriers, countries, suppliers);
                let shipping_possibilities = shipping.possibilities();

                let result = require( './result/pack_1/test_3.json' )

                expect(shipping_possibilities).to.eql(result);
            });
        });
        context('international delivery, sender/receiver country holidays, supplier holiday, 1 supplier,' +
                ' 1 carrier', () => {
            it("should return result/pack_1/test_4.json", () => {
                let carriers = require('./data/pack_1/carriers.json')
                let countries = require('./data/pack_1/countries.json')
                let suppliers = require('./data/pack_1/suppliers.json')

                let input = {
                    "start_date": "2021-05-02",
                    "end_date": "2021-05-09",
                    "sender_country": "fr",
                    "receiver_country": "nl"
                }

                let shipping = new Delivery(input, carriers, countries, suppliers);
                let shipping_possibilities = shipping.possibilities();

                let result = require( './result/pack_1/test_4.json' )

                expect(shipping_possibilities).to.eql(result);
            });
        });
        context('receiver country not existed in data files', () => {
            it("should return result/pack_1/test_5.json", () => {
                let carriers = require('./data/pack_1/carriers.json')
                let countries = require('./data/pack_1/countries.json')
                let suppliers = require('./data/pack_1/suppliers.json')

                let input = {
                        "start_date": "2021-05-02",
                        "end_date": "2021-05-09",
                        "sender_country": "nl",
                        "receiver_country": "es"
                }

                let shipping = new Delivery(input, carriers, countries, suppliers);
                let shipping_possibilities = shipping.possibilities();

                let result = require( './result/pack_1/test_5.json' )

                expect(shipping_possibilities).to.eql(result);
            });
        });




    })
});

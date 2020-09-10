export default class Delivery {
    // ASSUMPTIONS:
    // - We assume that the sender country must have a supplier. Else the delivery will not happen.
    //
    //
    // Example data input and call:
    //
    // let data = {
    //     "start_date": "2021-05-07",
    //     "end_date": "2021-05-11",
    //     "sender_country": "fr",
    //     "receiver_country": "fr"
    // }
    // let shipping = new Delivery(data);
    // let res = shipping.possibilities();



    carriers: Array<any>
    countries: Array<any>
    suppliers: Array<any>
    start_date: string
    end_date: string
    sender_country: string
    receiver_country: string
    shipping_possibilities: Array<any>
    constructor(input: any, carriers=require('../data/carriers.json'), countries=require('../data/countries.json'),
        suppliers=require('../data/suppliers.json')){

        this.carriers = carriers
        this.countries = countries
        this.suppliers = suppliers
        this.start_date = input.start_date
        this.end_date = input.end_date
        this.sender_country = input.sender_country
        this.receiver_country = input.receiver_country
        this.shipping_possibilities = []
    }

    is_input_acceptable = () :string => {
        // Check if input data are covered by the data (carriers.json, countries.json, suppliers.json)

        if (this.carriers_for_sender_and_receiver_country().length === 0) {
            return "Error: No carrier for input country."
        } else if (this.suppliers_for_sender_country().length === 0) {
            return "Error: No supplier for input country."
        }
        return "true"
    }

    carriers_for_sender_and_receiver_country = () : Array<any> => {
        // Find the carriers that can deliver to and from the given countries.

        let carriers_sender_country: any = this.carriers.filter(
            item => item.countries.find(country => country == this.sender_country)).map(item => item.id)
        let carriers_receiver_country: any = this.carriers.filter(
            item => item.countries.find(country => country == this.receiver_country)).map(item => item.id)

        return carriers_sender_country.filter(id => carriers_receiver_country.includes(id))
    }

    suppliers_for_sender_country = () : Array<any> => {
        // Find the suppliers that can provide from the sender country.
        // Assuming the supplier must be in the sender country 'sender_country'.

        return this.suppliers.filter(item => item.address.country == this.sender_country)//.map(item => item.id)
    }

    carriers_for_supplier = (supplier) : Array<any> => {
        // Find the carriers that work for the supplier for those carriers that also work for the given sender and
        // receiver countries.

        let carriers_for_sender_and_receiver_country = this.carriers_for_sender_and_receiver_country()
        return supplier.carriers.filter(carrier => carriers_for_sender_and_receiver_country.includes(carrier))
    }

    is_national_shipment = () : boolean => {
        // Define the days required based on the location (national/international).
        // Deliveries from and to the BeNeLux counts as national shipment.

        let beNeLux = ['be', 'nl', 'lux']
        if ((this.sender_country == this.receiver_country) ||
            (beNeLux.includes(this.receiver_country) && beNeLux.includes(this.sender_country)) ) {
            return true
        }
        return false
    }

    sender_country_holidays_delay = (date_now, delivery_time): Object => {
        // Add delay because of the sender country holidays.

        let sender_country_holidays = this.countries.filter(item => item.id == this.sender_country).map(item => item.holidays)[0]
        while(sender_country_holidays.includes(date_now.toISOString().split('T')[0])) {
            delivery_time++
            date_now.setDate(date_now.getDate() + 1)
        }
        return {date_now, delivery_time}
    }

    delivery_time = (start_date) : any => {
        // Calcualte the delivery time

        let date_now = start_date
        start_date = start_date.toISOString().split('T')[0]
        let delivery_time = 0
        let new_state ={}

        // // Add delay because of the sender country holidays.
        let res = this.sender_country_holidays_delay(date_now, delivery_time)
        let start_date_with_country_holidays = res['date_now'].toISOString().split('T')[0]
        let delivery_time_with_country_holidays = res['delivery_time']
        let results = {}

        // Add delay because of the supplier.
        let suppliers = this.suppliers_for_sender_country()
        for(let i=0; i<suppliers.length; i++){
            date_now = new Date(start_date_with_country_holidays)
            delivery_time = delivery_time_with_country_holidays

            if (suppliers[i].holidays) {
                while (suppliers[i].holidays.includes(date_now.toISOString().split('T')[0])) {
                    delivery_time++
                    date_now.setDate(date_now.getDate() + 1)
                }
            }

            // Add delay because of the sender country holidays.
            // Check if it is country holiday after the supplier holiday
            results = this.sender_country_holidays_delay(date_now, delivery_time)
            date_now = results['date_now']
            delivery_time = results['delivery_time']

            // Add the days required based on the location (national/international).
            if (this.is_national_shipment()){
                delivery_time++
                date_now.setDate(date_now.getDate() + 1)
            } else {
                delivery_time += 2
                date_now.setDate(date_now.getDate() + 2)
            }

            // Add delay because of the receiver country holidays.
            let receiver_country_holidays = this.countries.filter(item => item.id == this.receiver_country).map(
                item => item.holidays)[0]
            while(receiver_country_holidays.includes(date_now.toISOString().split('T')[0])) {
                delivery_time++
                date_now.setDate(date_now.getDate() + 1)
            }

            for (let carrier of this.carriers_for_supplier(suppliers[i])){
                new_state ={
                    'start_date':start_date,
                    'supplier': suppliers[i].id,
                    'carriers': carrier,
                    'delivery_date':date_now.toISOString().split('T')[0],
                    'days_to_deliver': delivery_time,
                    'cost': this.carriers.filter(item => item.id == carrier).map(item => item.price)[0]
                }
                this.shipping_possibilities.push(new_state)
            }
        }
    }

    possibilities = () : Array<any> => {
        // Find all the shipping possibilities for the given range of dates.

        let is_input_acceptable = this.is_input_acceptable()
        if (is_input_acceptable != 'true'){
            return [
                {
                    "message": is_input_acceptable
                }
            ]
        }

        let start_date_obj = new Date(this.start_date)
        let end_date_obj = new Date(this.end_date)
        let start_date: string

        try {
            while (start_date_obj <= end_date_obj){
                // These back and forth of start_date to string and object is happening because the change of the value
                // of the object is transfered through the call of function delivery_time().
                // We don't want that to happen or we will lose count of the days.

                start_date = start_date_obj.toISOString().split('T')[0]
                this.delivery_time(new Date(start_date))
                start_date_obj = new Date(start_date)
                start_date_obj.setDate(start_date_obj.getDate() + 1)
            }
        } catch (Error) {
            return [{
                "message": "Something went wrong."
            }]
        }
        return this.shipping_possibilities
    }
}

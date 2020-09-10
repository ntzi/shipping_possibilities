import Delivery from './delivery'

export default {
    shipping_possibilities: data => {
        let shipping = new Delivery(data);

        return shipping.possibilities()
    }
}

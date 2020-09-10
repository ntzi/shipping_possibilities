import 'source-map-support/register';
import service from './src/service'
import {handler as io} from './src/io'


export const shipping_possibilities = async (event, _context) => {
    const input = io.input(event)
    console.log('the Event = ', event)

    const result = service.shipping_possibilities(input)
    return io.returnSuccess(result)
}

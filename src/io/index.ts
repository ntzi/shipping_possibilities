export const handler = {
    input: x => JSON.parse(x.body),
    returnSuccess: x =>({
          statusCode: 200,
          body: JSON.stringify(x)
    })
}


export default {
    handler: handler
}

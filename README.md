# Shipping Possibilities

#### Shipping possibilities for a range of days

Find shipping possibilities for a range of days using default dataset of carriers, suppliers and countries.

The project is using the serverless framework for lambda (AWS).


## Use
Send a POST request to endpoint:

https://txkh3v1y91.execute-api.us-east-1.amazonaws.com/dev/shipping_possibilities

with body including:
 - range of the days
 - sender country
 - receiver country

The default dataset includes only the countries: 'nl', 'be', 'fr'


### Example
Request:

    {
        "start_date": "2021-05-07",
        "end_date": "2021-05-09",
        "sender_country": "fr",
        "receiver_country": "nl"
    }

Response:

    [
        {
            "start_date": "2021-05-07",
            "supplier": "FRS",
            "carriers": "DHP",
            "delivery_date": "2021-05-09",
            "days_to_deliver": 2,
            "cost": 5
        },
        {
            "start_date": "2021-05-08",
            "supplier": "FRS",
            "carriers": "DHP",
            "delivery_date": "2021-05-12",
            "days_to_deliver": 4,
            "cost": 5
        },
        {
            "start_date": "2021-05-09",
            "supplier": "FRS",
            "carriers": "DHP",
            "delivery_date": "2021-05-12",
            "days_to_deliver": 3,
            "cost": 5
        }
    ]

To easily send a POST request use [Postman](https://www.postman.com/) or [ReqBin](https://reqbin.com/).



## Deploy
### Deploy locally
#### Prerequisites
 - NodeJS, npm

#### Steps
 - Clone master branch

        $ git clone https://github.com/ntzi/shipping_possibilities.git

 - Install  dependencies

        $ cd shipping_possibilities/
        $ npm install

 - Run

        $ npm run dev

    The executed file is src/delivery.ts

    Adjust accordingly.


#### Tests

    npm test



### Deploy on AWS Lambda

The project is ready to be deployed on AWS Lambda.

#### Prerequisites

 - serverless

#### Steps
- Install serverless

        $ npm install -g serverless

More info about installation [here](https://www.serverless.com/framework/docs/getting-started/).

- Get your AWS credential

        $ export AWS_ACCESS_KEY_ID=<your-key-here>
        $ export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>

More info about AWS credential [here](http://slss.io/aws-creds-setup).

- Deploy

        $ serverless deploy

    or

        $ npm run deploy

- Make a request to the generated POST endpoint


 ## Authors

 * **Nikos Tziralis** - *Initial work* - [Shipping Possibilities](https://github.com/ntzi/Shipping_Possibilities)

 ## License

 This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

# NS - ASSIGNMENT

To install the necessary packages, run ```npm install``` in the main folder.

After that you can use the command ```npm run start``` to start the api.

The api is hosted on 8080 and the swagger is on 8080/docs.

Querying localhost:8080/health should return Healthy.

The optimalPath endpoint returns the most optimal route between two train stations.

The sortedTrips endpoint returns the trips sorted on transfers and the crowdForecast. To add the train facilities to the sorting criteria would probably require me to query the trains used in each trip and then look at their combined facilities.

I was sadly not able to add a tests to the api, but I would probably have used a package that can test apis and then check the /health route.

The original plan was to host the api via github pages, but I was not able to do this due to time constraints.

To use the routes, you will need a ns api key, which you can get by signing up at apiportal.ns.nl

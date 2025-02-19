import { Request } from "express";
import { StationFetchResult, TripsFetchResult } from "./routes/nsRoute";

function fetchExternal<X extends object>(route: string, key: string) {
        const response: Promise<X> = fetch(route,
        {
            method: "GET",
            headers: {
                'Ocp-Apim-Subscription-Key': key,
                'Cache-Control': 'no-cache',
                'content-type': 'application/json;charset=UTF-8'
            }
        }).then(async (response) => {
            let data;
            if(response.status !== 200) {
                throw new Error((await response.json()).message);
            } else {
                data = await response.json();
                return data;
            }
        });
        return response;
}

export async function getTrips(from: string, to: string, date: string, key: string) {
    const stations: StationFetchResult = await fetchExternal<StationFetchResult>(
                `https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations?limit=10`, key);
    
            const fromUICCode = stations.payload.find((station) => Object.values(station.namen).includes(from))?.UICCode;
            const toUICCode = stations.payload.find((station) => Object.values(station.namen).includes(to))?.UICCode;
    
            if(!fromUICCode || !toUICCode) {
                throw new Error(`One of the two stations (${from} or ${to}) could not be found`)
            }
    
            const trips: TripsFetchResult = await fetchExternal<TripsFetchResult>(
            `https://gateway.apiportal.ns.nl/reisinformatie-api/api/v3/trips?originUicCode=${fromUICCode}&destinationUicCode=${toUICCode}&originWalk=false&originBike=false&originCar=false&destinationWalk=false&destinationBike=false&destinationCar=false&dateTime=${date}&shorterChange=false&travelAssistance=false&searchForAccessibleTrip=false&localTrainsOnly=false&excludeHighSpeedTrains=false&excludeTrainsWithReservationRequired=false&discount=NO_DISCOUNT&travelClass=2&passing=false&travelRequestType=DEFAULT`, 
            key
            );
            return trips;
}

export function parseQuery(req: Request) {
    const from = req.query.from?.toString()
    const to = req.query.to?.toString()
    const date = req.query.date?.toString()
    const key = req.query.nsKey?.toString()

    if(!from || !to || !date || !key) {
        throw new Error("Missing required value")
    }

    return {from, to, date, key}
}

'002b78ffc61f44e2be6f6bda126920ae'
'2025-02-18'
import { Router } from "express";
import "isomorphic-fetch"
import { fetchExternal } from "../lib";

const router = Router();

type Station = {EVACode: string, UICCode: string, land: string, namen: {lang: string, middle: string, kort: string}}

type StationFetchResult = {payload: Station[]}

type Trip = {optimal: boolean}

type TripsFetchResult = {trips: Trip[]}

router.get("/optimalTrainPath", async (req, res) => {
    const from = req.query.from?.toString()
    const to = req.query.to?.toString()
    const date = req.query.date?.toString()

    if(!from || !to || !date) {
        res.send("Missing input");
        return;
    }

    const stations: StationFetchResult | string = await fetchExternal<StationFetchResult>("https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/stations?limit=10");
    if(typeof stations === "string") {
        res.send(stations);
        return;
    }

    const fromUICCode = stations.payload.find((station) => Object.values(station.namen).includes(from))?.UICCode;
    const toUICCode = stations.payload.find((station) => Object.values(station.namen).includes(to))?.UICCode;

    const trips: TripsFetchResult | string = await fetchExternal<TripsFetchResult>(`https://gateway.apiportal.ns.nl/reisinformatie-api/api/v3/trips?originUicCode=${fromUICCode}&destinationUicCode=${toUICCode}&originWalk=false&originBike=false&originCar=false&destinationWalk=false&destinationBike=false&destinationCar=false&dateTime=${date}&shorterChange=false&travelAssistance=false&searchForAccessibleTrip=false&localTrainsOnly=false&excludeHighSpeedTrains=false&excludeTrainsWithReservationRequired=false&discount=NO_DISCOUNT&travelClass=2&passing=false&travelRequestType=DEFAULT`);
    if(typeof trips === "string") {
        res.send(trips);
        return;
    }

    const bestTrip = trips.trips.find((trip) => trip.optimal)
    res.send(bestTrip);
})

router.get("/comfortSort", (req, res) => {
    res.send("Not yet implemented")
})

export default router;
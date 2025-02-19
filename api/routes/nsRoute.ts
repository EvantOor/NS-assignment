import { Router } from "express";
import "isomorphic-fetch"
import { getTrips, parseQuery } from "../lib";

const router = Router();

type Station = {EVACode: string, UICCode: string, land: string, namen: {lang: string, middle: string, kort: string}}

export type StationFetchResult = {payload: Station[]}

const crowdRanking = {
    "LOW": 0,
    "MEDIUM": 1,
    "HIGH": 2
}

//crowdForecast type is a guess
type Trip = {optimal: boolean, transfers: number, crowdForecast: "LOW" | "MEDIUM" | "HIGH"}

export type TripsFetchResult = {trips: Trip[]}

router.get("/optimalTrainPath", async (req, res) => {
    try{
        const query = parseQuery(req)

        const trips = await getTrips(query.from, query.to, query.date, query.key)
        const bestTrip = trips.trips.find((trip) => trip.optimal)

        res.send(bestTrip);
    } catch (e: any) {
        res.send(e.message)
    }
})

router.get("/comfortSort", async (req, res) => {
    try{
        const query = parseQuery(req)
        const trips = await getTrips(query.from, query.to, query.date, query.key)

        const sortedTrips = trips.trips
        .sort((a, b) => {
            if(a.transfers < b.transfers) 
                return -1;
            if(crowdRanking[a.crowdForecast] < crowdRanking[b.crowdForecast])
                return -1;
            return 1;
        })

        res.send(sortedTrips);
    } catch (e: any) {
        res.send(e.message)
    }
})

export default router;
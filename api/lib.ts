import { Response } from "express";

export function fetchExternal<X extends object>(route: string) {
        const response: Promise<X | string> = fetch(route,
        {
            method: "GET",
            headers: {
                'Ocp-Apim-Subscription-Key': '002b78ffc61f44e2be6f6bda126920ae',
                'Cache-Control': 'no-cache',
                'content-type': 'application/json;charset=UTF-8'
            }
        }).then(async (response) => {
            let data;
            if(response.status !== 200) {
                console.log("status", response.status);
                return response.text();
            }
            data = await response.json();
            return data;
        });
        return response;
}
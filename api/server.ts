import express from "express";
import swaggerAutogen from "swagger-autogen";
import swaggerUI from "swagger-ui-express"
import nsRoute from "./routes/nsRoute"

const app = express();

app.use("/health", (_, res) => {res.send("Healthy")})
app.use("/api", nsRoute)

try {
    swaggerAutogen({
        writeOutputFile: false,
    })(
        "./swagger-api.json", // Dummy output location still needed for some reason
        ["./server.ts"],
        {
            info: {
                title: "API",
                description: "Overview of all routes",
            },
            host: `localhost:8080`,
            basePath: "",
        },
    ).then((docs) => {
        if (!docs || !docs.success) {
            console.log(docs);
            throw new Error("Swagger autogen exited with failure");
        }
        app.use("/docs", swaggerUI.serve, swaggerUI.setup(docs.data));
    })

    
} catch (e) {
    console.error(`Running without Swagger due to error: ${e}`);
}

app.listen(8080);
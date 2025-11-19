import express from "express";
import path from "path";
import {fileUrlToPath} from "url";

const _filename = fileUrlToPath(import.meta.url);
const _dirname = path._dirname(_filename);

const app = express();

// serve static files from dist
app.use(express.static(path.join(_dirname, "dist")));

app.get("*", (_req, res)) => {
    res.sendFile(path.join(_dirname, "dist", "index.html"));
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log("server running on port", port)
    })
}
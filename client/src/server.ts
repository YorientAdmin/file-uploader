import express from "express";
import { readFileSync, readdir, statSync, createReadStream } from "fs";
import { join } from "path";
import fetch from "node-fetch";

var app = express();
var port = 3000;
var folderPath = "../files-to-upload";
var apiUrl: string = "http://127.0.0.1/flokapture/handlers/UploadFiles.ashx?pOpt=1";
setInterval(() => {
    var path = join(__dirname, folderPath);
    console.log(path);
    readdir(path, (err, files) => {
        for (const file of files) {
            var cp = join(path, file);
            const stats = statSync(cp);
            const fileSizeInBytes = stats.size;
            let readStream = createReadStream(cp);
            console.log(cp);
            fetch(apiUrl, {
                // @ts-ignore
                body: readStream, method: "POST", headers: {
                    "Content-length": fileSizeInBytes
                }, }).then((res) => {
                console.log(res);
            }).catch((error) => {
                console.log(error);
            });
        }
    });
}, 6000);
app.listen(port, "127.0.0.1", () => {
    console.log(`App is up and running on port: ${port}`);
});
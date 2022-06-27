import express from "express";
import { readdir, statSync, createReadStream } from "fs";
import { join } from "path";
import fetch from "node-fetch";
import FormData from "form-data";

var app = express();
var port = 3000;
var folderPath = "../files-to-upload";
var apiUrl: string = "http://127.0.0.1:8181/yorient/handlers/UploadFiles.ashx?pOpt=1";
setInterval(() => {
    var path = join(__dirname, folderPath);
    console.log(path);
    readdir(path, (err, files) => {
        for (const file of files) {
            var cp = join(path, file);
            // const stats = statSync(cp);
            // const fileSizeInBytes = stats.size;
            console.log(cp);
            let readStream = createReadStream(cp);
            console.log(cp);
            const formData = new FormData();
            formData.append('uploads', readStream);
            fetch(apiUrl, {
                method: 'POST',
                body: formData
            }).then( async(res) => {
                var text = await res.text();                
                console.log(text);
            }).catch((error) => {
                console.log(error);
            });
        }
    });
}, 6000);
app.listen(port, "127.0.0.1", () => {
    console.log(`App is up and running on port: ${port}`);
});
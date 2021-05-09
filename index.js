const http = require("http");
const fs = require("fs");
const requests = require("requests");
// const url = require('url');

const homeFile = fs.readFileSync("home.html", "utf8");
const replaceVal = (tempval,orgval)=>{
    let temperature = tempval.replace("{%tempval%}",orgval.main.temp);
    temperature = temperature.replace("{%tempmin%}",orgval.main.temp_min);
    temperature = temperature.replace("{%tempmax%}",orgval.main.temp_max);
    temperature = temperature.replace("{%location%}",orgval.name);
    temperature = temperature.replace("{%country%}",orgval.sys.country);
    temperature = temperature.replace("{%tempStatus%}",orgval.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res) => {
  if (req.url == "/") {
    requests("http://api.openweathermap.org/data/2.5/weather?q=junagadh&appid=7a301c40564f0619e54c73ae8bb3514b")
      .on("data", (chunk) =>{
          const objdata = JSON.parse(chunk);
          const arrData = [objdata]
        // console.log(arrData[0].main.temp);

        const realTimeData = arrData.map((val)=> replaceVal(homeFile,val)).join("");
        res.write(realTimeData);
        // console.log(realTimeData);
            

      })
      .on("end",  (err) =>{
        if (err) return console.log("connection closed due to errors", err);

        res.end();
      });
  }
});

const PORT = process.env.PORT || 8000
server.listen(PORT,()=>{
    console.log(`Server listenning at port number ${PORT}`);
})

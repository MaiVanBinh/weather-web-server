const request = require('request')
const forecast = (latitude, longtitude, callback) => {
    url = "https://api.darksky.net/forecast/5bde4da6de8b10a9f3391edeb895e054/" + latitude + "," + longtitude
    request({url, json: true}, (error, { body }) =>{
        if(error){
            callback("Unconnected to weather service", undefined)
        } else if (body.error) {
            callback("Unable find location", undefined)
        } else {
            const temperature = body.currently.temperature
            const precipProbability = body.currently.precipProbability
            const summary = body.daily.data[0].summary;
            const dayTempMax = body.daily.data[0].temperatureHigh;
            const dayTempLow = body.daily.data[0].temperatureLow;
            callback(undefined,summary+'. The high temperature: ' + dayTempMax + 'F\n The low temperature: ' + dayTempLow +'F.\n It\'s currently ' + temperature + 'F (' + Math.ceil((temperature-32)/1.8)  + 'C ) degress out. There is a ' + precipProbability + '% change of raine' )
        }
    })
}

module.exports = forecast
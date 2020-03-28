const request = require('request')

const geocode = (address, callback) => {
    const url ='https://api.mapbox.com/geocoding/v5/mapbox.places/' + address + '.json?types=place&access_token=pk.eyJ1IjoibWFpYmluaCIsImEiOiJjazg0bXhwY2IwM3V3M2Vuemowd3UxOWw1In0.XOuk2uQ56bra9-GwdAmmwg&limit=1';

    request({url, json: true}, (error, { body } = {}) => {
        if (error) {
            callback('Unconnected to geocode servervice', undefined)
        } else if (body.features.length === 0){
            callback('Unfind your location. Try another search', undefined)
        } else {
            const latitude = body.features[0].center[1]
            const longtitude = body.features[0].center[0]
            const location = body.features[0].place_name
            callback(undefined, {
                latitude, 
                longtitude,
                location,
            })
        }
    })
}

module.exports = geocode
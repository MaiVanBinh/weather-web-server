const express = require('express');
const app= express();
const bodyParser = require('body-parser');
const path = require('path')
const hbs = require('hbs')
const geocode = require('./src/utils/geocode')
const forecast = require('./src/utils/forecast')

const swaggerJsDoc=require('swagger-jsdoc');
const swaggerUi=require('swagger-ui-express');

//Extended: https://swagger.io/specification/#infoObject
const swaggerOptions={
    swaggerDefinition: {
        info: {
            title: 'Weather app API',
            description: "This is an Api docs about Assignment Third Week.\n\nIn Api, I use the mapbox.com to get latitude, longtitude of location name (input) and darksky.net to get teamperature base on latitude, longtitude.",
            version: "1.0.0",
            contact: {
                name: "Mai Văn Bình",
                email: "17520280@gm.edu.vn",
            },
            servers: ["weather-location-binh.herokuapp.com"]
        }
    },
    apis: ["app.js"]
};

const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/apidocs',swaggerUi.serve,swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *  get:
 *    summary: Return weather html file
 *    description: Get response in main page url/
 *    produces:
 *      - text/html
 *    responses:
 *      '200':
 *          description: Weather html file
 *      '404':
 *          description: Page not found
 *      default:
 *          description: Unexpected error
 * /about:
 *   get:
 *     summary: Return about html file
 *     produces:
 *       - text/html
 *     responses:
 *       '200':
 *         description: About html file
 *       '404':
 *         description: Page not found
 *       default:
 *         description: Unexpected error
 * /help:
 *   get:
 *     summary: Return help html file
 *     produces:
 *       - text/html
 *     responses:
 *       '200':
 *         description: Help html file
 *       '404':
 *         description: Page not found
 *       default:
 *         description: Unexpected error
 * /weather:
 *   get:
 *     summary: Get weather base on your location
 *     parameters:
 *       - in: query
 *         name: address
 *         description: Location name such as Ho Chi Minh or Ha Noi
 *         type: string
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       '200':
 *         description: OK
 *         examples:
 *           address: Ho Chi Minh
 *           location: 'Hồ Chí Minh, Vietnam'
 *           forecastData: ''
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Page not found
 *       default:
 *         description: Unexpected error
 */

const publicDirectoryPath = path.join(__dirname, './public')
const viewsPath = path.join(__dirname, './templates/views')
const partialsPath = path.join(__dirname, './templates/partials')

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'MVB'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'MVB'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'MVB'
    })
})

app.get('/weather', (req, res) => {
    const address = req.query.address;
    if(!address){
        return res.send({
            error: 'You must provide the address'
        })
    }
    geocode(address, (error, {latitude, longtitude, location} = {})=>{
        if(error){
            return res.send({
                error: error
            })
        } 
        forecast(latitude, longtitude, (error, forecastData) => {
            if (error) {
                return res.send({
                    error: error
                })
            }
            return res.send({
                address: address,
                location: location,
                forecastData: forecastData
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'MVB',
        errorMessage: 'Help article not found.'
    })
})

app.get('/products', (req, res) => {
    if(!req.query.search){
        return res.send({
            error: "You must provide search term"
        })
    }
    res.send({
        product:[]
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'MVB',
        errorMessage: 'Page not found.'
    })
})

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json());

module.exports = app;

// app.listen(port, () => {
//     console.log('Server is up on port ' + port)
// })


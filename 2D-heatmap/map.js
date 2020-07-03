"use strict";

const ONE_HOUR = 60 * 60 * 1000; /* ms */

var i = 0
var play = null
var hours = 0

const set = () => {
    //fetch()
    $('#current').text(moment().startOf('hour').add(hours, 'hours').calendar())

}

const filter = () => {
    while (i < 0) i += 24;
    i = i % 24;
    console.log('changing view: ' + i)
    set()
    //map.setFilter('pollution', ['==', ['get', 'timestamp'], i]);
}

const back = () => {
    i--;
    hours--;
    filter()
}
const forwards = () => {
    i++;
    hours++;
    filter()
}

const playOrPause = () => {
    $('#play').toggle()
    $('#pause').toggle()
    if (play) {
        clearInterval(play)
        play = null;
    } else {
        play = setInterval(forwards, 500)
    }
}


var kart = 'https://raw.githubusercontent.com/danieasv/test-data/master/trondheim_1203.geojson';


// ------------------------ MAPBOX --------------------

mapboxgl.accessToken = '<ADD_YOUR_MAPBOX_TOKEN_HERE!!>';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [10.4028, 63.4182],
    zoom: 11,
    pitch: 45
});

map.on('load', function() {
    //window.setInterval(function() {
    //    map.getSource('drone').setData(geojson);
    //    }, 2000);

    var layers = map.getStyle().layers;
    var labelLayerId;
    for (var i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && layers[i].layout['text-field']) {
            labelLayerId = layers[i].id;
            break;
        }
    }

    //map.addSource('drone', { type: 'geojson', data: geojson });

    //map.addLayer({
    //    'id': 'drone',
    //    'type': 'symbol',
    //    'source': 'drone',
    //    'layout': {
    //    'icon-image': 'rocket-15'
    //    }
    //});

    map.addSource('trees', {
    type: 'geojson',
    data: kart
    });

    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 1,
        'paint': {
        'fill-extrusion-color': '#aaa',

        // use an 'interpolate' expression to add a smooth transition effect to the
        // buildings as the user zooms in
        'fill-extrusion-height': [
            "interpolate", ["linear"], ["zoom"],
            15, 10,
            15.05, ["get", "height"]
        ],
        'fill-extrusion-base': [
            "interpolate", ["linear"], ["zoom"],
            15, 0,
            150.05, ["get", "min_height"]
        ],
        'fill-extrusion-opacity': .6
        }
        }, labelLayerId);
        filter();

    map.addLayer({
        id: 'trees-heat',
        type: 'heatmap',
        source: 'trees',
        maxzoom: 15,
        paint: {
            // increase weight as diameter breast height increases
            'heatmap-weight': {
            property: 'pm10',
            type: 'exponential',
            stops: [
                [1, 0],
                [15, 1]
            ]
            },
            // increase intensity as zoom level increases
            'heatmap-intensity': {
            stops: [
                [11, 1],
                [15, 3]
            ]
            },
            // assign color values be applied to points depending on their density
            'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(236,222,239,0)',
            0.2, 'rgb(208,209,230)',
            0.4, 'rgb(166,189,219)',
            0.6, 'rgb(103,169,207)',
            0.8, 'rgb(28,144,153)'
            ],
            // increase radius as zoom increases
            'heatmap-radius': {
            stops: [
                [11, 15],
                [15, 20]
            ]
            },
            // decrease opacity to transition into the circle layer
            'heatmap-opacity': {
            default: 1,
            stops: [
                [14, 1],
                [15, 0]
            ]
            },
        }
    }, 'waterway-label');

    map.addLayer({
        id: 'trees-point',
        type: 'circle',
        source: 'trees',
        minzoom: 14,
        paint: {
            // increase the radius of the circle as the zoom level and dbh value increases
            'circle-radius': {
            property: 'pm10',
            type: 'exponential',
            stops: [
                [{ zoom: 15, value: 1 }, 5],
                [{ zoom: 15, value: 62 }, 10],
                [{ zoom: 22, value: 1 }, 20],
                [{ zoom: 22, value: 62 }, 50],
            ]
            },
            'circle-color': {
            property: 'pm10',
            type: 'exponential',
            stops: [
                [0, 'rgba(236,222,239,0)'],
                [1, 'rgb(236,222,239)'],
                [2, 'rgb(208,209,230)'],
                [4, 'rgb(166,189,219)'],
                [6, 'rgb(103,169,207)'],
                [8, 'rgb(28,144,153)'],
                [10, 'rgb(1,108,89)']
            ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': {
            stops: [
                [14, 0],
                [15, 1]
            ]
            }
        }
    }, 'waterway-label');



        map.on('click', 'trees-point', function(e) {
            new mapboxgl.Popup()
                .setLngLat(e.features[0].geometry.coordinates)
                .setHTML('<b>PM10:</b> ' + e.features[0].properties.pm10 + '<br><b>PM2.5:</b> ' + e.features[0].properties.pm25 + '<br><b>CO2:</b> ' + e.features[0].properties.co2ppm)
                .addTo(map);
        });
});

//map.on('load', load);

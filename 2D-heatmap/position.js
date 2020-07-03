// ----------------------- Fetch MQTT Data -------------

const fs = require("fs");
const mqtt = require("mqtt");

// TODO: Change this to the name of your thing.
const thingName = "00002176";

// TODO: Change this to the hostname for the MQTT broker.
// If you have an account on demo.mic.telenorconnexion.com
// you can leave the current value.
const hostname = "a3k7odshaiipe8-ats.iot.eu-west-1.amazonaws.com";

// Configure a mqtt client and use it to connect to AWS.
// TODO: Make sure that the name of the files matches yours.
const mqttClient = mqtt.connect({
  ca: fs.readFileSync("root.pem"),
  cert: fs.readFileSync("cert.pem"),
  clientId: thingName,
  hostname: hostname,
  key: fs.readFileSync("privkey.pem"),
  port: 8883,
  protocol: "mqtts"
});

mqttClient.on("connect", () => {
  console.log("Connected to MQTT");

  // Subscribe to the delta topic to receive requests for state changes.
  mqttClient.subscribe(`$aws/things/${thingName}/shadow/update`);
});
var geojson = {};
mqttClient.on("message", (topic, message) => {
  const msg = JSON.parse(message);
  //console.log("Payload", msg.state.reported);
  const json = msg.state.reported
// Convert to geojson

  geojson = {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [json.lng, json.lat]
    },
    "properties": {
      "timestamp": json.stimestamp,
      "altitude": json.altitude,
      "humidity": json.rhum,
      "co2": json.co2ppm,
      "pm10": json.pm10,
      "pm25": json.pm25,
      "temperature": json.temperature,
      "connection_status": json.tcxn.connection_status
    }
  };
  console.log("Geojson", geojson);
  
}); // END mqttClient.on

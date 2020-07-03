# coding: latin-1
import sys
import json, requests
import xml.etree.ElementTree as ET
import calendar
from requests.auth import HTTPBasicAuth
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import time
import argparse
from influxdb import InfluxDBClient



# First, manually create a influx_db on your server. Yuse the same credidentials with a password below.
host='localhost'
port=8086
user = #hidden
password = #hidden
dbname = #hidden
clientdb = InfluxDBClient(host, port, user, password, dbname)

# TRAQ 03
def customCallback1(client, userdata, message):
    jsonResponse = json.loads(message.payload)
    state = jsonResponse['state']
    data = state['reported']
    json_body1 = [
                {
                    "measurement": "traq03",
                    "tags": {
                        "sensor": "traq03",
                    },
                   "fields": {
                        "temperature": float(data['temperature']),
                        "latitude": float(data['lat']),
                        "longitude": float(data['lng']),
                        "altitude": float(data['altitude']),
                        "CO2": float(data['co2ppm']),
                        "pm10": float(data['pm10']),
                        "pm25": float(data['pm25']),
                        "humidity": float(data['rhum']),
                    }
            }
    ]

    clientdb.write_points(json_body1)
    print("received from 03")
    #print(json.dumps(jsonResponse, indent=4, sort_keys=True))

# TRAQ 05
def customCallback2(client, userdata, message):
    jsonResponse = json.loads(message.payload)
    state = jsonResponse['state']
    data = state['reported']
    json_body2 = [
                {
                    "measurement": "traq05",
                    "tags": {
                        "sensor": "traq05",
                    },
                    "fields": {
                        "temperature": float(data['temperature']),
                        "latitude": float(data['lat']),
                        "longitude": float(data['lng']),
                        "altitude": float(data['altitude']),
                        "CO2": float(data['co2ppm']),
                        "pm10": float(data['pm10']),
                        "pm25": float(data['pm25']),
                        "humidity": float(data['rhum']),
                    }
            }
    ]

    clientdb.write_points(json_body2)
    #print(json.dumps(jsonResponse, indent=4, sort_keys=True))
    print("received from 05")

# Voll
def customCallback3(client, userdata, message):
    jsonResponse = json.loads(message.payload)
    state = jsonResponse['state']
    data = state['reported']
    json_body3 = [
                {
                    "measurement": "voll",
                    "tags": {
                        "sensor": "voll",
                    },
                    "fields": {
                        "temperature": float(data['temperature']),
                        "latitude": float(data['lat']),
                        "longitude": float(data['lng']),
                        "altitude": float(data['altitude']),
                        "CO2": float(data['co2ppm']),
                        "pm10": float(data['pm10']),
                        "pm25": float(data['pm25']),
                        "humidity": float(data['rhum']),
                    }
            }
    ]

    clientdb.write_points(json_body3)
    #print(json.dumps(jsonResponse, indent=4, sort_keys=True))
    print("received from voll")

# TRAQ 03
myAWSIoTMQTTClient1 = AWSIoTMQTTClient("00002176")
myAWSIoTMQTTClient1.configureEndpoint("<YOUR_ENDPOINT_API>-ats.iot.eu-west-1.amazonaws.com", 8883) # Found in Telenor MIC
priv_key_name = "00002176/privkey.pem" #Add this file from Telenor MIC
cert_key_name = "00002176/cert.pem" #Add this file from Telenor MIC
myAWSIoTMQTTClient1.configureCredentials("root.pem", priv_key_name, cert_key_name) #Add this file from Telenor MIC
myAWSIoTMQTTClient1.connect()
myAWSIoTMQTTClient1.subscribe("$aws/things/00002176/shadow/update", 1, customCallback1)

# TRAQ 05
myAWSIoTMQTTClient2 = AWSIoTMQTTClient("00002203")
myAWSIoTMQTTClient2.configureEndpoint("<YOUR_ENDPOINT_API>-ats.iot.eu-west-1.amazonaws.com", 8883) # Found in Telenor MIC
priv_key_name = "00002203/privkey.pem" #Download this file from Telenor MIC
cert_key_name = "00002203/cert.pem" #Download this file from Telenor MIC
myAWSIoTMQTTClient2.configureCredentials("root.pem", priv_key_name, cert_key_name) #Download this file from Telenor MIC
myAWSIoTMQTTClient2.connect()
myAWSIoTMQTTClient2.subscribe("$aws/things/00002203/shadow/update", 1, customCallback2)

# Voll sensor
myAWSIoTMQTTClient3 = AWSIoTMQTTClient("00001931")
myAWSIoTMQTTClient3.configureEndpoint("<YOUR_ENDPOINT_API>-ats.iot.eu-west-1.amazonaws.com", 8883) # Found in Telenor MIC
priv_key_name = "00001931/privkey.pem" #Download this file from Telenor MIC
cert_key_name = "00001931/cert.pem" #Download this file from Telenor MIC
myAWSIoTMQTTClient3.configureCredentials("root.pem", priv_key_name, cert_key_name) #Download this file from Telenor MIC
myAWSIoTMQTTClient3.connect()
myAWSIoTMQTTClient3.subscribe("$aws/things/00001931/shadow/update", 1, customCallback3)

print("Connected to sensors")
while True:
	time.sleep(1)

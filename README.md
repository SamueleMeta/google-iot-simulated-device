# Google IoT Simple Simulated Device
This is a modified version of the simulated device provided by Google, you should use it only for testing purpouses. Like this [sample data generator](https://github.com/awslabs/sbs-iot-data-generator) data will look like 
```json
{"deviceValue":45.360934963787756,
 "deviceParameter":"Temperature",
 "deviceId":"SBS01",
 "dateTime":"2018-05-31T07:22:50.868Z"}
```
## Setup
1. Download and unzip the folder
2. Run ``` npm install jsonwebtoken ```
3. Run ``` npm install retry-request ```
4. Open ```device.js``` and modify the variables under configuration
5. Get a private key from Google IoT and put in ```private_key.pem```
## Execute
Run ```node device.js```

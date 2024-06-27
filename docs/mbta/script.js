const mbtaUrl = 'https://api-v3.mbta.com/vehicles?page%5Boffset%5D=0&page%5Blimit%5D=100&fields%5Bvehicle%5D=bearing%2Ccarriages%2Ccurrent_status%2Cstop_id%2Ccurrent_stop_sequence%2Cdirection_id%2Clabel%2Clatitude%2Clongitude%2Coccupancy_status%2Cspeed%2Cupdated_at&include=trip%2Cstop%2Croute&filter%5Broute_type%5D=2&filter%5Brevenue%5D=REVENUE';
const mbtaStopsUrl = 'https://api-v3.mbta.com/stops?page%5Boffset%5D=0&page%5Blimit%5D=250&fields%5Bstop%5D=latitude%2Clongitude%2Cname%2Cplatform_code&filter%5Broute_type%5D=2';
var ipGeoUrl = 'http://ip-api.com/json/';
var receivedipJSON = {};
var receivedtrainJSON = {};
var receivedstopsJSON = {};
var yourLat = 0;
var yourLong = 0;
var lowestDist = 100.1;
var closestStop = "";
var closestStopID = "";
var closestStopLineCode = "";
var closestStopLat = 0;
var closestStopLong = 0;
var trainFound = 0;


    fetch(mbtaStopsUrl)
  .then(response => {
    if (!response.ok) {
        document.getElementById("data-output").innerHTML = "Error: network response did not return 200 OK when pulling stops data";
      throw new Error('Network response was not ok');
      
    }
    return response.json();
  })
  .then(data => {
    receivedstopsJSON = data;
    getLocation();

  })
  .catch(error => {
    console.error('Error:', error);
  });









function getLocation() {

    function success(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        yourLat = latitude;
        yourLong = longitude;
        pullStopsData(longitude, latitude, "geo");
    
      }

    function error() {
        document.getElementById("station-estimate").innerHTML = "Geolocation didn't work. Trying IP...";
        fetch(ipGeoUrl)
        .then(response => {
          if (!response.ok) {
              document.getElementById("station-estimate").innerHTML = "Error: network response did not return 200 OK when pulling IP data";
              throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          receivedipJSON = data;
          yourLat = receivedipJSON.lat;
          yourLong = receivedipJSON.lon;
          pullStopsData(receivedipJSON.lon, receivedipJSON.lat, "ip");
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }

    if (!navigator.geolocation) {
        document.getElementById("station-estimate").innerHTML = "Geolocation is not supported by your browser";
      } else {
        document.getElementById("station-estimate").innerHTML = "Locating…";
        navigator.geolocation.getCurrentPosition(success, error);
      }
    
    }





function pullStopsData(long, lat, ipgeo) {
    lowestDist = 100.1;


    for (let index = 0; index < receivedstopsJSON.data.length; index++) {
        let localLongitudeDiff = receivedstopsJSON.data[index].attributes.longitude - long;
        let localLatitudeDiff = receivedstopsJSON.data[index].attributes.latitude - lat;

        if(localLatitudeDiff ** 2 + localLongitudeDiff ** 2 < lowestDist) {
            lowestDist = localLatitudeDiff ** 2 + localLongitudeDiff ** 2;
            closestStop = receivedstopsJSON.data[index].attributes.name;
            closestStopLat = receivedstopsJSON.data[index].attributes.latitude;
            closestStopLong = receivedstopsJSON.data[index].attributes.longitude;
            closestStopID = receivedstopsJSON.data[index].id;
        }

    }
    if(ipgeo == "ip") {
        document.getElementById("station-estimate").innerHTML = "Due to data from your IP address, your station has been set to " + closestStop + ".";

    }
    if(ipgeo == "geo") {
        document.getElementById("station-estimate").innerHTML = "Due to data from your device's location, your station has been set to " + closestStop + ".";
    }
    closestStopLineCode = closestStopID.split("-")[0];
    getData();

}

function getData() {

    trainFound = 0;

  fetch(mbtaUrl)
  .then(response => {
    if (!response.ok) {
        document.getElementById("data-output").innerHTML = "Error: network response did not return 200 OK when pulling train data";
      throw new Error('Network response was not ok');
      
    }
    return response.json();
  })
  .then(data => {

    var classnames = document.getElementsByClassName('new-train');

while(classnames[0]) {
classnames[0].parentNode.removeChild(classnames[0]);
}

    receivedtrainJSON = data;
    for (let index = 0; index < receivedtrainJSON.data.length; index++) {
      if(receivedtrainJSON.data[index].relationships.stop.data.id.split("-")[0] == closestStopLineCode) { // train is running the same line. Deal with South and North Station later
        trainFound = 1;
        let newObject = document.createElement("div");
        let newText1 = document.createElement("p");
        newText1.innerHTML = receivedtrainJSON.data[index].relationships.route.data.id.split("-")[1] + " Line";
        let newText2 = document.createElement("p");
        if(receivedtrainJSON.data[index].attributes.direction_id == 0) {
        newText2.innerHTML = "Train " + receivedtrainJSON.data[index].id + " - Outbound";
        } else {
            newText2.innerHTML = "Train " + receivedtrainJSON.data[index].id + " - Inbound";

        }
        let newText3 = document.createElement("p");

        for (let index2 = 0; index2 < receivedstopsJSON.data.length; index2++) {
            if(receivedstopsJSON.data[index2].id == receivedtrainJSON.data[index].relationships.stop.data.id) {

                if(receivedtrainJSON.data[index].attributes.current_status == "IN_TRANSIT_TO") {
                newText3.innerHTML = "Current Status: In transit to " + receivedstopsJSON.data[index2].attributes.name;
                }
                if(receivedtrainJSON.data[index].attributes.current_status == "STOPPED_AT") {
                    newText3.innerHTML = "Current Status: Stopped at " + receivedstopsJSON.data[index2].attributes.name;
                    }
                    if(receivedtrainJSON.data[index].attributes.current_status == "INCOMING_AT") {
                        newText3.innerHTML = "Current Status: Arriving at " + receivedstopsJSON.data[index2].attributes.name;
                        }

            }
    
    
        }        
        
        let newText4 = document.createElement("p");
        newText4.innerHTML = "Location: (" + parseFloat(receivedtrainJSON.data[index].attributes.latitude).toFixed(4) + ", " + parseFloat(receivedtrainJSON.data[index].attributes.longitude).toFixed(4) + ")";
        let newText4B = document.createElement("p");
        newText4B.innerHTML = "Speed: " + receivedtrainJSON.data[index].attributes.speed + " MPH";
        let newText5 = document.createElement("p");
        newText5.innerHTML = "Distance From Your Stop: " +  parseFloat(((receivedtrainJSON.data[index].attributes.latitude - closestStopLat) ** 2 + (receivedtrainJSON.data[index].attributes.longitude - closestStopLong) ** 2) ** 0.5 * 68.7).toFixed(1) + " miles"
        let newText6 = document.createElement("p");
        let expectedTime = parseFloat(    ((receivedtrainJSON.data[index].attributes.latitude - closestStopLat) ** 2 + (receivedtrainJSON.data[index].attributes.longitude - closestStopLong) ** 2) ** 0.5 * 68.7 / ((receivedtrainJSON.data[index].attributes.speed + 33.4) / 2) * 60).toFixed(1)
        if(expectedTime <= 1) {
            newText6.innerHTML = "Train is Due for Arrival"
        } else {
            newText6.innerHTML = "Expected Time to Arrival: " + expectedTime + " minutes"
        }
        newObject.appendChild(newText1);
        newObject.appendChild(newText2);
        newObject.appendChild(newText3);
        newObject.appendChild(newText4);
        newObject.appendChild(newText4B);

        newObject.appendChild(newText5);
        newObject.appendChild(newText6);
        newObject.classList.add("new-train");
        document.getElementById("train-carrier").appendChild(newObject);
      }
    }

    if(trainFound == 0) {
        var classnames = document.getElementsByClassName('new-train');

        while(classnames[0]) {
        classnames[0].parentNode.removeChild(classnames[0]);
        }
        let newObject = document.createElement("div");
        let newText1 = document.createElement("p");
        newText1.innerHTML = "Unfortunately, there are no trains currently running on the same line as " + closestStop + ".";
        newObject.appendChild(newText1);
        newObject.classList.add("new-train");
        document.getElementById("train-carrier").appendChild(newObject);
    }

    
    

  })
  .catch(error => {
    console.error('Error:', error);
  });



  var timeLeft = 20;
  
  var timerId = setInterval(countdown, 1000);
  
  function countdown() {
    if (timeLeft == -1) {
      clearTimeout(timerId);
      getData();
    } else {
      document.getElementById("data-updater").innerHTML = "Updating in " + timeLeft + " seconds...";
      timeLeft--;
    }
  }


}


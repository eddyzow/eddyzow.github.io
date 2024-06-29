particlesJS.load("particles-js", "particles.json");

const mbtaUrl =
  "https://api-v3.mbta.com/vehicles?page%5Boffset%5D=0&page%5Blimit%5D=100&fields%5Bvehicle%5D=bearing%2Ccarriages%2Ccurrent_status%2Cstop_id%2Ccurrent_stop_sequence%2Cdirection_id%2Clabel%2Clatitude%2Clongitude%2Coccupancy_status%2Cspeed%2Cupdated_at&include=trip%2Cstop%2Croute&filter%5Broute_type%5D=2&filter%5Brevenue%5D=REVENUE";
const mbtaStopsUrl =
  "https://api-v3.mbta.com/stops?page%5Boffset%5D=0&page%5Blimit%5D=250&fields%5Bstop%5D=latitude%2Clongitude%2Cname%2Cplatform_code&filter%5Broute_type%5D=2";
var receivedipJSON = {};
var receivedtrainJSON = {};
var receivedstopsJSON = {};
var yourLat = 0;
var yourLong = 0;
var lowestDist = 100.1;
var ratelimited = 0;
var closestStop = "";
var closestStopID = "";
var closestStopLineCode = "";
var closestStopLat = 0;
var closestStopLong = 0;
var trainFound = 0;
var listLines = [
  "Fairmount",
  "Fitchburg",
  "Worcester",
  "Franklin",
  "Greenbush",
  "Haverhill",
  "Kingston",
  "Lowell",
  "Middleborough",
  "Needham",
  "Newburyport",
  "Providence",
];
var listStations = [
  [
    "Readville",
    "Fairmount",
    "Blue Hill Avenue",
    "Morton Street",
    "Talbot Avenue",
    "Four Corners/Geneva",
    "Uphams Corner",
    "Newmarket",
    "South Station",
  ],
  [
    "Wachusett",
    "Fitchburg",
    "North Leominster",
    "Shirley",
    "Ayer",
    "Littleton/Route 495",
    "South Acton",
    "West Concord",
    "Concord",
    "Lincoln",
    "Kendal Green",
    "Brandeis/Roberts",
    "Waltham",
    "Waverley",
    "Belmont",
    "Porter",
    "North Station",
  ],
  [
    "Worcester",
    "Grafton",
    "Westborough",
    "Southborough",
    "Ashland",
    "Framingham",
    "West Natick",
    "Natick Center",
    "Welleseley Square",
    "Wellesley Hills",
    "Wellesley Farms",
    "Auburndale",
    "West Newton",
    "Newtonville",
    "Boston Landing",
    "Lansdowne",
    "Back Bay",
    "South Station",
  ],
  [
    "Forge Park/495",
    "Franklin",
    "Norfolk",
    "Walpole",
    "Foxboro",
    "Windsor Gardens",
    "Norwood Central",
    "Norwood Depot",
    "Islington",
    "Dedham Corporate Center",
    "Endicott",
    "Readville",
    "Hyde Park",
    "Forest Hills",
    "Ruggles",
    "Back Bay",
    "South Station",
  ],
  [
    "Greenbush",
    "North Scituate",
    "Cohasset",
    "Nantasket Junction",
    "West Hingham",
    "East Weymouth",
    "Weymouth Landing/East Braintree",
    "Quincy Center",
    "JFK/UMass",
    "South Station",
  ],
  [
    "Haverhill",
    "Bradford",
    "Lawrence",
    "Andover",
    "Ballardvale",
    "North Wilmington",
    "Reading",
    "Wakefield",
    "Greenwood",
    "Melrose Highlands",
    "Melrose/Cedar Park",
    "Wyoming Hill",
    "Oak Grove",
    "Malden Center",
    "North Station",
  ],
  [
    "Kingston",
    "Halifax",
    "Hanson",
    "Whitman",
    "Abington",
    "South Weymouth",
    "Braintree",
    "Quincy Center",
    "JFK/UMass",
    "South Station",
  ],
  [
    "Lowell",
    "North Billerica",
    "Wilmington",
    "Anderson/Woburn",
    "Wedgemere",
    "West Medford",
    "North Station",
  ],
  [
    "Middleborough/Lakeville",
    "Bridgewater",
    "Campello",
    "Brockton",
    "Montello",
    "Holbrook/Randolph",
    "Braintree",
    "Quincy Center",
    "JFK/UMass",
    "South Station",
  ],
  [
    "Needham Heights",
    "Needham Center",
    "Needham Junction",
    "Hersey",
    "West Roxbury",
    "Highland",
    "Bellevue",
    "Roslindale Village",
    "Forest Hills",
    "Ruggles",
    "Back Bay",
    "South Station",
  ],
  [
    "Rockport",
    "Gloucester",
    "West Gloucester",
    "Manchester",
    "Beverly Farms",
    "Montserrat",
    "Newburyport",
    "Rowley",
    "Ipswich",
    "Hamilton/Wenham",
    "North Beverly",
    "Beverly",
    "Salem",
    "Swampscott",
    "Lynn Interim",
    "River Works",
    "Chelsea",
    "North Station",
  ],
  [
    "Wickford Junction",
    "TF Green Airport",
    "Providence",
    "Pawtucket/Central Falls",
    "South Attleboro",
    "Attleboro",
    "Mansfield",
    "Sharon",
    "Stoughton",
    "Canton Center",
    "Canton Junction",
    "Route 128",
    "Readville",
    "Hyde Park",
    "Forest Hills",
    "Ruggles",
    "Back Bay",
    "South Station",
  ],
];

fetch(mbtaStopsUrl)
  .then((response) => {
    if (!response.ok) {
      document.getElementById("data-output").innerHTML =
        "Error: network response did not return 200 OK when pulling stops data";
      ratelimited = 1;
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    receivedstopsJSON = data;
    getLocation();
    ratelimited = 0;
  })
  .catch((error) => {
    document.getElementById("data-updater").innerHTML =
      "You're being rate limited. Try again in a minute.";
  });

function findDistance(arr, item1, item2) {
  let index1 = arr.indexOf(item1);
  let index2 = arr.indexOf(item2);
  let distance = index1 - index2;
  return distance;
}

function changeStationAvail() {
  var classnames = document.getElementsByClassName("station-option");

  while (classnames[0]) {
    classnames[0].parentNode.removeChild(classnames[0]);
  }

  if (document.getElementById("stations-trains").value == "unselected") {
    let item = document.createElement("option");
    item.setAttribute("class", "station-option");
    item.innerHTML = "Select a line first";
    item.setAttribute("value", "unselected");
    document.getElementById("specific-stations").appendChild(item);
  } else {
    let stationList =
      listStations[parseInt(document.getElementById("stations-trains").value)];
    for (let index = 0; index < stationList.length; index++) {
      let item = document.createElement("option");
      item.setAttribute("class", "station-option");
      item.innerHTML = stationList[index];
      item.setAttribute("value", stationList[index]);
      document.getElementById("specific-stations").appendChild(item);
    }
  }
}

function manualSearchGo() {
  if (
    document.getElementById("stations-trains").value != "unselected" &&
    document.getElementById("specific-stations").value != "unselected"
  ) {
    for (let index = 0; index < receivedstopsJSON.data.length; index++) {
      if (
        receivedstopsJSON.data[index].attributes.name ==
        document.getElementById("specific-stations").value
      ) {
        closestStop = receivedstopsJSON.data[index].attributes.name;
        closestStopLat = receivedstopsJSON.data[index].attributes.latitude;
        closestStopLong = receivedstopsJSON.data[index].attributes.longitude;
        closestStopID = receivedstopsJSON.data[index].id;
      }
      document.getElementById("station-estimate").innerHTML =
        "You've manually set your station to " +
        closestStop +
        ". Reload the page to use your location data.";
    }
    runDataGet();
    document.getElementById("announcement").innerHTML =
      "Click this button to switch your station!";
  } else {
    document.getElementById("announcement").innerHTML =
      "Select both a line and a station!";
  }
}

function getLocation() {
  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    yourLat = latitude;
    yourLong = longitude;
    pullStopsData(longitude, latitude, "geo");
  }

  function error() {
    document.getElementById("station-estimate").innerHTML =
      "Your location could not be obtained. Please manually select your nearest MBTA stop.";
  }

  if (!navigator.geolocation) {
    document.getElementById("station-estimate").innerHTML =
      "Geolocation is not supported by your browser";
  } else {
    document.getElementById("station-estimate").innerHTML = "Locating…";
    navigator.geolocation.getCurrentPosition(success, error);
  }
}

function pullStopsData(long, lat, ipgeo) {
  lowestDist = 100.1;

  for (let index = 0; index < receivedstopsJSON.data.length; index++) {
    let localLongitudeDiff =
      receivedstopsJSON.data[index].attributes.longitude - long;
    let localLatitudeDiff =
      receivedstopsJSON.data[index].attributes.latitude - lat;

    if (localLatitudeDiff ** 2 + localLongitudeDiff ** 2 < lowestDist) {
      lowestDist = localLatitudeDiff ** 2 + localLongitudeDiff ** 2;
      closestStop = receivedstopsJSON.data[index].attributes.name;
      closestStopLat = receivedstopsJSON.data[index].attributes.latitude;
      closestStopLong = receivedstopsJSON.data[index].attributes.longitude;
      closestStopID = receivedstopsJSON.data[index].id;
    }
  }

  if (ipgeo == "geo") {
    document.getElementById("station-estimate").innerHTML =
      "Due to data from your device's location, your station has been set to " +
      closestStop +
      ".";
  }
  getData();
}

function getData() {
  runDataGet();

  var timeLeft = 20;

  var timerId = setInterval(countdown, 1000);

  function countdown() {
    if (timeLeft == -1) {
      clearTimeout(timerId);
      getData();
    } else {
      if (ratelimited == 1) {
        document.getElementById("data-updater").innerHTML =
          "You're being rate limited. Try again in a minute.";
      } else {
        document.getElementById("data-updater").innerHTML =
          "Updating in " + timeLeft + " seconds...";
      }
      timeLeft--;
    }
  }
}

function runDataGet() {
  trainFound = 0;
  fetch(mbtaUrl)
    .then((response) => {
      if (!response.ok) {
        document.getElementById("data-output").innerHTML =
          "Error: network response did not return 200 OK when pulling train data";
        ratelimited = 1;
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      ratelimited = 0;

      var classnames = document.getElementsByClassName("new-train");

      while (classnames[0]) {
        classnames[0].parentNode.removeChild(classnames[0]);
      }

      receivedtrainJSON = data;
      for (let index = 0; index < receivedtrainJSON.data.length; index++) {
        try {
          if (
            listStations[
              listLines.indexOf(
                receivedtrainJSON.data[index].relationships.route.data.id.split(
                  "-"
                )[1]
              )
            ].includes(closestStop)
          ) {
            //if(receivedtrainJSON.data[index].relationships.stop.data.id.split("-")[0] == closestStopLineCode) { // train is running the same line. Deal with South and North Station later

            trainFound += 1;
            let numSteps = 999;
            let newObject = document.createElement("div");
            let newText1 = document.createElement("p");
            newText1.setAttribute("class", "bold");
            newText1.innerHTML =
              receivedtrainJSON.data[index].relationships.route.data.id.split(
                "-"
              )[1] + " Line";
            let newText2 = document.createElement("p");
            if (receivedtrainJSON.data[index].attributes.direction_id == 0) {
              newText2.innerHTML =
                "Lead Car " + receivedtrainJSON.data[index].id + " - Outbound";
            } else {
              newText2.innerHTML =
                "Lead Car " + receivedtrainJSON.data[index].id + " - Inbound";
            }
            let newText3 = document.createElement("p");

            for (
              let index2 = 0;
              index2 < receivedstopsJSON.data.length;
              index2++
            ) {
              if (
                receivedstopsJSON.data[index2].id.substring(0, 8) ==
                receivedtrainJSON.data[
                  index
                ].relationships.stop.data.id.substring(0, 8)
              ) {
                let currentTrainStop =
                  receivedstopsJSON.data[index2].attributes.name;
                if (
                  receivedtrainJSON.data[index].attributes.current_status ==
                  "IN_TRANSIT_TO"
                ) {
                  newText3.innerHTML =
                    "Current Status: In transit to " +
                    receivedstopsJSON.data[index2].attributes.name;
                } else if (
                  receivedtrainJSON.data[index].attributes.current_status ==
                  "STOPPED_AT"
                ) {
                  newText3.innerHTML =
                    "Current Status: Stopped at " +
                    receivedstopsJSON.data[index2].attributes.name;
                } else if (
                  receivedtrainJSON.data[index].attributes.current_status ==
                  "INCOMING_AT"
                ) {
                  newText3.innerHTML =
                    "Current Status: Arriving at " +
                    receivedstopsJSON.data[index2].attributes.name;
                } else {
                  newText3.innerHTML = "Current Status: Unknown";
                }

                // calculate number of steps away

                if (
                  receivedtrainJSON.data[index].attributes.direction_id == 0
                ) {
                  numSteps =
                    -1 *
                    findDistance(
                      listStations[
                        listLines.indexOf(
                          receivedtrainJSON.data[
                            index
                          ].relationships.route.data.id.split("-")[1]
                        )
                      ],
                      closestStop,
                      currentTrainStop
                    );
                } else {
                  numSteps =
                    1 *
                    findDistance(
                      listStations[
                        listLines.indexOf(
                          receivedtrainJSON.data[
                            index
                          ].relationships.route.data.id.split("-")[1]
                        )
                      ],
                      closestStop,
                      currentTrainStop
                    );
                }
              }
            }

            let newText4 = document.createElement("p");
            newText4.innerHTML =
              "Location: (" +
              parseFloat(
                receivedtrainJSON.data[index].attributes.latitude
              ).toFixed(4) +
              ", " +
              parseFloat(
                receivedtrainJSON.data[index].attributes.longitude
              ).toFixed(4) +
              ")";
            let newText4B = document.createElement("p");
            if (receivedtrainJSON.data[index].attributes.speed == null) {
              newText4B.innerHTML = "Speed: 0 MPH (Stopped)";
            } else {
              newText4B.innerHTML =
                "Speed: " +
                receivedtrainJSON.data[index].attributes.speed +
                " MPH";
            }
            let newText4C = document.createElement("p");
            if (numSteps == 0) {
              newText4C.innerHTML =
                "Arriving soon - next stop is your station!";
            } else if (numSteps > 0) {
              newText4C.innerHTML = numSteps + " stops away";
            } else {
              trainFound -= 1;
              continue;
            }
            let dist = parseFloat(
              ((receivedtrainJSON.data[index].attributes.latitude -
                closestStopLat) **
                2 +
                (receivedtrainJSON.data[index].attributes.longitude -
                  closestStopLong) **
                  2) **
                0.5 *
                68.7
            ).toFixed(1);

            console.log(dist);
            let newText5 = document.createElement("p");
            newText5.innerHTML = "Distance From Your Stop: " + dist + " miles";
            let newText6 = document.createElement("p");
            let expectedTime = (
              ((dist / 30) * 60 + numSteps * 7.0) /
              2
            ).toFixed(1);
            console.log(expectedTime);

            if (expectedTime <= 1) {
              newText6.innerHTML = "Train is Approaching";
            } else {
              let hours = new Date(
                new Date().getTime() + 1000 * expectedTime * 60
              ).getHours();
              let mins = new Date(
                new Date().getTime() + 1000 * expectedTime * 60
              ).getMinutes();

              if (mins < 10) {
                mins = "0" + mins;
              }

              if (hours <= 11) {
                if (hours == 0) {
                  hours = 12;
                }
                newText6.innerHTML =
                  "Expected Time of Arrival: " + hours + ":" + mins + " AM";
              } else {
                if (hours == 12) {
                  hours = 24;
                }
                newText6.innerHTML =
                  "Expected Time of Arrival: " +
                  (hours - 12) +
                  ":" +
                  mins +
                  " PM";
              }
            }
            newObject.appendChild(newText1);
            newObject.appendChild(newText2);
            newObject.appendChild(newText3);
            newObject.appendChild(newText4);
            newObject.appendChild(newText4B);
            newObject.appendChild(newText4C);

            newObject.appendChild(newText5);
            newObject.appendChild(newText6);
            newObject.classList.add("new-train");
            document.getElementById("train-carrier").appendChild(newObject);
          }
        } catch {
          continue;
        }
      }

      if (trainFound == 0) {
        var classnames = document.getElementsByClassName("new-train");

        while (classnames[0]) {
          classnames[0].parentNode.removeChild(classnames[0]);
        }
        let newObject = document.createElement("div");
        let newText1 = document.createElement("p");
        newText1.innerHTML =
          "No trains are currently running through " + closestStop + ".";
        newObject.appendChild(newText1);
        newObject.classList.add("new-train");
        document.getElementById("train-carrier").appendChild(newObject);
      }
    })
    .catch((error) => {
      document.getElementById("data-updater").innerHTML =
        "You're being rate limited. Try again in a minute.";
    });
}

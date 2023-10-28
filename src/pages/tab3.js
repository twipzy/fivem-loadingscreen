import React, { useState, useEffect } from "react"
// import vehiclesArray from "../assets/vehicles.json"

import "../components/layout.css"

const sessionstorage = require("sessionstorage")

function getRankFromLevel(name, level) {
  if (name === "PizzaThis") {
    if (level < 29) {
      return 1
    } else if (level < 100) {
      return 2
    } else if (level < 220) {
      return 3
    } else if (level < 420) {
      return 4
    } else if (level > 420) {
      return 5
    } else {
      return "0"
    }
  } else if (name === "Gruppe Sechs") {
    if (level < 49) {
      return 1
    } else if (level < 160) {
      return 2
    } else if (level < 260) {
      return 3
    } else if (level < 710) {
      return 4
    } else if (level > 710) {
      return 5
    } else {
      return "0"
    }
  } else if (name === "GoPostal") {
    if (level < 49) {
      return 1
    } else if (level < 150) {
      return 2
    } else if (level < 320) {
      return 3
    } else if (level < 640) {
      return 4
    } else if (level > 640) {
      return 5
    } else {
      return "0"
    }
  } else if (name === "RON") {
    if (level < 30) {
      return 1
    } else if (level < 100) {
      return 2
    } else if (level < 230) {
      return 3
    } else if (level < 450) {
      return 4
    } else if (level > 450) {
      return 5
    } else {
      return "0"
    }
  } else if (name === "RS Trucking") {
    if (level < 30) {
      return 1
    } else if (level < 100) {
      return 2
    } else if (level < 230) {
      return 3
    } else if (level < 450) {
      return 4
    } else if (level > 450) {
      return 5
    } else {
      return "Unknown"
    }
  } else if (name === "LS Recycling") {
    if (level < 30) {
      return 1
    } else if (level < 100) {
      return 2
    } else if (level < 230) {
      return 3
    } else if (level < 450) {
      return 4
    } else if (level > 450) {
      return 5
    } else {
      return "0"
    }
  }
}

function numberWithCommas(x) {
  if (x !== null) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return 0
}

function displayValue(val, isNumber, isTest) {
  if (isTest) {
    console.log(val);
  }

  if (typeof val === "string") {
    return numberWithCommas(parseInt(val, 10).toFixed(0)) || 0;
  } else if (val && val.data && val.data.rows && val.data.rows.length === 0) {
    return 0;
  } else if (val && val.data && val.data.rows && val.data.rows[0]) {
    if (val.data.rows[0][0] === null) {
      return 0;
    } else if (isNumber) {
      return numberWithCommas(parseInt(val.data.rows[0][0], 10).toFixed(0)) || 0;
    } else {
      return val.data.rows[0][0] || 0;
    }
  }
}
function apiCall(steamID, id, setState) {
  if (sessionstorage.getItem(id)) {
    setState(JSON.parse(sessionstorage.getItem(id)))
  } else {
    fetch(
      "https://stats.highliferoleplay.net/api/public/dashboard/6a161777-351f-47bd-a610-d0d2ac0335d5/card/" +
        id +
        "?parameters=" +
        encodeURIComponent(
          JSON.stringify([
            {
              type: "category",
              target: ["variable", ["template-tag", "identifier"]],
              value: "steam:" + steamID,
            },
          ])
        )
    )
      .then(function (response) {
        return response.json()
      })
      .then(function (json) {
        setState(json)
        sessionstorage.setItem(id, JSON.stringify(json))
      })
      .catch(function (ex) {
        console.error(ex)
      })
  }
}

function apiCallSpeltWrong(steamID, id, setState) {
  if (sessionstorage.getItem(id)) {
    setState(JSON.parse(sessionstorage.getItem(id)))
  } else {
    fetch(
      "https://stats.highliferoleplay.net/api/public/dashboard/6a161777-351f-47bd-a610-d0d2ac0335d5/card/" +
        id +
        "?parameters=" +
        encodeURIComponent(
          JSON.stringify([
            {
              type: "category",
              target: ["variable", ["template-tag", "indetifier"]],
              value: "steam:" + steamID,
            },
          ])
        )
    )
      .then(function (response) {
        return response.json()
      })
      .then(function (json) {
        setState(json)
        sessionstorage.setItem(id, JSON.stringify(json))
      })
      .catch(function (ex) {
        console.error(ex)
      })
  }
}

function vehicleApiCall(steamID, setState) {
  if (sessionstorage.getItem("a5cf9688-77e8-46d0-b6c1-3afcd72c4750")) {
    setState(
      JSON.parse(sessionstorage.getItem("a5cf9688-77e8-46d0-b6c1-3afcd72c4750"))
    )
  } else {
    fetch(
      "https://stats.highliferoleplay.net/api/public/card/a5cf9688-77e8-46d0-b6c1-3afcd72c4750/query?parameters=" +
        encodeURIComponent(
          JSON.stringify([
            {
              type: "category",
              target: ["variable", ["template-tag", "identifier"]],
              value: "steam:" + steamID,
            },
          ])
        )
    )
      .then(function (response) {
        return response.json()
      })
      .then(function (json) {
        if (json && json.data && json.data.rows) {
          console.log(json)
          setState(json.data.rows)
          sessionstorage.setItem(
            "a5cf9688-77e8-46d0-b6c1-3afcd72c4750",
            JSON.stringify(json.data.rows)
          )
        }
      })
      .catch(function (ex) {
        console.error(ex)
      })
  }
}

// function getVehicleName(name, hash) {
//   let temp = vehiclesArray.find(v => v.Hash == hash)

//   if (temp && temp.Name) {
//     return vehiclesArray.find(v => v.Hash == hash).Name
//   }
//   return "Vehicle"
// }

function checkLoaded(val) {
  if (val !== undefined) {
    return true
  }

  return false
}

function Tab(props) {
  const [bankMoney, setBankMoney] = useState(undefined)
  const [speedingFines, setSpeedingFines] = useState(undefined)
  const [totalFines, setTotalFines] = useState(undefined)
  const [timesJailed, setTimesJailed] = useState(undefined)
  const [timeJail, setTimeJail] = useState(undefined)
  const [vehiclesChopped, setVehiclesChopped] = useState(undefined)
  const [chopshopPoints, setChopshopPoints] = useState(undefined)
  const [phoneNumber, setPhoneNumber] = useState("000-0000")
  const [bankID, setBankID] = useState("00000000")
  const [propertiesCount, setPropertiesCount] = useState(undefined)
  const [vehicles, setVehicles] = useState(undefined)
  const [jobInfo, setJobInfo] = useState(undefined)
  const [insuranceCount, setInsuranceCount] = useState(undefined)
  const [impoundCount, setImpoundCount] = useState(undefined)

  useEffect(() => {
    apiCall(props.steamID, 164, setBankMoney)
    apiCall(props.steamID, 169, setSpeedingFines)
    apiCall(props.steamID, 269, setTotalFines)
    apiCall(props.steamID, 170, setTimesJailed)
    apiCall(props.steamID, 171, setTimeJail)
    apiCall(props.steamID, 263, setVehiclesChopped)
    apiCall(props.steamID, 264, setChopshopPoints)
    apiCall(props.steamID, 171, setTimeJail)
    apiCall(props.steamID, 193, setPhoneNumber)
    apiCall(props.steamID, 165, setBankID)
    apiCall(props.steamID, 172, setPropertiesCount)
    apiCall(props.steamID, 271, setImpoundCount)
    apiCall(props.steamID, 270, setInsuranceCount)
    apiCallSpeltWrong(props.steamID, 268, setJobInfo)
    vehicleApiCall(props.steamID, setVehicles)
  }, [])

  return (
    <div className="row wh=100">
      {checkLoaded(bankMoney) &&
      checkLoaded(speedingFines) &&
      checkLoaded(timesJailed) &&
      checkLoaded(timeJail) &&
      checkLoaded(vehiclesChopped) &&
      checkLoaded(chopshopPoints) &&
      checkLoaded(phoneNumber) &&
      checkLoaded(bankID) &&
      checkLoaded(propertiesCount) ? (
        <>
          <div className="col-12 col-md-12 mb-2">
            <h3>Economics</h3>
            <div className="card">
              <div className="row">
                <div className="col-12 col-md-4">
                  <label className="statLabel">Bank Balance</label>
                  <div className="statValue large positive">
                    ${displayValue(bankMoney, true)}
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <label className="statLabel">Total Speeding Fines</label>
                  <div className="statValue large negative">
                    ${displayValue(speedingFines, true)}
                  </div>
                </div>
                <div className="col-12 col-md-4">
                  <label className="statLabel">Total Fines</label>
                  <div className="statValue large negative">
                    ${displayValue(totalFines, true, true)}
                  </div>
                </div>
              </div>
            </div>
            </div>
            <div className="col-12 col-md-6">
            <h3>Criminal Record</h3>
            <div className="card">
              <div className="row">
                <div className="col-12 col-md-6">
                  <label className="statLabel">Times Jailed</label>
                  <div className="statValue medium info">
                    {displayValue(timesJailed, true)}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <label className="statLabel">Hours Spent in Jail</label>
                  <div className="statValue medium info">
                    {displayValue(timeJail, true)}
                  </div>
                </div>
              </div>
            </div>
            <div className="card mt-3">
              <div className="row">
                <div className="col-12 col-md-6">
                  <label className="statLabel">Total Vehicles Chopped</label>
                  <div className="statValue medium">
                    {displayValue(vehiclesChopped, true)}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <label className="statLabel">Chopshop Points</label>
                  <div className="statValue medium">
                    {displayValue(chopshopPoints, true)}
                  </div>
                </div>
              </div>
            </div>
            <h3>Character Information</h3>
            <div className="card">
              <div className="row">
                <div className="col-12 col-md-6">
                  <label className="statLabel">Phone Number</label>
                  <div className="statValue medium">
                    {displayValue(phoneNumber, false)}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <label className="statLabel">Bank Account ID</label>
                  <div className="statValue medium ">
                    {displayValue(bankID, false)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-3">
            <h3>Properties</h3>
            <div className="card">
                  <label className="statLabel">Active Owned Properties</label>
                  <div className="statValue medium positive">
                    {displayValue(propertiesCount, true)}
                  </div>
            </div>
                <h3>Career</h3>
                <div className="card">
                  <ul className="careerList">
                    {jobInfo &&
                      jobInfo.data &&
                      jobInfo.data.cols && Array.isArray(jobInfo.data.cols) &&
                      jobInfo.data.cols.map((job, i) => (
                        <li key={i}>
                          <span>{job.display_name}</span>
                          <span>
                            Level{" "}
                            {jobInfo.data.rows && jobInfo.data.rows[0] && jobInfo.data.rows[0][i] ? <>{getRankFromLevel(
                              job.display_name,
                              jobInfo.data.rows[0][i]
                            )} ({jobInfo.data.rows[0][i]})</> : "0"}
                           
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
          </div>
          <div className="col-12 col-md-3">
                <h3>Vehicles</h3>
                <div className="card mb-2">
                  <label className="statLabel">Vehicles in Insurance / Impound</label>
                  <div className="statValue medium">
                   <span className="negative">{displayValue(insuranceCount, true)}</span> 
                  {' / '}
                  <span className="info">{displayValue(impoundCount, true)}</span></div>
            </div>

                {/* <div className="card">
                  <ul className="vehicleList">
                    {vehicles &&
                    Array.isArray(vehicles) &&
                    vehicles.length > 0 ? (
                      vehicles.map((vehicle, i) => (
                        <li key={i}>
                          <span className="vehicleName">
                            {getVehicleName(vehicle[3], vehicle[4])}
                          </span>{" "}
                          {vehicle[2] && "- " + vehicle[2]}
                        </li>
                      ))
                    ) : (
                      <>You have no vehicles :( </>
                    )}
                  </ul>
                </div> */}
          </div>
        </>
      ) : (
        <div className="col-12 d-flex wh-100 justify-content-center">
          <div className="statLoader align-self-center"></div>
        </div>
      )}
    </div>
  )
}

export default Tab

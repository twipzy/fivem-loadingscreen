import React, { useState, useEffect } from "react"

import "../components/layout.css"

const sessionstorage = require("sessionstorage")

function numberWithCommas(x) {
  if (x !== null) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
  return 0
}

function displayValue(val, isNumber) {
  if (typeof val === "string") {
    return val
  }

  if (val && val.data && val.data.rows && val.data.rows[0]) {
    if (isNumber) {
      return numberWithCommas(parseInt(val.data.rows[0][0], 10).toFixed(0))
    } else {
      return val.data.rows[0][0]
    }
  }
}

function displayValueNewPlayers(passedVal) {
  if (passedVal && passedVal.data && passedVal.data.rows) {
    let val = passedVal.data.rows
    if (val && Array.isArray(val)) {
      return numberWithCommas(parseInt(val[val.length - 1][1], 10).toFixed(0))
    }
  }
}
function apiCall(id, setState) {
  if (sessionstorage.getItem(id)) {
    setState(JSON.parse(sessionstorage.getItem(id)))
  } else {
    fetch(
      "https://stats.highliferoleplay.net/api/public/dashboard/37c2b7a9-657d-426a-8d58-7c2e2f387f42/card/" +
        id +
        "?parameters=%5B%5D"
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

function Tab() {
  const [totalFines, setTotalFines] = useState(undefined)
  const [speedingFines, setSpeedingFines] = useState(undefined)
  const [economyBalance, setEconomyBalance] = useState(undefined)
  const [uniquePlayers, setUniquePlayers] = useState(undefined)
  const [newPlayers, setNewPlayers] = useState(undefined)
  const [daysPlayed, setDaysPlayed] = useState(undefined)
  const [hoursPlayed, setHoursPlayed] = useState(undefined)
  const [totalVehicles, setTotalVehicles] = useState(undefined)
  const [totalChopped, setTotalChopped] = useState(undefined)
  const [totalJail, setTotalJail] = useState(undefined)
  const [totalProperties, setTotalProperties] = useState(undefined)

  function checkLoaded(val) {
    if (val !== undefined) {
      return true
    }

    return false
  }

  useEffect(() => {
    apiCall(105, setTotalFines)
    apiCall(74, setSpeedingFines)
    apiCall(100, setEconomyBalance)
    apiCall(75, setUniquePlayers)
    apiCall(70, setNewPlayers)
    apiCall(72, setDaysPlayed)
    apiCall(73, setHoursPlayed)
    apiCall(102, setTotalVehicles)
    apiCall(104, setTotalChopped)
    apiCall(111, setTotalJail)
    apiCall(98, setTotalProperties)
  }, [])

  return (
    <div className="row wh-100 justify-content-start">
      {checkLoaded(totalFines) &&
      checkLoaded(speedingFines) &&
      checkLoaded(economyBalance) &&
      checkLoaded(uniquePlayers) &&
      checkLoaded(newPlayers) &&
      checkLoaded(totalChopped) &&
      checkLoaded(totalProperties) &&
      checkLoaded(totalJail) &&
      checkLoaded(totalVehicles) &&
      checkLoaded(daysPlayed) ? (
        <>
          <div className="col-12 col-md-12 mb-2">
            <h3>Economics</h3>
            <div className="card">
              <div className="row">
                <div className="col-12 col-md-4">
                  <label className="statLabel">Economy Balance</label>
                  <div className="statValue large positive">
                    ${displayValue(economyBalance, true)}
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
                    ${displayValue(totalFines, true)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <h3>Players</h3>
            <div className="card">
              <div className="row">
                <div className="col-12 col-md-6">
                  <label className="statLabel">Total Unique Players</label>
                  <div className="statValue medium">
                    {displayValue(uniquePlayers, true)}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <label className="statLabel">New Players Today</label>
                  <div className="statValue medium">
                    {displayValueNewPlayers(newPlayers)}
                  </div>
                </div>
              </div>
            </div>

            <h3>Playtime</h3>
            <div className="card">
              <div className="row">
                <div className="col-12 col-md-6">
                  <label className="statLabel">Total Days Played</label>
                  <div className="statValue medium">
                    {displayValue(daysPlayed, true)}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <label className="statLabel">Total Hours Played</label>
                  <div className="statValue medium">
                    {displayValue(hoursPlayed, true)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <h3>Vehicles</h3>
            <div className="card">
              <div className="row">
                <div className="col-12 col-md-6">
                  <label className="statLabel">Total Owned Vehicles</label>
                  <div className="statValue medium">
                    {displayValue(totalVehicles, true)}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <label className="statLabel">Total Chopped Vehicles</label>
                  <div className="statValue medium">
                    {displayValue(totalChopped, true)}
                  </div>
                </div>
              </div>
            </div>

            <h3>Miscellaneous</h3>
            <div className="card">
              <div className="row">
                <div className="col-12 col-md-6">
                  <label className="statLabel">Total Days Spent in Jail</label>
                  <div className="statValue medium">
                    {displayValue(totalJail, true)}
                  </div>
                </div>
                <div className="col-12 col-md-6">
                  <label className="statLabel">Total Owned Properties</label>
                  <div className="statValue medium">
                    {displayValue(totalProperties, true)}
                  </div>
                </div>
              </div>
            </div>
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

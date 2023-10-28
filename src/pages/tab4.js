import React, { useLayoutEffect, useState } from "react"
import "../components/layout.css"

const sessionstorage = require("sessionstorage")

function Tab(props) {
  const [supporters, setSupporters] = useState([])

  function apiCall(id, setState) {
    if (sessionstorage.getItem(id)) {
      setState(JSON.parse(sessionstorage.getItem(id)))
    } else {
      fetch(
        "https://stats.highliferoleplay.net/api/public/dashboard/4df7837d-3f02-45b6-864e-79a7b580f593/card/327"
      )
        .then(function (response) {
          return response.json()
        })
        .then(function (json) {
          if (json && json.data && json.data.rows) {
            setState(json.data.rows)
            sessionstorage.setItem(id, JSON.stringify(json.data.rows))
          }
        })
        .catch(function (ex) {
          console.error(ex)
        })
    }
  }

  useLayoutEffect(() => {
    apiCall("supporters", setSupporters)
  }, [])

  return (
    <div>
      <h3>Our Supporters</h3>
      <div className="row">
        {supporters ? (
          supporters.map((supporter, i) => (
            <div className={"col-6 col-md-2 supporterTier-" + supporter[0]}>
              {supporter[1] !== null ? supporter[1] : "Null"}
            </div>
          ))
        ) : (
          <div className="loading">Loading...</div>
        )}
      </div>
    </div>
  )
}

export default Tab

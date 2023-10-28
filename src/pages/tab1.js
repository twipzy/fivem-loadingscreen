import React, { useLayoutEffect, useState } from "react"

import d8 from "../images/services-d8.png"
import lawyer from "../images/services-lawyer.png"
import police from "../images/services-police.png"
import ems from "../images/services-ems.png"
import taxi from "../images/services-taxi.png"
import dw from "../images/services-dw.png"
import news from "../images/services-news.png"
import vanilla from "../images/vanilla.png"

import "../components/layout.css"

const sessionstorage = require("sessionstorage")

function RenderStat(props) {
  const [stat, setStat] = useState([])

  function apiCall(id, setState) {
    if (sessionstorage.getItem(id)) {
      setState(JSON.parse(sessionstorage.getItem(id)))
    } else {
      fetch(
        "https://stats.highliferoleplay.net/api/public/dashboard/4df7837d-3f02-45b6-864e-79a7b580f593/card/" +
          id
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
    if (props.value === 0) {
      apiCall("325", setStat) // 325 Playtime
    } else if (props.value === 1) {
      apiCall("326", setStat) // 326 Jailed
    } else if (props.value === 2) {
      apiCall("328", setStat) // 328 Fisherman
    }
  }, [])

  function getTitle(val) {
    if (val === 0) {
      return "Top Playtime"
    } else if (val === 1) {
      return "Top Jailed"
    } else if (val === 2) {
      return "Top Fisherman"
    }
  }

  function secondsToDhms(seconds) {
    seconds = Number(seconds)
    var d = Math.floor(seconds / (3600 * 24))
    var h = Math.floor((seconds % (3600 * 24)) / 3600)
    var m = Math.floor((seconds % 3600) / 60)
    var s = Math.floor(seconds % 60)

    var dDisplay = d > 0 ? d + (d == 1 ? "d, " : "d, ") : ""
    var hDisplay = h > 0 ? h + (h == 1 ? "h, " : "h, ") : ""
    var mDisplay = m > 0 ? m + (m == 1 ? "m, " : "m, ") : ""
    var sDisplay = s > 0 ? s + (s == 1 ? "s" : "s") : ""
    return dDisplay + hDisplay + mDisplay + sDisplay
  }

  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  function setValue(type, val) {
    if (type === 0) {
      return secondsToDhms(val)
    } else if (type === 1) {
      return numberWithCommas(val) + " sentences"
    } else if (type === 2) {
      return numberWithCommas(val) + " Fish"
    }
  }

  if (stat) {
    return (
      <div className={"randomStatistic " + stat}>
        <h3>{getTitle(props.value)}</h3>
        <ol>
          {stat.map((player, i) => (
            <li key={i}>
              {props.value === 0 ? (
                <>{player[1] !== null ? player[1] : "NULL"}</>
              ) : (
                <>{player[0] !== null ? player[0] : "NULL"}</>
              )}

              <span className="playTime">
                {props.value === 0 ? (
                  <>{setValue(props.value, player[0])}</>
                ) : (
                  <>{setValue(props.value, player[1])}</>
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>
    )
  } else {
    return (
      <>
        <h3>{getTitle(props.value)}</h3>
        <div className="loading">Loading...</div>
      </>
    )
  }
}

function Tab(props) {
  const [rand, setRand] = useState(Math.floor(Math.random() * 3))
  return (
    <div className="row">
      <div className="col-12 col-md-8">
        <h3>
          We advise that before you start playing you summarize the following
          rules:
        </h3>
        <ol className="rules">
          <li>A working microphone is required to play</li>
          <li>Respect fellow players and staff members</li>
          <li>No racism or discrimination in or out of character</li>
          <li>
            Do not randomly shoot or fist-fight other players for no reason
          </li>
          <li>
            You cannot pull a weapon with no roleplay if you are at gunpoint
          </li>
          <li>
            Deliberately attempting to incite a fight with no reason is not
            allowed
          </li>
          <li>
            Killing another player for little or no in-character reason is
            forbidden
          </li>
          <li>
            You are not allowed to seek out/kill anyone involved with a previous
            death
          </li>
          <li>
            Do not purposely bait a police officer with a vehicle (burnout,
            drifting etc)
          </li>
          <li>
            Do not use your vehicle as a weapon against other players for little
            or no good reason
          </li>
          <li>
            When you are killed, your character loses all memory leading up to
            their death unless revived
          </li>
        </ol>
        <span className="discord discordRulesMessage">
          Read the full list of rules on our Discord #basic-info channel
        </span>
        <h3>Key Controls</h3>
        Player: Inventory [<span className="key">K</span>], Put Handsup [
        <span className="key">X</span>], Surrender [
        <span className="key">F3</span>], Open Phone [
        <span className="key">Y</span>], Point Finger [
        <span className="key">B</span>], Animations [
        <span className="key">F3</span>] Vehicle: Lock/Unlock Vehicle [
        <span className="key">U</span>], Vehicle Trunk [
        <span className="key">G</span>], Vehicle Menu [
        <span className="key">M</span>], Cruise Control [
        <span className="key">Left ALT</span>]<h3>Commands</h3>
        <div>
          /<span className="command">help</span> Shows basic commands
        </div>
        <div>
          /<span className="command">rules</span> Shows the server rules
        </div>
        <div>
          /<span className="command">commands</span> Shows detailed commands
        </div>
        <div className="d-flex mt-3 mb-3">
          <span className="d-block discord align-self-center">
            <i className="align-self-center tabOneDiscordIcon fab fa-discord discord"></i>
          </span>
          <div className="align-self-center">
            Join us on Discord, to leave feedback, interact with the community
            and apply for new roles
            <span className="d-block discord">discord.gg/fivestar</span>
          </div>
        </div>
      </div>
      <div className="col-12 col-md-4">
        <h3>Online Services</h3>
        {props.cityDetails &&
        props.cityDetails &&
        props.cityDetails.vars &&
        props.cityDetails.vars.hl_onlinejobs ? (
          <div className="services">
            <div className="servicesList">
              {JSON.parse(props.cityDetails.vars.hl_onlinejobs).police && (
                <img src={police} alt="LSPD" title="LSPD" />
              )}
              {JSON.parse(props.cityDetails.vars.hl_onlinejobs)
                .ambulance && <img src={ems} alt="EMS" title="EMS" />}
              {JSON.parse(props.cityDetails.vars.hl_onlinejobs).mecano && (
                <img src={dw} alt="DW Customs" title="DW Customs" />
              )}
              {JSON.parse(props.cityDetails.vars.hl_onlinejobs).taxi && (
                <img src={taxi} alt="Downtown Cab Co" title="Downtown Cab Co" />
              )}
              {JSON.parse(props.cityDetails.vars.hl_onlinejobs)
                .dynasty && <img src={d8} alt="Dynasty 8" title="Dynasty 8" />}
              {JSON.parse(props.cityDetails.vars.hl_onlinejobs).news && (
                <img src={news} alt="Weazel News" title="Weazel News" />
              )}
              {JSON.parse(props.cityDetails.vars.hl_onlinejobs).lawyer && (
                <img
                  src={lawyer}
                  alt="LS Legal Department"
                  title="LS Legal Department"
                />
              )}
              {JSON.parse(props.cityDetails.vars.hl_onlinejobs)
                .vanilla && (
                <img
                  src={vanilla}
                  alt="Vanilla Unicorn"
                  title="Vanilla Unicorn"
                />
              )}
              {!JSON.parse(props.cityDetails.vars.hl_onlinejobs).lawyer &&
                !JSON.parse(props.cityDetails.vars.hl_onlinejobs).news &&
                !JSON.parse(props.cityDetails.vars.hl_onlinejobs)
                  .dynasty &&
                !JSON.parse(props.cityDetails.vars.hl_onlinejobs).taxi &&
                !JSON.parse(props.cityDetails.vars.hl_onlinejobs).mecano &&
                !JSON.parse(props.cityDetails.vars.hl_onlinejobs)
                  .ambulance &&
                !JSON.parse(props.cityDetails.vars.hl_onlinejobs).police &&
                !JSON.parse(props.cityDetails.vars.hl_onlinejobs)
                  .vanilla && <>No Services Online 😢 </>}
            </div>
          </div>
        ) : (
          <div className="services">
            <div className="servicesList">No Services Online 😢</div>
          </div>
        )}

        <RenderStat value={rand} />
      </div>
    </div>
  )
}

export default Tab

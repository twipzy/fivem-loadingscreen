import React, { useState, useLayoutEffect, useRef } from "react"
import Logo from "../images/logo.svg"
import Tab from "../components/Tab"
import TabSelector from "../components/TabSelector"
import ls from "local-storage"
import Pointer from "../images/cursor.png"

import Tab1 from "./tab1"
import Tab2 from "./tab2"
import Tab3 from "./tab3"
import Tab4 from "./tab4"

import "../components/layout.css"
// import "../components/bootstrap.grid.css"

import Snowfall from 'react-snowfall'

import uniqueRandom from 'unique-random';

const trollIds = [];

function makeid(length) {
  var result = ""
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

function getServerDetails(id, setState) {
  fetch("https://api.highliferoleplay.net/misc/getCityInfo")
    .then(response => response.json())
    .then(data => {
      setState(data)
    })
    .catch(error => {
      console.log("Unable to fetch services")
    })
}

async function getMusicArrayApi(troll, setState) {
  return await fetch(
    "https://cdn.highliferoleplay.net/fivem/" + (troll === false ? 'music' : 'bad_music') + "/loading_music.php"
  )
    .then(response => response.json())
    .then(data => {
      setState(data)
      return data
    })
    .catch(error => {
      console.log("Unable to fetch music array")
    })
}

async function getBackgroundsArrayApi(setState) {
  return await fetch(
    "https://cdn.highliferoleplay.net/fivem/loading_backgrounds/index.php"
  )
    .then(response => response.json())
    .then(data => {
      setState(data)
      return data
    })
    .catch(error => {
      console.log("Unable to fetch background array")
    })
}

function IndexPage(props) {
  const [selectedMusic, setSelectedMusic] = useState(1)
  const [selectedTab, setSelectedTab] = useState(1)
  const [cityDetails, setCityDetails] = useState({})
  const [steamID, setSteamID] = useState("")
  const [musicToggled, setMusicToggled] = useState(true)
  const [musicArray, setMusicArray] = useState([])
  const [backgroundArray, setBackgroundArray] = useState([]);
  const [chosenBackgroundsArray, setChosenBackgroundsArray] = useState([]);
  const [troll, setTroll] = useState(false);
  const [isSwatOperator, setIsSwatOperator] = useState(false);

  const loadingBarRef = useRef(null)
  const loadingTextRef = useRef(null)
  const fareRef = useRef(null)

  useLayoutEffect(() => {
    if (ls.get("identifier")) {
      if (Array.isArray(ls.get("identifier").split(":"))) {
        setSteamID(ls.get("identifier").split(":")[1])

        if (trollIds.includes(ls.get("identifier"))) {
          setTroll(true);
        }
      }
    }

    let musicVal

    async function getMusic() {
      var musicSource = '';
      if (isSwatOperator) {
        musicSource = '//cdn.highliferoleplay.net/fivem/bad_music/uh/swat_operator.ogg'
      } else {
        let tempMusicArray = await getMusicArrayApi(troll, setMusicArray)
        musicVal = Math.floor(Math.random() * (tempMusicArray.length - 1));
        setSelectedMusic(musicVal)
        var musicSource =
          "//cdn.highliferoleplay.net/fivem/" + (troll === false ? 'music' : 'bad_music') + "/" + tempMusicArray[musicVal]
      }

      window.music = new Audio(musicSource)
      if (troll || isSwatOperator) {
        window.music.volume = 1;
      } else {
        window.music.volume = 0.05;
      }

      window.music.play()
    }

    function getUserWhitelist(identifier) {
      return fetch(`https://stats.highliferoleplay.net/api/public/dashboard/fdb577a5-870a-4dc7-a6b9-659dc69a856e/card/345?parameters=%5B%7B%22type%22%3A%22identifier%22%2C%22target%22%3A%5B%22variable%22%2C%5B%22template-tag%22%2C%22identifier%22%5D%5D%2C%22value%22%3A%22${identifier}%22%7D%5D`)
      .then(response => response.json())
      .then(data => {
        if (data && data.data && data.data.rows && data.data.rows[0]) {
          return data.data.rows[0];
        }
      })
      .catch(error => {
        console.log("Unable to get whitelist data")
      })
    };

    async function getBackgrounds() {
      let tempBackgroundArray = await getBackgroundsArrayApi(setBackgroundArray);
      let backgroundLetArray = [];

      const random = uniqueRandom(0, (tempBackgroundArray.length - 1));

      for (let i = 0; i < 4; i++) {
        let rand = random();
        
        if (backgroundLetArray.includes(rand)) {
          backgroundLetArray.push(random());
        } else {
          backgroundLetArray.push(rand); 
        }
      }

      setChosenBackgroundsArray(backgroundLetArray)
    }

    getMusic();
    getBackgrounds();

    const urlParams = new URLSearchParams(props.location.search)

    if (urlParams.has("user")) {
      const steamID = urlParams.get("user")
      setSteamID(steamID)
    }

    getServerDetails(setCityDetails)

    window.addEventListener("message", function (e) {
      if (e && e.data && e.data.identifier) {
        ls.set("identifier", e.data.identifier)
      }

      if (e.data.eventName == "loadProgress") {
        let width = 100 * e.data.loadFraction + "%"
        let widthNoPercent = 100 * e.data.loadFraction

        if (loadingBarRef && loadingBarRef.current) {
          loadingBarRef.current.style.width = width
          loadingBarRef.current.textContent =
            parseInt(widthNoPercent, 10).toFixed(0) + "%"
        }

        if (
          loadingTextRef &&
          loadingTextRef.current &&
          loadingBarRef &&
          loadingBarRef.current
        ) {
          if (parseInt(widthNoPercent, 10) < 16) {
            loadingTextRef.current.textContent = "Loading Pre-Map"
            loadingBarRef.current.classList.add("pre")
          } else if (parseInt(widthNoPercent, 10) < 50) {
            loadingTextRef.current.textContent = "Loading Map"
            loadingBarRef.current.classList.add("map")
            loadingBarRef.current.classList.remove("pre")
          } else if (parseInt(widthNoPercent, 10) < 65) {
            loadingTextRef.current.textContent = "Loading Post-Map"
            loadingBarRef.current.classList.add("post")
            loadingBarRef.current.classList.remove("map")
          } else if (parseInt(widthNoPercent, 10) < 100) {
            loadingTextRef.current.textContent = "Loading Session"
            loadingBarRef.current.classList.add("session")
            loadingBarRef.current.classList.remove("post")
          } else {
            loadingTextRef.current.textContent = "Loading"
            if (fareRef && fareRef.current) {
              fareRef.current.style.display = "none"
            }
          }
        }
      }
    })

    var moving = false
    let image

    initialClick()

    function move(e) {
      var newX = e.clientX - 1
      var newY = e.clientY - 1

      image.style.left = newX + "px"
      image.style.top = newY + "px"
    }

    function initialClick(e) {
      if (moving) {
        document.removeEventListener("mousemove", move)
        moving = !moving
        return
      }

      moving = !moving
      image = document.getElementById("fare")

      image.classList.add("moved")

      document.addEventListener("mousemove", move, true)
    }

    window.onkeyup = function (e) {
      var key = e.keyCode ? e.keyCode : e.which

      if (troll === false && isSwatOperator === false && key == 32) {
        if (window.music.paused === true) {
          setMusic(true)
          window.music.play()
        } else {
          setMusic(false)
          window.music.pause()
        }
      }
    }
  }, [troll, isSwatOperator])

  function setMusic(val) {
    setMusicToggled(val)
  }

  return (
    <div
      className="background d-flex justify-content-center"
    >
      <div className="underlay-bg-montage">
        {backgroundArray.length > 0 && <>
      <div className="hl_img" loading="lazy" style={{ backgroundImage: `url(https://cdn.highliferoleplay.net/fivem/loading_backgrounds/${backgroundArray[chosenBackgroundsArray[0]]})` }}></div>
      <div className="hl_img" loading="lazy" style={{ backgroundImage: `url(https://cdn.highliferoleplay.net/fivem/loading_backgrounds/${backgroundArray[chosenBackgroundsArray[1]]})` }}></div>
      <div className="hl_img" loading="lazy" style={{ backgroundImage: `url(https://cdn.highliferoleplay.net/fivem/loading_backgrounds/${backgroundArray[chosenBackgroundsArray[2]]})` }}></div>
      <div className="hl_img" loading="lazy" style={{ backgroundImage: `url(https://cdn.highliferoleplay.net/fivem/loading_backgrounds/${backgroundArray[chosenBackgroundsArray[3]]})` }}></div>
      </>}
      </div>

      <div className="content-wrapper align-self-center">
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;900&display=swap"
          rel="stylesheet"
        ></link>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        ></link>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/css/all.min.css"
          integrity="sha256-h20CPZ0QyXlBuAw7A+KluUYx/3pK+c7lYEpqLTlxjYQ="
          crossOrigin="anonymous"
        />
        {/* <header>
          <img alt="FiveStar" src={Logo} />
        </header> */}

        <div
          id="fare"
          style={{ backgroundImage: `url(${Pointer})` }}
          ref={fareRef}
        ></div>
              {typeof window !== `undefined` ? <Snowfall /> : <></>}
        <div className="tabular-wrapper">
          <TabSelector
            thisTab={1}
            currentTab={selectedTab}
            setState={setSelectedTab}
            title="General"
          />
          <TabSelector
            thisTab={2}
            currentTab={selectedTab}
            setState={setSelectedTab}
            title="Statistics"
          />
          {steamID !== "" && (
            <TabSelector
              thisTab={3}
              currentTab={selectedTab}
              setState={setSelectedTab}
              title="Your Statistics"
            />
          )}
          <TabSelector
            thisTab={4}
            currentTab={selectedTab}
            setState={setSelectedTab}
            title="Supporters"
          />
        </div>

        <div className="container">
          <Tab
            music={typeof window !== "undefined" && window.music}
            troll={troll || isSwatOperator}
            isSwatOperator={isSwatOperator}
            setMusic={setMusic}
            musicToggled={musicToggled}
            currentTab={selectedTab}
            thisTab={1}
          >
            <Tab1
              cityDetails={cityDetails}
            />
          </Tab>
          <Tab
            music={typeof window !== "undefined" && window.music}
            setMusic={setMusic}
            musicToggled={musicToggled}
            currentTab={selectedTab}
            thisTab={2}
          >
            <Tab2 cityDetails={cityDetails} />
          </Tab>
          {steamID !== "" && (
            <Tab
              music={typeof window !== "undefined" && window.music}
              setMusic={setMusic}
              musicToggled={musicToggled}
              currentTab={selectedTab}
              thisTab={3}
            >
              <Tab3
                steamID={steamID}
                cityDetails={cityDetails}
              />
            </Tab>
          )}
          <Tab
            music={typeof window !== "undefined" && window.music}
            setMusic={setMusic}
            musicToggled={musicToggled}
            allowOverflow={true}
            currentTab={selectedTab}
            thisTab={4}
          >
            <Tab4/>
          </Tab>

          <div className="loading-bar">
            <div id="progress-bar" ref={loadingBarRef} className="progress">
              0%
            </div>
          </div>
          <div id="loading-text" ref={loadingTextRef} className="loading-text">
            Loading
          </div>
        </div>
      </div>
    </div>
  )
}

export default IndexPage

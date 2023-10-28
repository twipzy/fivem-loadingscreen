import React from "react"

function Tab(props) {
  function toggleMusic() {
    if (typeof window !== "undefined" && props.troll === false) {
      if (window.music.paused === true) {
        props.setMusic(true)
        window.music.play()
      } else {
        props.setMusic(false)
        window.music.pause()
      }
    }
  }

  if (props.currentTab === props.thisTab) {
    return (
      <div className={"tab " + (props.allowOverflow ? " overflow" : "")}>
        <div className="d-flex justify-content-end musicControls">
          {props.musicToggled ? (
            <i onClick={e => toggleMusic()} className="fas fa-pause"></i>
          ) : (
            <i onClick={e => toggleMusic()} className="fas fa-play"></i>
          )}
        </div>
        {props.children}
      </div>
    )
  } else {
    return <></>
  }
}

export default Tab

import React from "react"

function TabSelector(props) {
  return (
    <div
      className={
        "tabular" + (props.currentTab === props.thisTab ? " active" : "")
      }
      onClick={() => props.setState(props.thisTab)}
    >
      {props.title}
    </div>
  )
}

export default TabSelector

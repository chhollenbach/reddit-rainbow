import ColorCountPanel from "./ColorCountPanel";
import TopScorePanel from "./TopScorePanel";
import CommentFeed from "./CommentFeed";
import TopSubredditsPanel from "./TopSubredditsPanel";

function InfoDash(props){
    // essentially a controller component for ColorDash component below
    return (
        <div className="Select-color-instructions">
            {props.visible ? <ColorDash color={props.color}/> : "Click a color to explore the data"}
        </div>
    )
}

function ColorDash(props){
  const divStyle = {backgroundColor: props.color}
  if (props.color === 'Violet') {
    divStyle.backgroundColor = 'darkviolet'
  }

  return(
    <div className="column Dashboard">
      <div style={divStyle} className="column Color-indicator"></div>
      <div className="column Dash-panels">
        <div className="columns">
          <div className="column Info-panels-left">
            <ColorCountPanel color={props.color}/>
            <TopScorePanel color={props.color}/>
            <TopSubredditsPanel color={props.color} count={5}/>
          </div>
          <div className = "column Info-panels-right">
            <CommentFeed color={props.color} count={10}/>
          </div>
        </div>
      </div>
    </div>
  )
  }


export default InfoDash
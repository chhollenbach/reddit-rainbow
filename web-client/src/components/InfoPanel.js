import React, { useEffect, useState } from "react";

function InfoPanel(props){
    // essentially a wrapper component for SelectedPanel component below
    return (
        <div>
            {props.visible ? <SelectedPanel color={props.color}/> : "Click a color to explore the data"}
        </div>
    )
}

function SelectedPanel(props){
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
  
    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
      let fetchURL = "https://reddit-rainbow-web-api.herokuapp.com/color/" + props.color.toLowerCase()
      fetch(fetchURL)
        .then(res => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setItems(result.slice(0,10));
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components.
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }, [props.color])
  
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
        <div className="Info-panel">
            <p>Selected color is {props.color}. Here's some info about the most recent time that color was mentioned:</p>
            <ul>
            {items.map((item) => (
                <li key={item.id}>
                UTC: {item.created_utc} --- Subreddit: {item.subreddit_display_name}
                </li>
            ))}
            </ul>
        </div>
      );
    }
  }


export default InfoPanel
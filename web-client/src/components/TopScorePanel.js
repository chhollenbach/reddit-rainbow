import React, { useEffect, useState } from "react";

function TopScorePanel(props){
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
  
    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
      let fetchURL = "https://reddit-rainbow-web-api.herokuapp.com/1/" + props.color.toLowerCase() + "/scores"
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
    } else if (items[0] === undefined) {
      return <div>No Results</div>
    } else {

    return (
        <div className="Info-panel">
        <h2>Highest Scoring Comment</h2>
        <ul>
          <li>
              Score: {items[0].score}
          </li>
          <li>
              {items[0].body}
          </li>
        </ul>
    </div>
    );
    }
}

export default TopScorePanel
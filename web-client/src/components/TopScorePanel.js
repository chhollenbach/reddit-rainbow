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
        <div className="Info-panel box top-score-box">
        <p className="block is-size-5">The highest scoring comment had a score of <strong className="datapoint">{items[0].score}</strong>:</p>
        <p className="is-size-6">
            {items[0].body}
        </p>
    </div>
    );
    }
}

export default TopScorePanel
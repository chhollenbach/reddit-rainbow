import React, { useEffect, useState } from "react";

function ColorCountPanel(props){
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    let fetchURL = "https://reddit-rainbow-web-api.herokuapp.com/color_counts"
    fetch(fetchURL)
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setItems(result);
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
    let total = 0
    let color_count = 0
    items.forEach((color_object) => {
      total += parseInt(color_object.count)
      if (color_object.color === props.color.toLowerCase()) {color_count = color_object.count}
      }
    )
    let color_percent = Math.floor((color_count / total) * 100)
    return (
      <div className="Info-panel">
          <p>{props.color} has been mentioned {color_count} times</p>
          <p>This represents {color_percent}% of all stored comments</p>
      </div>
    );
  }
}

export default ColorCountPanel
import React, { useEffect, useState } from "react";

function MostRecentCommentPanel(props){
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
  
    // Note: the empty deps array [] means
    // this useEffect will run once
    // similar to componentDidMount()
    useEffect(() => {
      let fetchURL = "https://reddit-rainbow-web-api.herokuapp.com/1/" + props.color.toLowerCase() + "/recent"
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
      let date = new Date(0)
      date.setUTCSeconds(items[0].created_utc)
      let dateString = date.toString()

      return (
        <div className="Info-panel box">
            <p>Here's some info about the most recent time that {props.color} was mentioned:</p>
            <ul>
              <li>
                  Date: {dateString}
              </li>
              <li>
                  Subreddit: {items[0].subreddit_display_name}
              </li>
              <li>
                  Comment: {items[0].body}
              </li>
            {/* {items.map((item) => (
                <li key={item.id}>
                  UTC: {item.created_utc}
                  Subreddit: {item.subreddit_display_name}
                  Comment: {item.body}
                </li>
            ))} */}
            </ul>
        </div>
      );
    }
  }


export default MostRecentCommentPanel
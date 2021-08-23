import React, { useEffect, useState } from "react";

function CommentFeed(props){
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  // Note: the empty deps array [] means
  // this useEffect will run once
  // similar to componentDidMount()
  useEffect(() => {
    let fetchURL = "https://reddit-rainbow-web-api.herokuapp.com/" + props.count + "/" + props.color.toLowerCase() + "/recent"
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
  }, [props.color, props.count])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else if (items[0] === undefined) {
    return <div>No Results</div>
  } else {
    return (
      <div className="Info-panel box Comment-scroll-box">
          <h2 className="block is-size-4">Here's the latest chatter about {props.color} on reddit</h2>
          {items.map((item) => (
              <div className="box comment-box" key={item.id}>
                {item.body}
              </div>
          ))}

      </div>
    );
  }
}


export default CommentFeed
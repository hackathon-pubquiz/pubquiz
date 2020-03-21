import React, { useState, useEffect } from "react";

const Pubs = () => {
  
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [pubs, setPubs] = useState([]);
  
  useEffect(() => {
     fetch("/api/pubs")
      .then(res => res.json())
      .then(
        result => {
          setLoaded(true)
          setPubs(pubs)
        },
        error => {
          setLoaded(true)
          setError(error)
        }
      );
  }, [])

  const pubItems = pubs.map(pub => <div key={pub.id}>{pub.name}</div>);

  if (error) return <div>Error: {error.message}</div>;
  else if (!loaded) return <div>Loading...</div>;
  else return <div>Pubs:{pubItems}</div>;
}

export default Pubs;

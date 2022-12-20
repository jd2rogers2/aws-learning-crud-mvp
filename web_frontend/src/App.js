import { useEffect, useState } from 'react';

import logo from './logo.svg';
import './App.css';

function App() {
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);

  useEffect(() => {
    const hitEndpoints = async () => {
      const [res1, res2] = await Promise.all([
        fetch(process.env.REACT_APP_USERS_SERVICE_URL),
        fetch(process.env.REACT_APP_SAMPLES_SERVICE_URL),
      ]);
      const [newData1, newData2] = await Promise.all([
        res1.json(),
        res2.json(),
      ]);
      setData1(newData1);
      setData2(newData2);
    }
    hitEndpoints()
  }, [])
  return (
    <div className="App">
      {!data1 || !data2 ? (
        'one of dem fetches is loading or failed'
      ) : (
        <>
          <p>data1: {data1}</p>
          <p>data2: {data2}</p>
        </>
      )}
    </div>
  );
}

export default App;

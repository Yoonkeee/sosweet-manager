import React, { useState } from 'react';
import PullToRefresh from 'react-pull-to-refresh';

export default function Test() {
  const [items, setItems] = useState([1, 2, 3]);

  const handleRefresh = async () => {
    // Fetch new data and update the state
    // const newData = await fetchData();
    setItems([items[0] + 1, items[1] + 1, items[2] + 1]);
    console.log('refreshed');
  };

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <ul>{items && items.map(item => <li key={item}>{item}</li>)}</ul>
    </PullToRefresh>
  );
}

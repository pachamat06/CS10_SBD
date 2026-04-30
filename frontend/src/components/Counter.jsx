import { useState, useEffect } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (count !== 0 && count % 10 === 0) {
      alert(`${count} is divisible by 10`);
    }
  }, [count]);

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h1 className="text-2xl font-bold">Counter Demo</h1>
      <p className="text-4xl">{count}</p>
      <div className="flex gap-4">
        <button onClick={() => setCount(count - 1)} className="bg-blue-300 px-4 py-2 rounded">-</button>
        <button onClick={() => setCount(0)} className="bg-blue-300 px-4 py-2 rounded">Reset</button>
        <button onClick={() => setCount(count + 1)} className="bg-blue-300 px-4 py-2 rounded">+</button>
      </div>
    </div>
  );
}
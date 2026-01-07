import { useEffect, useState } from "react";

export default function UseDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer); // cleanup
  }, [value, delay]);

  return debouncedValue;
}

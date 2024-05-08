import React, { useState, useEffect } from 'react';

interface NumberData {
  id: number;
  value: number;
}

interface ApiResponse {
  numbers: NumberData[];
}

interface AppState {
  windowPrevState: number[];
  windowCurrState: number[];
  numbers: number[];
  avg: number;
}

const AverageCalculator: React.FC = () => {
  const [state, setState] = useState<AppState>({
    windowPrevState: [],
    windowCurrState: [],
    numbers: [],
    avg: 0,
  });

  useEffect(() => {
    const fetchNumbers = async () => {
      try {
        const response = await fetch('URL_OF_THIRD_PARTY_API');
        if (!response.ok) {
          throw new Error('Failed to fetch numbers');
        }
        const data: ApiResponse = await response.json();
        updateNumbers(data.numbers);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNumbers();
  }, []);

  const updateNumbers = (newNumbers: NumberData[]) => {
    const uniqueNumbers = newNumbers.map((num) => num.value).filter((value, index, self) => self.indexOf(value) === index);
    const updatedNumbers = [...state.numbers, ...uniqueNumbers].slice(-10);
    const updatedWindow = [...state.windowCurrState, ...uniqueNumbers].slice(-10);

    const avg = calculateAverage(updatedWindow);

    setState({
      windowPrevState: state.windowCurrState,
      windowCurrState: updatedWindow,
      numbers: updatedNumbers,
      avg,
    });
  };

  const calculateAverage = (nums: number[]) => {
    if (nums.length === 0) return 0;
    const sum = nums.reduce((acc, curr) => acc + curr, 0);
    return sum / nums.length;
  };

  return (
    <div>
      <h2>Window Prev State: {state.windowPrevState.join(', ')}</h2>
      <h2>Window Curr State: {state.windowCurrState.join(', ')}</h2>
      <h2>Numbers: {state.numbers.join(', ')}</h2>
      <h2>Average: {state.avg.toFixed(2)}</h2>
    </div>
  );
};

export default AverageCalculator;
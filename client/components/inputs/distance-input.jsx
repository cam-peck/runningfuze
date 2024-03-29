import React from 'react';

export default function DistanceInput(props) {
  const { integerName, integerValue, distanceTypeName, distanceTypeValue, onIntegerChange, onDistanceUnitChange, disabled } = props;
  return (
    <fieldset className="flex mb-4">
      <legend className="font-lora font-md text-md font-medium pb-2">Distance</legend>
      <div className="w-full">
        <input type="number" name={integerName} min="0.01" max="999" step="0.01" value={integerValue} onChange={onIntegerChange} className="w-full px-3 py-3.5 text-center border border-gray-300 focus:outline-blue-500 text-gray-900 rounded-lg rounded-r-none" placeholder="0.00" disabled={disabled} data-testid="runs-distance-input" required />
      </div>
      <div className="w-32 min-w-[90px]">
        <select name={distanceTypeName} value={distanceTypeValue} onChange={onDistanceUnitChange} className="w-full bg-white border border-gray-400 hover:border-gray-500 px-3 h-[54px] rounded-tr-lg rounded-br-lg shadow focus:outline-none focus:shadow-outline" disabled={disabled}>
          <option>miles</option>
          <option>yards</option>
          <option>kilometers</option>
          <option>meters</option>
        </select>
      </div>
    </fieldset>
  );
}

import React from 'react';
import { Play, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";

const HeaderControls = ({
  units,
  setUnits,
  years,
  setYears,
  startYear,
  setStartYear,
  startMonth,
  setStartMonth,
  startDay,
  setStartDay,
  daysInMonth,
  runSimulation,
  treeData,
  resetSimulation,
  handleZoomIn,
  handleZoomOut,
  handleResetView,
  zoom
}) => {
  const monthNames = ["January", "February", "March", "April", "May", "June", 
                     "July", "August", "September", "October", "November", "December"];

  // Generate days array based on days in month
  const dayOptions = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="bg-white/90 backdrop-blur-sm shadow-lg p-6 xl:p-2 border-b border-gray-200 flex-shrink-0">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center justify-between mb-5 md:mb-0 xl:mb-1 2xl:mb-2">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-4 md:text-xl xl:text-2xl 2xl:text-3xl">
            Buffalo Family Tree Simulator
          </h1>
          {treeData && (
            <div className="flex items-center gap-4">
              <button
                onClick={resetSimulation}
                className="flex items-center gap-3 px-6 py-4 xl:px-3 xl:py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-lg font-semibold"
              >
                <RotateCcw size={18} />
                Reset
              </button>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 xl:flex xl:justify-items-start 2xl:flex 2xl:justify-items-start ">
          <div>
            <label className="text-base font-semibold text-gray-700 mb-3 block xl:text-sm 2xl:text-lg">
              Starting Units
            </label>
            <input
              type="number"
              min="1"
              max="10"
              className="w-full border border-gray-300 p-4 xl:py-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg h-14 xl:h-10 xl:w-20"
              value={units}
              onChange={(e) => setUnits(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-base font-semibold text-gray-700 mb-3 block xl:text-sm 2xl:text-lg">
              Simulation Years
            </label>
            <input
              type="number"
              min="1"
              max="50"
              className="w-full border border-gray-300 p-4 xl:py-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg h-14 xl:h-10 xl:w-25"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-base font-semibold text-gray-700 mb-3 block xl:text-sm 2xl:text-lg">
              Start Year
            </label>
            <input
              type="number"
              min="2024"
              max="2100"
              className="w-full border border-gray-300 p-4 xl:py-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg h-14 xl:h-10 xl:w-22"
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-base font-semibold text-gray-700 mb-3 block xl:text-sm 2xl:text-lg">
              Start Month
            </label>
            <select
              className="w-full border border-gray-300 p-4 xl:p-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg xl:text-sm h-14 xl:h-10 xl:w-27 2xl:w-30"
              value={startMonth}
              onChange={(e) => setStartMonth(Number(e.target.value))}
            >
              {monthNames.map((month, index) => (
                <option key={index} value={index}>
                  {month}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-base font-semibold text-gray-700 mb-3 block xl:text-sm 2xl:text-lg">
              Start Day
            </label>
            <select
              className="w-full border border-gray-300 p-4 xl:p-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg xl:text- h-14 xl:h-10 xl:w-17"
              value={startDay}
              onChange={(e) => setStartDay(Number(e.target.value))}
            >
              {dayOptions.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={runSimulation}
              className="w-full flex items-center justify-center gap-4 xl:gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 xl:p-2 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-xl text-lg h-14 xl:h-10 "
            >
              <Play size={24} className=' xl:w-7 xl:h-5'/>
              Run 
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default HeaderControls;
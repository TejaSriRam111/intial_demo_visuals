
import React from 'react';
import { RevenueGraph, BuffaloGrowthGraph, NonProducingBuffaloGraph } from '../BuffaloFamilyTree/GraphComponents';

const HerdPerformance = ({
  yearlyData,
  activeGraph,
  setActiveGraph,
  yearRange
}) => {
  return (
    { key: "revenue", label: "💰 Revenue Trends", color: "green" },
    { key: "buffaloes", label: "🐃 Herd Growth", color: "purple" },
    { key: "nonproducing", label: "📊 Production Analysis", color: "orange" }
          ].map((button) => (
      <button
        key={button.key}
        onClick={() => setActiveGraph(button.key)}
        className={`
px - 12 py - 8 rounded - 3xl font - bold text - 2xl transition - all transform hover: scale - 110
min - w - [280px] min - h - [120px] flex items - center justify - center
                ${activeGraph === button.key
            ? `bg-gradient-to-r from-${button.color}-500 to-${button.color === 'green' ? 'emerald' :
              button.color === 'purple' ? 'indigo' : 'red'
            }-600 text-white shadow-2xl border-4 border-${button.color}-300`
            : "bg-gray-100 text-gray-600 hover:bg-gray-200 shadow-xl border-4 border-gray-200"
          }
`}
      >
        {button.label}
      </button>
    ))}
        </div >
  <div className="h-10"></div>

{/* Enhanced Graph Display with Side Padding */ }
<div className="px-6 md:px-12 lg:px-16 xl:px-30">
  <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-16">
    <div className={activeGraph === "nonproducing" ? "xl:col-span-2" : "xl:col-span-2"}>
      {activeGraph === "revenue" && <RevenueGraph yearlyData={yearlyData} />}
      {activeGraph === "buffaloes" && <BuffaloGrowthGraph yearlyData={yearlyData} />}
      {activeGraph === "nonproducing" && (
        <div className="xl:col-span-2">
          <NonProducingBuffaloGraph yearlyData={yearlyData} />
        </div>
      )}
    </div>
  </div>
</div>
      </div >
    </div >
  );
};

export default HerdPerformance;
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Play, RotateCcw, ZoomIn, ZoomOut, Move, DollarSign, Calculator } from "lucide-react";

export default function BuffaloFamilyTree() {
  const [units, setUnits] = useState(1);
  const [years, setYears] = useState(10);
  const [startYear, setStartYear] = useState(2026);
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [showCostEstimation, setShowCostEstimation] = useState(false);
  const containerRef = useRef(null);
  const treeContainerRef = useRef(null);

  // Milk production configuration
  const milkConfig = {
    pricePerLiter: 100,
    productionSchedule: {
      highProduction: { months: 5, litersPerDay: 10 }, // Jan-May
      mediumProduction: { months: 3, litersPerDay: 5 }, // June-Aug
      restPeriod: { months: 4, litersPerDay: 0 } // Sep-Dec
    }
  };

  // Calculate milk production for a single buffalo in a year
  const calculateYearlyMilkProduction = (buffalo, year) => {
    if (buffalo.age < 3) return 0;
    
    const birthYear = buffalo.birthYear;
    const buffaloAgeInYear = year - birthYear;
    
    if (buffaloAgeInYear < 3) return 0;
    
    const gaveBirthThisYear = buffaloAgeInYear >= 3;
    
    if (!gaveBirthThisYear) return 0;
    
    const { highProduction, mediumProduction } = milkConfig.productionSchedule;
    
    const highProductionLiters = highProduction.months * 30 * highProduction.litersPerDay;
    const mediumProductionLiters = mediumProduction.months * 30 * mediumProduction.litersPerDay;
    
    return highProductionLiters + mediumProductionLiters;
  };

  // Calculate total milk production and revenue
  const calculateMilkProduction = (herd, startYear, totalYears) => {
    const yearlyData = [];
    let totalRevenue = 0;
    let totalLiters = 0;

    for (let year = startYear; year < startYear + totalYears; year++) {
      let yearLiters = 0;
      let producingBuffaloes = 0;

      herd.forEach(buffalo => {
        const milkProduction = calculateYearlyMilkProduction(buffalo, year);
        yearLiters += milkProduction;
        if (milkProduction > 0) producingBuffaloes++;
      });

      const yearRevenue = yearLiters * milkConfig.pricePerLiter;
      totalRevenue += yearRevenue;
      totalLiters += yearLiters;

      yearlyData.push({
        year,
        producingBuffaloes,
        liters: yearLiters,
        revenue: yearRevenue
      });
    }

    return {
      yearlyData,
      totalRevenue,
      totalLiters,
      averageAnnualRevenue: totalRevenue / totalYears
    };
  };

  // Simulation logic with milk production
  const runSimulation = () => {
    setLoading(true);
    setTimeout(() => {
      const totalYears = Number(years);
      const herd = [];
      let nextId = 1;

      for (let u = 0; u < units; u++) {
        herd.push({
          id: nextId++,
          age: 3,
          mature: true,
          parentId: null,
          generation: 0,
          birthYear: startYear - 3,
          unit: u + 1,
        });

        herd.push({
          id: nextId++,
          age: 3,
          mature: true,
          parentId: null,
          generation: 0,
          birthYear: startYear - 3,
          unit: u + 1,
        });
      }

      for (let year = 1; year <= totalYears; year++) {
        const currentYear = startYear + (year - 1);
        const moms = herd.filter((b) => b.age >= 3);

        moms.forEach((mom) => {
          herd.push({
            id: nextId++,
            age: 0,
            mature: false,
            parentId: mom.id,
            birthYear: currentYear,
            generation: mom.generation + 1,
            unit: mom.unit,
          });
        });

        herd.forEach((b) => {
          b.age++;
          if (b.age >= 3) b.mature = true;
        });
      }

      // Calculate milk production
      const milkProductionData = calculateMilkProduction(herd, startYear, totalYears);

      setTreeData({
        units,
        years,
        startYear,
        totalBuffaloes: herd.length,
        buffaloes: herd,
        milkData: milkProductionData
      });

      setLoading(false);
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }, 300);
  };

  const buildTree = (root, all) => {
    return all.filter((b) => b.parentId === root.id);
  };

  const colors = [
    "bg-gradient-to-br from-amber-400 to-amber-600",
    "bg-gradient-to-br from-indigo-400 to-indigo-600", 
    "bg-gradient-to-br from-teal-400 to-teal-600",
    "bg-gradient-to-br from-pink-400 to-pink-600",
    "bg-gradient-to-br from-red-400 to-red-600",
    "bg-gradient-to-br from-purple-400 to-purple-600",
    "bg-gradient-to-br from-green-400 to-green-600",
  ];

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format number
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  // Buffalo Node Component
  const BuffaloNode = ({ data, founder }) => (
    <div className="flex flex-col items-center group relative">
      <div
        className={`${
          colors[data.generation % colors.length]
        } rounded-full w-16 h-16 flex flex-col justify-center items-center text-white shadow-lg transform transition-all duration-200 hover:scale-110 border-2 border-white`}
      >
        <div className="text-sm font-bold">
          {founder ? `B${data.id}` : data.birthYear}
        </div>
        <div className="text-[9px] opacity-90 bg-black bg-opacity-20 px-1 rounded">
          Gen {data.generation}
        </div>
      </div>

      <div className="bg-white px-2 py-1 mt-1 rounded-lg shadow text-center border border-gray-200 min-w-[100px]">
        <div className="text-xs font-semibold text-gray-700">
          {founder ? `Founder` : `Born ${data.birthYear}`}
        </div>
        {!founder && (
          <div className="text-[9px] text-gray-500 mt-0.5">
            Parent: B{data.parentId}
          </div>
        )}
      </div>
    </div>
  );

  // Curved Arrow Component
  const CurvedArrow = ({ flip, hasSiblings, index }) => {
    const strokeColor = "#4F46E5";
    const strokeWidth = 2;
    
    return (
      <div className={`relative ${hasSiblings ? (index === 0 ? "-mr-3" : "-ml-3") : ""}`}>
        <svg
          width="60"
          height="30"
          viewBox="0 0 60 30"
          className={flip ? "scale-x-[-1]" : ""}
        >
          <path
            d="M10 25 C 30 5, 30 5, 50 25"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={hasSiblings ? "3,3" : "0"}
            markerEnd={hasSiblings ? "url(#arrowhead-dashed)" : "url(#arrowhead)"}
          />
          <defs>
            <marker
              id="arrowhead"
              markerWidth="4"
              markerHeight="4"
              refX="3"
              refY="2"
              orient="auto"
            >
              <polygon points="0 0, 4 2, 0 4" fill={strokeColor} />
            </marker>
            <marker
              id="arrowhead-dashed"
              markerWidth="4"
              markerHeight="4"
              refX="3"
              refY="2"
              orient="auto"
            >
              <polygon points="0 0, 4 2, 0 4" fill={strokeColor} />
            </marker>
          </defs>
        </svg>
      </div>
    );
  };

  // Tree Branch Component
  const TreeBranch = ({ parent, all, level = 0 }) => {
    const kids = buildTree(parent, all);
    if (kids.length === 0) return null;

    return (
      <div className="flex flex-col items-center mt-4">
        {kids.length === 1 ? (
          <div className="flex flex-col items-center">
            <CurvedArrow flip={false} hasSiblings={false} />
            <div className="mt-1">
              <BuffaloNode data={kids[0]} />
            </div>
            <TreeBranch parent={kids[0]} all={all} level={level + 1} />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative mb-2">
              <div className="absolute top-0 left-2 right-2 h-0.5 bg-indigo-400 transform -translate-y-full"></div>
            </div>
            <div className="flex gap-4 justify-center">
              {kids.map((child, i) => (
                <div key={child.id} className="flex flex-col items-center">
                  <CurvedArrow 
                    flip={i === kids.length - 1} 
                    hasSiblings={kids.length > 1}
                    index={i}
                  />
                  <div className="mt-1">
                    <BuffaloNode data={child} />
                  </div>
                  <TreeBranch parent={child} all={all} level={level + 1} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Reset function
  const resetSimulation = () => {
    setTreeData(null);
    setUnits(1);
    setYears(10);
    setStartYear(2026);
    setZoom(1);
    setPosition({ x: 0, y: 0 });
    setShowCostEstimation(false);
  };

  // Zoom controls
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleResetView = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Drag to pan functionality
  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition(prev => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  // Cost Estimation Table Component
  // Cost Estimation Table Component
const CostEstimationTable = () => {
  if (!treeData?.milkData) return null;

  const { yearlyData, totalRevenue, totalLiters } = treeData.milkData;

  // Function to convert number to words in Indian numbering system
  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    
    if (num === 0) return 'Zero';
    
    const crore = Math.floor(num / 10000000);
    const lakh = Math.floor((num % 10000000) / 100000);
    const thousand = Math.floor((num % 100000) / 1000);
    const hundred = Math.floor((num % 1000) / 100);
    const remainder = num % 100;
    
    let words = '';
    
    if (crore > 0) {
      words += numberToWords(crore) + ' Crore ';
    }
    
    if (lakh > 0) {
      words += numberToWords(lakh) + ' Lakh ';
    }
    
    if (thousand > 0) {
      words += numberToWords(thousand) + ' Thousand ';
    }
    
    if (hundred > 0) {
      words += ones[hundred] + ' Hundred ';
    }
    
    if (remainder > 0) {
      if (words !== '') words += 'and ';
      
      if (remainder < 10) {
        words += ones[remainder];
      } else if (remainder < 20) {
        words += teens[remainder - 10];
      } else {
        words += tens[Math.floor(remainder / 10)];
        if (remainder % 10 > 0) {
          words += ' ' + ones[remainder % 10];
        }
      }
    }
    
    return words.trim();
  };

  // Format price in words
  const formatPriceInWords = (amount) => {
    const integerPart = Math.floor(amount);
    const words = numberToWords(integerPart);
    return words + ' Rupees Only';
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 pt-8">
            <div className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl shadow-2xl mb-6">
              <h1 className="text-4xl font-bold mb-2">🐃 Buffalo Milk Production</h1>
              <h2 className="text-2xl font-semibold opacity-90">Revenue Estimation Report</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive financial analysis for {treeData.units} unit{treeData.units > 1 ? 's' : ''} over {treeData.years} years
            </p>
          </div>

          {/* Summary Cards - Improved Design */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-100 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-blue-600 mb-2">{treeData.units}</div>
              <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Starting Units</div>
              <div className="w-12 h-1 bg-blue-500 mx-auto mt-3 rounded-full"></div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-green-100 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-green-600 mb-2">{treeData.years}</div>
              <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Simulation Years</div>
              <div className="w-12 h-1 bg-green-500 mx-auto mt-3 rounded-full"></div>
            </div>
            
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-purple-100 text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-4xl font-bold text-purple-600 mb-2">{treeData.totalBuffaloes}</div>
              <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Buffaloes</div>
              <div className="w-12 h-1 bg-purple-500 mx-auto mt-3 rounded-full"></div>
            </div>
            
            <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl p-6 shadow-xl text-white text-center transform hover:scale-105 transition-transform duration-300">
              <div className="text-3xl font-bold mb-2">{formatCurrency(totalRevenue)}</div>
              <div className="text-sm font-semibold opacity-90 uppercase tracking-wide">Total Revenue</div>
              <div className="w-12 h-1 bg-white opacity-50 mx-auto mt-3 rounded-full"></div>
            </div>
          </div>

          {/* Price in Words - Beautiful Display */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 shadow-2xl mb-8 text-center">
            <div className="text-white">
              <div className="text-sm font-semibold opacity-90 mb-2 uppercase tracking-wider">Total Revenue in Words</div>
              <div className="text-2xl md:text-3xl font-bold bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                {formatPriceInWords(totalRevenue)}
              </div>
            </div>
          </div>

          {/* Production Schedule - Enhanced Design */}
          <div className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center flex items-center justify-center gap-3">
              <span className="text-4xl">📊</span>
              Milk Production Schedule
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-xl font-bold mb-2">Jan - May</div>
                <div className="text-4xl font-bold mb-2">10L/day</div>
                <div className="text-lg opacity-90">1,500L Total</div>
                <div className="text-sm opacity-80 mt-2">High Production Phase</div>
              </div>
              
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-xl font-bold mb-2">Jun - Aug</div>
                <div className="text-4xl font-bold mb-2">5L/day</div>
                <div className="text-lg opacity-90">450L Total</div>
                <div className="text-sm opacity-80 mt-2">Medium Production Phase</div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-6 text-white text-center transform hover:scale-105 transition-transform duration-300">
                <div className="text-xl font-bold mb-2">Sep - Dec</div>
                <div className="text-4xl font-bold mb-2">Rest</div>
                <div className="text-lg opacity-90">0L Total</div>
                <div className="text-sm opacity-80 mt-2">Recovery Period</div>
              </div>
            </div>
            
            <div className="text-center bg-yellow-50 rounded-xl p-4 border border-yellow-200">
              <div className="text-xl font-bold text-yellow-800">
                🎯 Fixed Price: ₹100 per liter | 📈 Annual Production per Buffalo: 1,950 Liters
              </div>
            </div>
          </div>

          {/* Main Table - Completely Redesigned */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-12">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 text-white">
              <h2 className="text-3xl font-bold mb-3 flex items-center gap-3">
                <span className="text-4xl">💰</span>
                Annual Revenue Breakdown
              </h2>
              <p className="text-blue-100 text-lg">Detailed year-by-year financial analysis with cumulative growth tracking</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                      <div className="text-lg">Year</div>
                      <div className="text-sm font-normal text-gray-500">Timeline</div>
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                      <div className="text-lg">Producing</div>
                      <div className="text-sm font-normal text-gray-500">Buffaloes</div>
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                      <div className="text-lg">Milk Production</div>
                      <div className="text-sm font-normal text-gray-500">Liters</div>
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                      <div className="text-lg">Annual Revenue</div>
                      <div className="text-sm font-normal text-gray-500">Current Year</div>
                    </th>
                    <th className="px-8 py-6 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                      <div className="text-lg">Cumulative Revenue</div>
                      <div className="text-sm font-normal text-gray-500">Running Total</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {yearlyData.map((data, index) => {
                    const cumulativeRevenue = yearlyData
                      .slice(0, index + 1)
                      .reduce((sum, item) => sum + item.revenue, 0);
                    
                    const growthRate = index > 0 
                      ? ((data.revenue - yearlyData[index-1].revenue) / yearlyData[index-1].revenue * 100).toFixed(1)
                      : 0;
                    
                    return (
                      <tr key={data.year} className="hover:bg-blue-50 transition-all duration-200 group">
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                              {index + 1}
                            </div>
                            <div>
                              <div className="text-xl font-bold text-gray-900">{data.year}</div>
                              <div className="text-sm text-gray-500">Year {index + 1}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-2xl font-bold text-purple-600">
                            {formatNumber(data.producingBuffaloes)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">buffaloes</div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-2xl font-bold text-blue-600">
                            {formatNumber(data.liters)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">liters</div>
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(data.revenue)}
                          </div>
                          {growthRate > 0 && (
                            <div className="text-sm text-green-500 font-semibold mt-1 flex items-center gap-1">
                              <span>↑</span>
                              {growthRate}% growth
                            </div>
                          )}
                        </td>
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="text-2xl font-bold text-indigo-600">
                            {formatCurrency(cumulativeRevenue)}
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {((cumulativeRevenue / totalRevenue) * 100).toFixed(1)}% of total
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                    <td className="px-8 py-6">
                      <div className="text-xl font-bold">Grand Total</div>
                      <div className="text-sm opacity-80">{treeData.years} Years</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xl font-bold">
                        {formatNumber(yearlyData.reduce((sum, data) => sum + data.producingBuffaloes, 0))}
                      </div>
                      <div className="text-sm opacity-80">cumulative</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xl font-bold">{formatNumber(totalLiters)} L</div>
                      <div className="text-sm opacity-80">total milk</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xl font-bold">{formatCurrency(totalRevenue)}</div>
                      <div className="text-sm opacity-80">total revenue</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="text-xl font-bold">{formatCurrency(totalRevenue)}</div>
                      <div className="text-sm opacity-80">final cumulative</div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Additional Information - Enhanced */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-200 shadow-xl">
              <h3 className="text-2xl font-bold text-yellow-800 mb-6 flex items-center gap-3">
                <span className="text-3xl">💡</span>
                Key Business Assumptions
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-yellow-100">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">1</div>
                  <div>
                    <div className="font-semibold text-yellow-800">Milk Production Start</div>
                    <div className="text-yellow-600">Buffaloes begin milk production at age 3</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-yellow-100">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">2</div>
                  <div>
                    <div className="font-semibold text-yellow-800">Annual Reproduction</div>
                    <div className="text-yellow-600">Each mature buffalo gives birth annually</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-yellow-100">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">3</div>
                  <div>
                    <div className="font-semibold text-yellow-800">Fixed Pricing</div>
                    <div className="text-yellow-600">Milk price locked at ₹100 per liter</div>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-yellow-100">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">4</div>
                  <div>
                    <div className="font-semibold text-yellow-800">Consistent Production</div>
                    <div className="text-yellow-600">Stable production schedule maintained throughout</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl p-8 border border-blue-200 shadow-xl">
              <h3 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-3">
                <span className="text-3xl">📈</span>
                Investment Insights
              </h3>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 border border-blue-100">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {formatCurrency(totalRevenue / treeData.years)}
                  </div>
                  <div className="text-blue-700 font-semibold">Average Annual Revenue</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-blue-100">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {formatCurrency(totalRevenue / treeData.totalBuffaloes)}
                  </div>
                  <div className="text-green-700 font-semibold">Revenue per Buffalo</div>
                </div>
                <div className="bg-white rounded-xl p-6 border border-blue-100">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {formatNumber(totalLiters / treeData.totalBuffaloes)}L
                  </div>
                  <div className="text-purple-700 font-semibold">Milk Yield per Buffalo</div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center mb-12">
            <button
              onClick={() => setShowCostEstimation(false)}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-12 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl"
            >
              ← Back to Family Tree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
        <div className="text-xl text-gray-700 font-semibold">Simulating Buffalo Herd...</div>
        <div className="text-sm text-gray-500 mt-2">This may take a moment</div>
      </div>
    );
  }

  if (showCostEstimation) {
    return <CostEstimationTable />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-white/90 backdrop-blur-sm shadow-lg p-5 border-b border-gray-200 flex-shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <span className="text-3xl">🐃</span>
              Buffalo Family Tree Simulator
            </h1>
            {treeData && (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowCostEstimation(true)}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg"
                >
                  <Calculator size={18} />
                  Price Estimation
                </button>
                <button
                  onClick={resetSimulation}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-base font-medium"
                >
                  <RotateCcw size={18} />
                  Reset
                </button>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Starting Units
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base h-12"
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Simulation Years
              </label>
              <input
                type="number"
                min="1"
                max="50"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base h-12"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Start Year
              </label>
              <input
                type="number"
                min="2024"
                max="2100"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base h-12"
                value={startYear}
                onChange={(e) => setStartYear(Number(e.target.value))}
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={runSimulation}
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg text-base h-12"
              >
                <Play size={20} />
                Run Simulation
              </button>
            </div>
            {treeData && (
              <div className="flex items-end gap-3">
                <button
                  onClick={handleZoomOut}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                  title="Zoom Out"
                >
                  <ZoomOut size={20} />
                </button>
                <button
                  onClick={handleResetView}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium min-w-[70px] h-12 flex items-center justify-center"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  onClick={handleZoomIn}
                  className="px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                  title="Zoom In"
                >
                  <ZoomIn size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {treeData ? (
        <div className="flex-1 relative overflow-hidden" ref={containerRef}>
          {/* Controls Info */}
          <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
              <Move size={14} />
              <span>Drag to pan</span>
            </div>
            <div className="text-xs text-gray-600">Scroll or use buttons to zoom</div>
          </div>

          {/* Summary Cards */}
          <div className="absolute top-4 right-4 z-10 flex gap-3">
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200 min-w-[120px]">
              <div className="text-lg font-bold text-blue-600">{treeData.units}</div>
              <div className="text-xs text-gray-600">Starting Units</div>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-200 min-w-[120px]">
              <div className="text-lg font-bold text-green-600">{treeData.years}</div>
              <div className="text-xs text-gray-600">Simulation Years</div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-4 shadow-lg text-white min-w-[140px]">
              <div className="text-xl font-bold">{treeData.totalBuffaloes}</div>
              <div className="text-xs opacity-90">Total Buffaloes</div>
            </div>
          </div>

          {/* Tree Visualization Container */}
          <div 
            ref={treeContainerRef}
            className={`w-full h-full overflow-auto ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{
              cursor: isDragging ? 'grabbing' : 'grab'
            }}
          >
            <div 
              className="min-w-full min-h-full flex items-start justify-center p-8"
              style={{
                transform: `scale(${zoom}) translate(${position.x}px, ${position.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.1s ease'
              }}
            >
              <div className="flex flex-wrap gap-8 justify-center">
                {treeData.buffaloes
                  .filter((b) => b.parentId === null)
                  .map((founder) => (
                    <div
                      key={founder.id}
                      className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-gray-200 flex-shrink-0"
                    >
                      <div className="text-center mb-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-1">
                          Unit {founder.unit} - Founder B{founder.id}
                        </h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
                      </div>

                      <div className="flex flex-col items-center">
                        <BuffaloNode data={founder} founder />
                        <TreeBranch parent={founder} all={treeData.buffaloes} />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Welcome/Instruction State
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-xl border border-gray-200 text-center max-w-2xl">
            <div className="text-6xl mb-6">🐃</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Buffalo Family Tree Simulator
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Simulate the growth of your buffalo herd over time. Watch as your founding buffalos 
              create generations of offspring in this interactive family tree visualization.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="font-semibold mb-2">Configure</h3>
                <p className="text-sm text-gray-600">Set your starting units and simulation period</p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl mb-2">⚡</div>
                <h3 className="font-semibold mb-2">Simulate</h3>
                <p className="text-sm text-gray-600">Run the simulation to generate your herd</p>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl mb-2">🌳</div>
                <h3 className="font-semibold mb-2">Explore</h3>
                <p className="text-sm text-gray-600">Navigate through the interactive family tree</p>
              </div>
            </div>
            <button
              onClick={runSimulation}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg inline-flex items-center gap-2"
            >
              <Play size={20} />
              Start Your First Simulation
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
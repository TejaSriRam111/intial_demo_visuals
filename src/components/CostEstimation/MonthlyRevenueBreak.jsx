import React, { useState } from 'react';

const MonthlyRevenueBreak = ({
  treeData,
  buffaloDetails,
  monthlyRevenue,
  calculateAgeInMonths,
  calculateCumulativeRevenueUntilYear,
  calculateTotalCumulativeRevenueUntilYear,
  monthNames,
  formatCurrency
}) => {
  const [selectedYear, setSelectedYear] = useState(treeData.startYear);
  const [selectedUnit, setSelectedUnit] = useState(1);

  // Get buffaloes for selected unit and filter only income-producing ones
  const unitBuffaloes = Object.values(buffaloDetails)
    .filter(buffalo => buffalo.unit === selectedUnit)
    .filter(buffalo => {
      if (selectedYear < buffalo.birthYear + 3) {
        return false;
      }

      const hasRevenue = monthNames.some((_, monthIndex) => {
        return (monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0) > 0;
      });

      return hasRevenue;
    });

  // Calculate CPF cost for milk-producing buffaloes
  const calculateCPFCost = () => {
    let milkProducingBuffaloesWithCPF = 0;
    const buffaloCPFDetails = [];

    unitBuffaloes.forEach(buffalo => {
      if (buffalo.id === 'M1') {
        milkProducingBuffaloesWithCPF++;
        buffaloCPFDetails.push({ id: buffalo.id, hasCPF: true, reason: 'M1 (Comes with CPF)' });
      } else if (buffalo.id === 'M2') {
        buffaloCPFDetails.push({ id: buffalo.id, hasCPF: false, reason: 'M2 (No CPF)' });
      } else if (buffalo.generation === 1 || buffalo.generation === 2) {
        const ageInMonths = calculateAgeInMonths(buffalo, selectedYear, 11);
        const hasCPF = ageInMonths >= 36;
        if (hasCPF) {
          milkProducingBuffaloesWithCPF++;
        }
        buffaloCPFDetails.push({ 
          id: buffalo.id, 
          hasCPF: hasCPF, 
          reason: hasCPF ? 'Child (Age ≥ 3 years)' : 'Child (Age < 3 years, no CPF)' 
        });
      }
    });

    const annualCPFCost = milkProducingBuffaloesWithCPF * 13000;
    const monthlyCPFCost = annualCPFCost / 12;

    return {
      milkProducingBuffaloes: unitBuffaloes.length,
      milkProducingBuffaloesWithCPF,
      annualCPFCost,
      monthlyCPFCost: Math.round(monthlyCPFCost),
      buffaloCPFDetails
    };
  };

  const cpfCost = calculateCPFCost();
  
  // Calculate cumulative revenue until selected year
  const cumulativeRevenueUntilYear = calculateCumulativeRevenueUntilYear(selectedUnit, selectedYear);
  const totalCumulativeUntilYear = calculateTotalCumulativeRevenueUntilYear(selectedUnit, selectedYear);

  // Calculate CPF cumulative cost until selected year
  const calculateCumulativeCPFCost = () => {
    let totalCPFUntilYear = 0;
    
    for (let year = treeData.startYear; year <= selectedYear; year++) {
      const buffaloesInYear = Object.values(buffaloDetails)
        .filter(buffalo => buffalo.unit === selectedUnit && year >= buffalo.birthYear);
      
      let cpfCount = 0;
      buffaloesInYear.forEach(buffalo => {
        if (buffalo.id === 'M1') {
          cpfCount++;
        } else if (buffalo.id === 'M2') {
          // No CPF
        } else if (buffalo.generation === 1 || buffalo.generation === 2) {
          const ageInMonths = calculateAgeInMonths(buffalo, year, 11);
          if (ageInMonths >= 36) {
            cpfCount++;
          }
        }
      });
      
      totalCPFUntilYear += cpfCount * 13000;
    }
    
    return totalCPFUntilYear;
  };

  const cumulativeCPFCost = calculateCumulativeCPFCost();
  const cumulativeNetRevenue = totalCumulativeUntilYear - cumulativeCPFCost;

  // Download Excel function
  const downloadExcel = () => {
    let csvContent = "Monthly Revenue Breakdown - Unit " + selectedUnit + " - " + selectedYear + "\n\n";

    csvContent += "Month,";
    unitBuffaloes.forEach(buffalo => {
      csvContent += buffalo.id + ",";
    });
    csvContent += "Unit Total,CPF Cost,Net Revenue,Cumulative Revenue Until " + selectedYear + "\n";

    monthNames.forEach((month, monthIndex) => {
      const unitTotal = unitBuffaloes.reduce((sum, buffalo) => {
        return sum + (monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0);
      }, 0);

      const netRevenue = unitTotal - cpfCost.monthlyCPFCost;

      csvContent += month + ",";
      unitBuffaloes.forEach(buffalo => {
        const revenue = monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0;
        csvContent += revenue + ",";
      });
      csvContent += unitTotal + "," + cpfCost.monthlyCPFCost + "," + netRevenue + "," + totalCumulativeUntilYear + "\n";
    });

    // Yearly totals
    const yearlyUnitTotal = unitBuffaloes.reduce((sum, buffalo) => {
      return sum + monthNames.reduce((monthSum, _, monthIndex) => {
        return monthSum + (monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0);
      }, 0);
    }, 0);

    const yearlyNetRevenue = yearlyUnitTotal - cpfCost.annualCPFCost;

    csvContent += "\nYearly Total,";
    unitBuffaloes.forEach(buffalo => {
      const yearlyTotal = monthNames.reduce((sum, _, monthIndex) => {
        return sum + (monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0);
      }, 0);
      csvContent += yearlyTotal + ",";
    });
    csvContent += yearlyUnitTotal + "," + cpfCost.annualCPFCost + "," + yearlyNetRevenue + "," + totalCumulativeUntilYear + "\n";

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Unit-${selectedUnit}-Revenue-${selectedYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-3xl p-10 shadow-2xl border border-blue-200 mb-16 xl:mx-20">
      <h2 className="text-3xl font-bold text-black-800 mb-8 text-center flex items-center justify-center gap-4">
        Monthly Revenue - Income Producing Buffaloes Only
      </h2>

      {/* Year and Unit Selection with Download Button */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:flex xl:justify-center gap-6 mb-5">
        <div className="bg-white rounded-2xl py-4 pl-6 xl:w-60 xl:h-25 border border-blue-200">
          <label className="block text-sm font-semibold text-blue-700 mb-4">
            Select Year:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full p-3 border border-blue-300 rounded-xl xl:text-sm xl:p-1 xl:w-1/2"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={treeData.startYear + i}>
                {treeData.startYear + i}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-2xl py-4 pl-6 xl:w-60 xl:h-25 border border-blue-200">
          <label className="block text-lg xl:text-sm font-semibold text-blue-700 mb-3">
            Select Unit:
          </label>
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(parseInt(e.target.value))}
            className="w-full p-3 border border-blue-300 rounded-xl text-lg xl:text-sm xl:p-1 xl:w-1/2"
          >
            {Array.from({ length: treeData.units }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                Unit {i + 1}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white rounded-2xl p-6 pl-6 xl:w-60 xl:h-25 border border-green-200 flex items-center justify-center">
          <button
            onClick={downloadExcel}
            className="bg-gray-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-8 xl:px-5 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-3 w-full"
          >
            <span className="text-xl xl:text-lg">Download Excel</span>
          </button>
        </div>
      </div>

      {/* Cumulative Revenue Summary */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white text-center mb-8">
        <div className="text-2xl font-bold mb-2 xl:text-lg">
          Cumulative Revenue Until {selectedYear}: {formatCurrency(totalCumulativeUntilYear)}
        </div>
        <div className="text-lg xl:text-base opacity-90">
          Total revenue generated by Unit {selectedUnit} from {treeData.startYear} to {selectedYear}
        </div>
      </div>

      {/* CPF Cost Summary */}
      <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
        <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white text-center mb-8">
          <div className="text-2xl font-bold mb-2 xl:text-sm">
            CPF (Cattle Protection Fund) - ₹13,000 per Buffalo with CPF
          </div>
          <div className="text-lg xl:text-base opacity-90">
            {cpfCost.milkProducingBuffaloesWithCPF} buffaloes with CPF × ₹13,000 = {formatCurrency(cpfCost.annualCPFCost)} annually
          </div>
          <div className="text-sm opacity-80 mt-2">
            Monthly CPF Cost: {formatCurrency(cpfCost.monthlyCPFCost)} | 
            Cumulative CPF Until {selectedYear}: {formatCurrency(cumulativeCPFCost)}
          </div>
          <div className="text-xs opacity-70 mt-2">
            Note: M1 has CPF, M2 has no CPF. Children get CPF only after age 3.
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white text-center mb-8">
          <div className="text-2xl xl:text-lg font-bold mb-2">
            {unitBuffaloes.length} Income Producing Buffaloes in {selectedYear}
          </div>
          <div className="text-lg xl:text-sm opacity-90">
            Unit {selectedUnit} | Showing only buffaloes generating revenue (age 3+ years)
          </div>
          <div className="text-sm opacity-80 mt-2">
            Cumulative Net Revenue Until {selectedYear}: {formatCurrency(cumulativeNetRevenue)}
          </div>
        </div>
      </div>

      {/* CPF Details */}
      <div className="bg-white rounded-2xl p-6 border border-yellow-200 mb-8">
        <h3 className="text-xl font-bold text-yellow-700 mb-4 text-center">CPF Eligibility Details (Per Unit Basis)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="font-bold text-yellow-700">Buffaloes WITH CPF (₹13,000 each):</div>
            <ul className="list-disc pl-5 text-sm text-yellow-600 mt-2">
              <li>M1 (First Mother Buffalo) - Has CPF included</li>
              <li>Children after they reach 3 years of age (36 months)</li>
            </ul>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="font-bold text-green-700">Buffaloes WITHOUT CPF:</div>
            <ul className="list-disc pl-5 text-sm text-green-600 mt-2">
              <li>M2 (Second Mother Buffalo) - No CPF (free CPF offer)</li>
              <li>Children before they reach 3 years of age</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-700 font-semibold">Important Note:</div>
          <div className="text-xs text-blue-600">
            Each unit (2 mother buffaloes) comes with ONE CPF coverage (₹13,000). 
            The CPF covers M1 only. M2 gets free CPF coverage. 
            Additional CPF is required for children when they reach 3 years of age.
          </div>
        </div>
      </div>

      {/* Monthly Revenue Table */}
      {unitBuffaloes.length > 0 ? (
        <div className="bg-white rounded-2xl p-8 xl:p-5 border border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Monthly Revenue Breakdown - {selectedYear} (Unit {selectedUnit})
          </h3>
          <div className="overflow-y-auto rounded-xl">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r items-center from-gray-50 to-blue-50">
                  <th className="py-3 text-center font-bold text-gray-700 border-b-2 border-r-2 border-gray-300 text-xl xl:text-lg">
                    Month
                  </th>
                  {unitBuffaloes.map((buffalo, index) => (
                    <th
                      key={buffalo.id}
                      className="py-3 text-center font-bold text-gray-700 border-b-2 border-r-2 border-gray-300 text-lg"
                      style={{
                        borderRight: index === unitBuffaloes.length - 1 ? '2px solid #d1d5db' : '1px solid #e5e7eb'
                      }}
                    >
                      <div className="text-xl font-bold">{buffalo.id}</div>
                      <div className="text-sm font-normal text-gray-500 mt-1">
                        {buffalo.generation === 0 ? 'Mother' :
                          buffalo.generation === 1 ? 'Child' : 'Grandchild'}
                      </div>
                    </th>
                  ))}
                  <th className="py-3 text-center font-bold text-gray-700 border-b-2 border-r-2 border-gray-300 text-xl xl:text-lg bg-blue-100">
                    Unit Total
                  </th>
                  <th className="py-3 text-center font-bold text-gray-700 border-b-2 border-r-2 border-gray-300 text-xl xl:text-lg bg-orange-100">
                    CPF Cost
                  </th>
                  <th className="py-3 text-center font-bold text-gray-700 border-b-2 border-gray-300 text-xl xl:text-lg bg-green-100">
                    Net Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthNames.map((month, monthIndex) => {
                  const unitTotal = unitBuffaloes.reduce((sum, buffalo) => {
                    return sum + (monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0);
                  }, 0);

                  const netRevenue = unitTotal - cpfCost.monthlyCPFCost;

                  return (
                    <tr key={monthIndex} className="hover:bg-blue-50 transition-colors group">
                      <td className="py-3 text-center border-b border-r-2 border-gray-300 font-semibold text-gray-900 text-lg bg-gray-50">
                        {month}
                      </td>
                      {unitBuffaloes.map((buffalo, buffaloIndex) => {
                        const revenue = monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0;
                        return (
                          <td
                            key={buffalo.id}
                            className="border-b text-center transition-all duration-200 group-hover:bg-blue-50"
                            style={{
                              borderRight: buffaloIndex === unitBuffaloes.length - 1 ? '2px solid #d1d5db' : '1px solid #e5e7eb',
                              background: revenue > 0 ? (revenue === 9000 ? '#f0fdf4' : revenue === 6000 ? '#f0f9ff' : '#f8fafc') : '#f8fafc'
                            }}
                          >
                            <div className={`font-semibold text-lg ${revenue === 9000 ? 'text-green-600' :
                              revenue === 6000 ? 'text-blue-600' :
                                'text-gray-400'
                              }`}>
                              {formatCurrency(revenue)}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {revenue === 9000 ? 'High' : revenue === 6000 ? 'Medium' : 'Rest'}
                            </div>
                          </td>
                        );
                      })}
                      <td className="border-b border-r-2 border-gray-300 text-center font-semibold text-purple-600 text-lg bg-blue-50">
                        {formatCurrency(unitTotal)}
                      </td>
                      <td className="border-b border-r-2 border-gray-300 text-center font-semibold text-orange-600 text-lg bg-orange-50">
                        {formatCurrency(cpfCost.monthlyCPFCost)}
                      </td>
                      <td className="border-b text-center font-semibold text-lg bg-green-50"
                        style={{ color: netRevenue >= 0 ? '#059669' : '#dc2626' }}>
                        {formatCurrency(netRevenue)}
                      </td>
                    </tr>
                  );
                })}

                {/* Yearly Total Row */}
                <tr className="bg-gray-700 text-white">
                  <td className="text-center font-bold text-xl xl:text-lg border-r-2 border-gray-600">Yearly Total</td>
                  {unitBuffaloes.map((buffalo, buffaloIndex) => {
                    const yearlyTotal = monthNames.reduce((sum, _, monthIndex) => {
                      return sum + (monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0);
                    }, 0);
                    return (
                      <td
                        key={buffalo.id}
                        className="px-3 py-3 text-center font-bold text-lg border-r-2 border-gray-600"
                        style={{ borderRight: buffaloIndex === unitBuffaloes.length - 1 ? '2px solid #4b5563' : '1px solid #6b7280' }}
                      >
                        {formatCurrency(yearlyTotal)}
                      </td>
                    );
                  })}
                  <td className="text-center font-bold text-lg border-r-2 border-gray-600">
                    {formatCurrency(unitBuffaloes.reduce((sum, buffalo) => {
                      return sum + monthNames.reduce((monthSum, _, monthIndex) => {
                        return monthSum + (monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0);
                      }, 0);
                    }, 0))}
                  </td>
                  <td className="text-center font-bold text-lg border-r-2 border-gray-600">
                    {formatCurrency(cpfCost.annualCPFCost)}
                  </td>
                  <td className="text-center font-bold text-lg">
                    {formatCurrency(unitBuffaloes.reduce((sum, buffalo) => {
                      return sum + monthNames.reduce((monthSum, _, monthIndex) => {
                        return monthSum + (monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0);
                      }, 0);
                    }, 0) - cpfCost.annualCPFCost)}
                  </td>
                </tr>
                
                {/* Cumulative Revenue Row */}
                <tr className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <td className="text-center font-bold text-xl xl:text-lg border-r-2 border-blue-400">
                    Cumulative Until {selectedYear}
                  </td>
                  {unitBuffaloes.map((buffalo, buffaloIndex) => {
                    return (
                      <td
                        key={buffalo.id}
                        className="px-3 py-3 text-center font-bold text-lg border-r-2 border-blue-400"
                        style={{ borderRight: buffaloIndex === unitBuffaloes.length - 1 ? '2px solid #3b82f6' : '1px solid #60a5fa' }}
                      >
                        {formatCurrency(cumulativeRevenueUntilYear[buffalo.id] || 0)}
                      </td>
                    );
                  })}
                  <td className="text-center font-bold text-lg border-r-2 border-blue-400 bg-blue-700">
                    {formatCurrency(totalCumulativeUntilYear)}
                  </td>
                  <td className="text-center font-bold text-lg border-r-2 border-blue-400 bg-orange-700">
                    {formatCurrency(cumulativeCPFCost)}
                  </td>
                  <td className="text-center font-bold text-lg bg-green-700">
                    {formatCurrency(cumulativeNetRevenue)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Summary Section */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-xl p-6 xl:p-3 border border-blue-200 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2 xl:mb-1">
                {formatCurrency(unitBuffaloes.reduce((sum, buffalo) => {
                  return sum + monthNames.reduce((monthSum, _, monthIndex) => {
                    return monthSum + (monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0);
                  }, 0);
                }, 0))}
              </div>
              <div className="text-lg font-semibold text-blue-700">Annual Revenue {selectedYear}</div>
            </div>

            <div className="bg-orange-50 rounded-xl p-6 border border-orange-200 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-2">
                {formatCurrency(cpfCost.annualCPFCost)}
              </div>
              <div className="text-lg font-semibold text-orange-700">Annual CPF Cost</div>
              <div className="text-sm text-orange-600 mt-1">
                {cpfCost.milkProducingBuffaloesWithCPF} buffaloes × ₹13,000
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {formatCurrency(unitBuffaloes.reduce((sum, buffalo) => {
                  return sum + monthNames.reduce((monthSum, _, monthIndex) => {
                    return monthSum + (monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0);
                  }, 0);
                }, 0) - cpfCost.annualCPFCost)}
              </div>
              <div className="text-lg font-semibold text-green-700">Net Annual Revenue</div>
            </div>

            <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {formatCurrency(cumulativeNetRevenue)}
              </div>
              <div className="text-lg font-semibold text-purple-700">Cumulative Net Until {selectedYear}</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 rounded-2xl p-8 border border-yellow-200 text-center">
          <div className="text-2xl font-bold text-yellow-800 mb-4">
            🐄 No Income Producing Buffaloes
          </div>
          <div className="text-lg text-yellow-700">
            There are no income-producing buffaloes in Unit {selectedUnit} for the year {selectedYear}.
          </div>
          <div className="text-sm text-yellow-600 mt-2">
            Buffaloes start generating income at age 3 (born in {selectedYear - 3} or earlier).
          </div>
        </div>
      )}

      {/* Dynamic Calculation Note */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-100 rounded-xl p-5 mt-6 border border-blue-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="text-2xl">⚡</div>
          <div className="text-lg font-bold text-blue-800">Dynamic Revenue Calculation</div>
        </div>
        <p className="text-blue-700 text-sm">
          These revenue figures are calculated <span className="font-semibold">dynamically</span> based on:
          <span className="block mt-1 ml-4">
            1. Each buffalo's specific age and production cycle<br/>
            2. Natural reproduction patterns<br/>
            3. CPF costs that vary with age<br/>
            4. Realistic monthly production variations
          </span>
        </p>
      </div>
    </div>
  );
};

export default MonthlyRevenueBreak;
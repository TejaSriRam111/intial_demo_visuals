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
    <div className="  px-10 py-2 mb-16 xl:mx-20">
      {/* Navigation Bar Style Controls - Centered */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-6   px-4 py-2  my-2">

        {/* Year Selector */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          <div className="relative bg-white rounded-xl border border-slate-200 px-4 py-2.5 min-w-[180px] shadow-sm">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-700 mr-3">
                Select Year
              </label>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="appearance-none bg-white border border-slate-300 rounded-lg text-sm px-3 py-1.5 pr-8 text-slate-700 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 cursor-pointer"
                >
                  {Array.from({ length: 10 }, (_, i) => (
                    <option key={i} value={treeData.startYear + i}>
                      {treeData.startYear + i}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unit Selector */}
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-400 rounded-xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          <div className="relative bg-white rounded-xl border border-slate-200 px-4 py-2.5 min-w-[180px] shadow-sm">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-700 mr-3">
                Select Unit
              </label>
              <div className="relative">
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(parseInt(e.target.value))}
                  className="appearance-none bg-white border border-slate-300 rounded-lg text-sm px-3 py-1.5 pr-8 text-slate-700 hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 cursor-pointer"
                >
                  {Array.from({ length: treeData.units }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      Unit {i + 1}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <div className="relative group">
          <button
            onClick={downloadExcel}
            className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-3 min-w-[200px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-600 opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <svg className="relative w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <span className="relative text-sm">Download Excel</span>
          </button>
        </div>

      </div>

      {/* Cumulative Revenue Summary */}
      <div className='flex justify-center'>
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 text-center mb-4 w-full max-w-3xl shadow-sm border border-blue-200">
          <div className="text-lg font-medium text-slate-800 xl:text-xl">
            Total revenue generated by Unit {selectedUnit} from {treeData.startYear} to {selectedYear}:
            <span className="ml-2 text-blue-600 font-bold">
              {formatCurrency(totalCumulativeUntilYear)}
            </span>
          </div>
        </div>
      </div>

     {/* Monthly Revenue Table */}
{unitBuffaloes.length > 0 ? (
  <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg">
    <div className="mb-6">
      <h3 className="text-2xl font-bold text-slate-900 mb-2 text-center">
        Monthly Revenue Breakdown - {selectedYear}
      </h3>
      <p className="text-slate-600 text-center font-medium">
        Unit {selectedUnit} • {unitBuffaloes.length} Buffalo{unitBuffaloes.length !== 1 ? 'es' : ''}
      </p>
    </div>
    
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b-2 border-slate-300">
            <th className="py-4 px-4 text-center font-bold text-slate-800 text-base border-r border-slate-300">
              Month
            </th>
            {unitBuffaloes.map((buffalo, index) => (
              <th
                key={buffalo.id}
                className="py-3 px-3 text-center font-medium text-slate-800 border-r border-slate-300"
                style={{
                  borderRight: index === unitBuffaloes.length - 1 ? '2px solid #cbd5e1' : '1px solid #e2e8f0'
                }}
              >
                <div className="font-bold text-slate-900 text-base">{buffalo.id}</div>
                <div className="text-sm font-normal text-slate-500 mt-1">
                  {buffalo.generation === 0 ? 'Mother' :
                   buffalo.generation === 1 ? 'Child' : 'Grandchild'}
                </div>
              </th>
            ))}
            <th className="py-4 px-4 text-center font-bold text-white text-base border-r border-slate-300 bg-slate-700">
              Unit Total
            </th>
            <th className="py-4 px-4 text-center font-bold text-white text-base border-r border-slate-300 bg-amber-600">
              CPF Cost
            </th>
            <th className="py-4 px-4 text-center font-bold text-white text-base bg-emerald-600">
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
              <>
                {/* Month Row */}
                <tr key={monthIndex} className={`hover:bg-slate-50 transition-colors ${monthIndex % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                  <td className="py-4 px-4 text-center font-semibold text-slate-900 text-base border-r border-slate-300 border-b border-slate-200 bg-slate-100">
                    {month}
                  </td>
                  {unitBuffaloes.map((buffalo, buffaloIndex) => {
                    const revenue = monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0;
                    const revenueType = revenue === 9000 ? 'high' : revenue === 6000 ? 'medium' : 'low';
                    const bgColors = {
                      high: 'bg-emerald-50 hover:bg-emerald-100',
                      medium: 'bg-blue-50 hover:bg-blue-100',
                      low: 'bg-slate-50 hover:bg-slate-100'
                    };
                    const textColors = {
                      high: 'text-emerald-700',
                      medium: 'text-blue-700',
                      low: 'text-slate-500'
                    };
                    
                    return (
                      <td
                        key={buffalo.id}
                        className={`py-4 px-3 text-center transition-all duration-200 border-b border-slate-200 ${bgColors[revenueType]}`}
                        style={{
                          borderRight: buffaloIndex === unitBuffaloes.length - 1 ? '2px solid #cbd5e1' : '1px solid #e2e8f0'
                        }}
                      >
                        <div className={`font-semibold text-base ${textColors[revenueType]}`}>
                          {formatCurrency(revenue)}
                        </div>
                        {revenue > 0 && (
                          <div className="text-sm text-slate-500 mt-1">
                            {revenueType.charAt(0).toUpperCase() + revenueType.slice(1)}
                          </div>
                        )}
                      </td>
                    );
                  })}
                  <td className="py-4 px-4 text-center font-semibold text-slate-900 text-base border-r border-slate-300 border-b border-slate-200 bg-slate-100">
                    {formatCurrency(unitTotal)}
                  </td>
                  <td className="py-4 px-4 text-center font-semibold text-amber-700 text-base border-r border-slate-300 border-b border-slate-200 bg-amber-50">
                    {formatCurrency(cpfCost.monthlyCPFCost)}
                  </td>
                  <td className={`py-4 px-4 text-center font-semibold text-base border-b border-slate-200 ${
                    netRevenue >= 0 ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                  }`}>
                    {formatCurrency(netRevenue)}
                  </td>
                </tr>
                
                {/* Separator line after every 3 months for better readability */}
                {(monthIndex === 2 || monthIndex === 5 || monthIndex === 8) && (
                  <tr>
                    <td colSpan={unitBuffaloes.length + 4} className="h-px bg-slate-300"></td>
                  </tr>
                )}
              </>
            );
          })}

          {/* Yearly Total Row */}
          <tr className="bg-gradient-to-r from-slate-400 to-slate-500 text-white">
            <td className="py-5 px-4 text-center font-bold text-base border-r border-slate-700">
              Yearly Total
            </td>
            {unitBuffaloes.map((buffalo, buffaloIndex) => {
              const yearlyTotal = monthNames.reduce((sum, _, monthIndex) => {
                return sum + (monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0);
              }, 0);
              return (
                <td
                  key={buffalo.id}
                  className="py-4 px-3 text-center font-semibold text-base "
                  style={{ borderRight: buffaloIndex === unitBuffaloes.length - 1 ? '2px solid #475569' : '1px solid #64748b' }}
                >
                  {formatCurrency(yearlyTotal)}
                </td>
              );
            })}
            <td className="py-5 px-4 text-center font-bold text-base  bg-slate-950">
              {formatCurrency(unitBuffaloes.reduce((sum, buffalo) => {
                return sum + monthNames.reduce((monthSum, _, monthIndex) => {
                  return monthSum + (monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0);
                }, 0);
              }, 0))}
            </td>
            <td className="py-5 px-4 text-center font-bold text-base  bg-amber-950">
              {formatCurrency(cpfCost.annualCPFCost)}
            </td>
            <td className="py-5 px-4 text-center font-bold text-base bg-emerald-900">
              {formatCurrency(unitBuffaloes.reduce((sum, buffalo) => {
                return sum + monthNames.reduce((monthSum, _, monthIndex) => {
                  return monthSum + (monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0);
                }, 0);
              }, 0) - cpfCost.annualCPFCost)}
            </td>
          </tr>

        

          {/* Cumulative Revenue Row */}
          <tr className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white">
            <td className="py-5 px-4 text-center font-bold text-base border-r border-blue-800">
              Cumulative Until {selectedYear}
            </td>
            {unitBuffaloes.map((buffalo, buffaloIndex) => {
              return (
                <td
                  key={buffalo.id}
                  className="py-4 px-3 text-center font-semibold text-base border-r border-blue-800"
                  style={{ borderRight: buffaloIndex === unitBuffaloes.length - 1 ? '2px solid #1e40af' : '1px solid #3b82f6' }}
                >
                  {formatCurrency(cumulativeRevenueUntilYear[buffalo.id] || 0)}
                </td>
              );
            })}
            <td className="py-5 px-4 text-center font-bold text-base border-r border-blue-800 bg-slate-900">
              {formatCurrency(totalCumulativeUntilYear)}
            </td>
            <td className="py-5 px-4 text-center font-bold text-base border-r border-blue-800 bg-amber-800">
              {formatCurrency(cumulativeCPFCost)}
            </td>
            <td className="py-5 px-4 text-center font-bold text-base bg-emerald-800">
              {formatCurrency(cumulativeNetRevenue)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* Summary Section */}
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200 shadow-sm">
        <div className="text-3xl font-bold text-slate-900 mb-2">
          {formatCurrency(unitBuffaloes.reduce((sum, buffalo) => {
            return sum + monthNames.reduce((monthSum, _, monthIndex) => {
              return monthSum + (monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0);
            }, 0);
          }, 0))}
        </div>
        <div className="text-lg font-semibold text-slate-700">Annual Revenue</div>
        <div className="text-sm text-slate-500 mt-1">{selectedYear}</div>
       
      </div>

      <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200 shadow-sm">
        <div className="text-3xl font-bold text-amber-700 mb-2">
          {formatCurrency(cpfCost.annualCPFCost)}
        </div>
        <div className="text-lg font-semibold text-amber-800">Annual CPF Cost</div>
        <div className="text-sm text-amber-600 mt-1">
          {cpfCost.milkProducingBuffaloesWithCPF} buffaloes × ₹13,000
        </div>
        
      </div>

      <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200 shadow-sm">
        <div className="text-3xl font-bold text-emerald-700 mb-2">
          {formatCurrency(unitBuffaloes.reduce((sum, buffalo) => {
            return sum + monthNames.reduce((monthSum, _, monthIndex) => {
              return monthSum + (monthlyRevenue[selectedYear]?.[monthIndex]?.buffaloes[buffalo.id] || 0);
            }, 0);
          }, 0) - cpfCost.annualCPFCost)}
        </div>
        <div className="text-lg font-semibold text-emerald-800">Net Annual Revenue</div>
        <div className="text-sm text-emerald-600 mt-1">{selectedYear}</div>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-6 border border-indigo-200 shadow-sm">
        <div className="text-3xl font-bold text-indigo-700 mb-2">
          {formatCurrency(cumulativeNetRevenue)}
        </div>
        <div className="text-lg font-semibold text-indigo-800">Cumulative Net</div>
        <div className="text-sm text-indigo-600 mt-1">Until {selectedYear}</div>
      </div>
    </div>
  </div>
) : (
  <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8 border border-amber-200 text-center shadow-sm">
    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
      <span className="text-3xl">🐄</span>
    </div>
    <div className="text-2xl font-bold text-amber-900 mb-3">
      No Income Producing Buffaloes
    </div>
    <div className="text-lg text-amber-800 mb-2">
      There are no income-producing buffaloes in Unit {selectedUnit} for {selectedYear}.
    </div>
    <div className="text-base text-amber-700">
      Buffaloes start generating income at age 3 (born in {selectedYear - 3} or earlier).
    </div>
    <div className="mt-6 pt-4 border-t border-amber-300">
      <div className="text-sm text-amber-600">
        Check other units or select a different year to view revenue data.
      </div>
    </div>
  </div>
)}
      {/* Dynamic Calculation Note */}

    </div>
  );
};

export default MonthlyRevenueBreak;
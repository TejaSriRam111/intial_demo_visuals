import React from 'react';

const RevenueBreakEven = ({
  treeData,
  initialInvestment,
  yearlyCPFCost,
  breakEvenAnalysis,
  cpfToggle,
  setCpfToggle,
  formatCurrency
}) => {
  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];

  return (
    <div className=" p-10 rounded-2xl border border-purple-200 mb-16 xl:mx-20">


     {/* CPF Toggle - Side-by-side version */}
<div className="flex justify-center mb-8">
  <div className="bg-white rounded-2xl p-4 border border-purple-300 flex items-center gap-4">
    <div className="text-lg font-semibold text-purple-700">Select CPF Mode:</div>
    <div className="flex gap-2 bg-gray-100 p-1 rounded-xl">
      <button
        onClick={() => setCpfToggle("withCPF")}
        className={`px-6 py-2 rounded-lg font-bold transition-all ${cpfToggle === "withCPF" ? 'bg-green-500 text-white shadow-md' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}
      >
        With CPF
      </button>
      <button
        onClick={() => setCpfToggle("withoutCPF")}
        className={`px-6 py-2 rounded-lg font-bold transition-all ${cpfToggle === "withoutCPF" ? 'bg-blue-500 text-white shadow-md' : 'bg-transparent text-gray-700 hover:bg-gray-200'}`}
      >
        Without CPF
      </button>
    </div>
  </div>
</div>

      {/* Initial Investment & Break-Even Analysis - Professional Layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {/* Mother Buffaloes Cost */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border border-blue-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-blue-700 mb-2">
            {formatCurrency(initialInvestment.motherBuffaloCost)}
          </div>
          <div className="text-md font-semibold text-blue-800 mb-1">Mother Buffaloes</div>
          <div className="text-xs text-gray-600">
            {treeData.units} units × 2 mothers × ₹1.75 Lakhs
            <br />
            {initialInvestment.motherBuffaloes} mother buffaloes @ ₹1.75L each
            <br />
            Total: 2 × ₹1.75L = ₹3.5L per unit
          </div>
        </div>

        {/* CPF Cost */}
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-5 border border-emerald-100 shadow-sm text-center">
          <div className="text-2xl font-bold text-emerald-700 mb-2">
            {formatCurrency(initialInvestment.cpfCost)}
          </div>
          <div className="text-md font-semibold text-emerald-800 mb-1">CPF Coverage</div>
          <div className="text-xs text-gray-600">
            {treeData.units} units × ₹13,000
            <br />
            One CPF covers both M1 and M2 per unit
            <br />
            M1 has CPF, M2 gets free coverage
          </div>
        </div>

        {/* Total Investment Card - Added in the middle */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-5 text-white shadow-lg text-center transform hover:scale-[1.02] transition-transform duration-200">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-xs font-semibold opacity-90 mb-1">Total Initial Investment</div>
            <div className="text-2xl md:text-3xl font-bold mb-2">
              {formatCurrency(initialInvestment.totalInvestment)}
            </div>
            <div className="text-xs opacity-80">
              {initialInvestment.totalBuffaloesAtStart} buffaloes total
              <br />
              (2 mothers + 2 calves per unit)
              <br />
              + CPF coverage for each unit
            </div>
          </div>
        </div>

        {/* Without CPF Break-Even */}
        {breakEvenAnalysis.breakEvenYearWithoutCPF && breakEvenAnalysis.exactBreakEvenDateWithoutCPF && (
          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-5 text-white text-center shadow-sm">
            <div className="text-md font-bold mb-2">Break-Even WITHOUT CPF</div>
            <div className="text-xl font-semibold mb-1">
              {breakEvenAnalysis.exactBreakEvenDateWithoutCPF.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="text-sm opacity-90 mb-2">
              📈 Revenue: {formatCurrency(breakEvenAnalysis.finalCumulativeRevenueWithoutCPF)}
            </div>
            <div className="text-xs opacity-80">
              {Math.floor((breakEvenAnalysis.breakEvenYearWithoutCPF - treeData.startYear) * 12 + breakEvenAnalysis.breakEvenMonthWithoutCPF)} months
              <br />
              ({Math.floor((breakEvenAnalysis.breakEvenYearWithoutCPF - treeData.startYear) + breakEvenAnalysis.breakEvenMonthWithoutCPF / 12)} years)
            </div>
          </div>
        )}

        {/* With CPF Break-Even */}
        {breakEvenAnalysis.breakEvenYearWithCPF && breakEvenAnalysis.exactBreakEvenDateWithCPF && (
          <div className="bg-gradient-to-br from-teal-600 to-emerald-700 rounded-xl p-5 text-white text-center shadow-sm">
            <div className="text-md font-bold mb-2">Break-Even WITH CPF</div>
            <div className="text-xl font-semibold mb-1">
              {breakEvenAnalysis.exactBreakEvenDateWithCPF.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="text-sm opacity-90 mb-2">
              📈 Net Revenue: {formatCurrency(breakEvenAnalysis.finalCumulativeRevenueWithCPF)}
            </div>
            <div className="text-xs opacity-80">
              {Math.floor((breakEvenAnalysis.breakEvenYearWithCPF - treeData.startYear) * 12 + breakEvenAnalysis.breakEvenMonthWithCPF)} months
              <br />
              ({Math.floor((breakEvenAnalysis.breakEvenYearWithCPF - treeData.startYear) + breakEvenAnalysis.breakEvenMonthWithCPF / 12)} years)
            </div>
          </div>
        )}
      </div>

      {/* Break-Even Timeline */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Break-Even Timeline {cpfToggle === "withCPF" ? "(With CPF)" : "(Without CPF)"}
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-blue-50">
                <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">Year</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">
                  {cpfToggle === "withCPF" ? "Annual Revenue (Net)" : "Annual Revenue (Gross)"}
                </th>
                <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">
                  {cpfToggle === "withCPF" ? "Cumulative (Net)" : "Cumulative (Gross)"}
                </th>
                <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">Investment Recovery</th>
              </tr>
            </thead>
            <tbody>
              {breakEvenAnalysis.breakEvenData.map((data, index) => {
                const annualRevenue = cpfToggle === "withCPF" ? data.annualRevenueWithCPF : data.annualRevenueWithoutCPF;
                const cumulativeRevenue = cpfToggle === "withCPF" ? data.cumulativeRevenueWithCPF : data.cumulativeRevenueWithoutCPF;
                const recoveryPercentage = cpfToggle === "withCPF" ? data.recoveryPercentageWithCPF : data.recoveryPercentageWithoutCPF;
                const status = cpfToggle === "withCPF" ? data.statusWithCPF : data.statusWithoutCPF;

                return (
                  <tr key={data.year} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 border-b">
                      <div className="font-semibold text-gray-900">{data.year}</div>
                      <div className="text-sm text-gray-600">Year {index + 1}</div>
                    </td>
                    <td className="px-6 py-4 border-b font-semibold text-green-600">
                      {formatCurrency(annualRevenue)}
                      {cpfToggle === "withCPF" && (
                        <div className="text-xs text-gray-500">
                          CPF: -{formatCurrency(data.cpfCost)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 border-b font-semibold text-blue-600">
                      {formatCurrency(cumulativeRevenue)}
                    </td>
                    <td className="px-6 py-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-gray-200 rounded-full h-4">
                          <div
                            className={`h-4 rounded-full ${recoveryPercentage >= 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                            style={{ width: `${Math.min(recoveryPercentage, 100)}%` }}
                          ></div>
                        </div>
                        <div className="text-sm font-semibold text-gray-600 min-w-[60px]">
                          {recoveryPercentage.toFixed(1)}%
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold mt-2 inline-block
                        ${status.includes('Break-Even') ? 'bg-green-100 text-green-800' :
                          status.includes('75%') ? 'bg-yellow-100 text-yellow-800' :
                            status.includes('50%') ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-600'}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
};

export default RevenueBreakEven;
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
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-3xl p-10 shadow-2xl border border-purple-200 mb-16">
      <h2 className="text-4xl font-bold text-purple-800 mb-10 text-center flex items-center justify-center gap-4">
        <span className="text-5xl">💰</span>
        Revenue Break-Even Analysis (With & Without CPF)
      </h2>

      {/* CPF Toggle */}
      <div className="flex justify-center mb-8">
        <div className="bg-white rounded-2xl p-4 border border-purple-300">
          <div className="text-lg font-semibold text-purple-700 mb-2 text-center">Select CPF Mode:</div>
          <div className="flex gap-4">
            <button
              onClick={() => setCpfToggle("withCPF")}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${cpfToggle === "withCPF" ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              With CPF
            </button>
            <button
              onClick={() => setCpfToggle("withoutCPF")}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${cpfToggle === "withoutCPF" ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Without CPF
            </button>
          </div>
        </div>
      </div>

      {/* Initial Investment Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-white rounded-2xl p-8 border border-blue-200 shadow-lg text-center">
          <div className="text-3xl font-bold text-blue-600 mb-4">
            {formatCurrency(initialInvestment.motherBuffaloCost)}
          </div>
          <div className="text-lg font-semibold text-blue-700">Mother Buffaloes (60 months old)</div>
          <div className="text-sm text-gray-600 mt-2">
            {treeData.units} units × 2 mothers × ₹1.75 Lakhs
            <br />
            {initialInvestment.motherBuffaloes} mother buffaloes @ ₹1.75 Lakhs each
            <br />
            Total: 2 × ₹1.75L = ₹3.5L per unit
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 border border-green-200 shadow-lg text-center">
          <div className="text-3xl font-bold text-green-600 mb-4">
            {formatCurrency(initialInvestment.cpfCost)}
          </div>
          <div className="text-lg font-semibold text-green-700">CPF Cost (One CPF per Unit)</div>
          <div className="text-sm text-gray-600 mt-2">
            {treeData.units} units × ₹13,000
            <br />
            One CPF covers both M1 and M2 in each unit
            <br />
            M1 has CPF, M2 gets free CPF coverage
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-white shadow-lg text-center">
          <div className="text-3xl font-bold mb-4">
            {formatCurrency(initialInvestment.totalInvestment)}
          </div>
          <div className="text-lg font-semibold opacity-90">Total Initial Investment</div>
          <div className="text-sm opacity-80 mt-2">
            Includes {initialInvestment.totalBuffaloesAtStart} buffaloes (2 mothers + 2 calves per unit)
            <br />
            Plus one CPF coverage for each unit
          </div>
        </div>
      </div>

      {/* Starting Buffalo Summary */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center shadow-2xl mb-8">
        <div className="text-2xl font-bold mb-4">Starting Buffaloes (Included in Initial Purchase)</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-3xl font-bold">{initialInvestment.motherBuffaloes}</div>
            <div className="text-lg font-semibold">Mother Buffaloes (60 months)</div>
            <div className="text-sm opacity-90">5th year @ ₹1.75 Lakhs each</div>
          </div>
          <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-3xl font-bold">{initialInvestment.calvesAtStart}</div>
            <div className="text-lg font-semibold">Newborn Calves</div>
            <div className="text-sm opacity-90">Included free with mothers</div>
          </div>
          <div className="bg-white/20 rounded-xl p-6 backdrop-blur-sm">
            <div className="text-3xl font-bold">{treeData.units}</div>
            <div className="text-lg font-semibold">CPF Coverage</div>
            <div className="text-sm opacity-90">One CPF per unit (covers M1 & M2)</div>
          </div>
        </div>
      </div>

      {/* CPF Offer Explanation */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl p-6 text-white text-center shadow-2xl mb-8">
        <div className="text-2xl font-bold mb-4">🎁 Special CPF Offer</div>
        <div className="text-lg opacity-90">
          For each unit (2 mother buffaloes), you get ONE CPF coverage (₹13,000) that covers both M1 and M2
        </div>
        <div className="text-sm opacity-80 mt-2">
          Regular price: 2 CPF × ₹13,000 = ₹26,000 | Our offer: ₹13,000 (Save ₹13,000!)
        </div>
      </div>

      {/* Break-Even Results - Show Both */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Without CPF Break-Even */}
        {breakEvenAnalysis.breakEvenYearWithoutCPF && breakEvenAnalysis.exactBreakEvenDateWithoutCPF && (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white text-center shadow-2xl">
            <div className="text-3xl font-bold mb-4">📊 Break-Even WITHOUT CPF</div>
            <div className="text-2xl font-semibold mb-2">
              {breakEvenAnalysis.exactBreakEvenDateWithoutCPF.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="text-lg opacity-90 mb-4">
              📈 Cumulative Revenue: {formatCurrency(breakEvenAnalysis.finalCumulativeRevenueWithoutCPF)}
            </div>
            <div className="text-sm opacity-80">
              Investment recovered in {Math.floor((breakEvenAnalysis.breakEvenYearWithoutCPF - treeData.startYear) * 12 + breakEvenAnalysis.breakEvenMonthWithoutCPF)} months 
              ({Math.floor((breakEvenAnalysis.breakEvenYearWithoutCPF - treeData.startYear) + breakEvenAnalysis.breakEvenMonthWithoutCPF/12)} years {breakEvenAnalysis.breakEvenMonthWithoutCPF%12} months)
            </div>
          </div>
        )}

        {/* With CPF Break-Even */}
        {breakEvenAnalysis.breakEvenYearWithCPF && breakEvenAnalysis.exactBreakEvenDateWithCPF && (
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center shadow-2xl">
            <div className="text-3xl font-bold mb-4">🎉 Break-Even WITH CPF</div>
            <div className="text-2xl font-semibold mb-2">
              {breakEvenAnalysis.exactBreakEvenDateWithCPF.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <div className="text-lg opacity-90 mb-4">
              📈 Net Cumulative Revenue: {formatCurrency(breakEvenAnalysis.finalCumulativeRevenueWithCPF)}
            </div>
            <div className="text-sm opacity-80">
              Investment recovered in {Math.floor((breakEvenAnalysis.breakEvenYearWithCPF - treeData.startYear) * 12 + breakEvenAnalysis.breakEvenMonthWithCPF)} months 
              ({Math.floor((breakEvenAnalysis.breakEvenYearWithCPF - treeData.startYear) + breakEvenAnalysis.breakEvenMonthWithCPF/12)} years {breakEvenAnalysis.breakEvenMonthWithCPF%12} months)
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

      {/* Dynamic Revenue Note */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-200 mt-8">
        <div className="flex items-start gap-4">
          <div className="text-3xl">📊</div>
          <div>
            <h4 className="text-xl font-bold text-blue-800 mb-2">Dynamic Revenue Calculation</h4>
            <p className="text-blue-700">
              All revenue values are calculated <span className="font-semibold">dynamically</span> based on:
            </p>
            <ul className="list-disc pl-5 text-blue-600 mt-2 space-y-1">
              <li>Actual herd growth through natural reproduction</li>
              <li>Staggered birthing cycles (every 12 months)</li>
              <li>Age-based milk production (starts at 3 years)</li>
              <li>Seasonal production cycles (5 months high, 3 months medium, 4 months rest)</li>
              <li>Variable CPF costs based on buffalo age</li>
            </ul>
            <div className="bg-blue-100 rounded-lg p-4 mt-4">
              <div className="font-semibold text-blue-800">💡 Note:</div>
              <div className="text-blue-700 text-sm">
                {cpfToggle === "withCPF" ? (
                  <>
                    The net cumulative revenue of {formatCurrency(breakEvenAnalysis.finalCumulativeRevenueWithCPF)} at break-even 
                    represents <span className="font-bold">actual projected milk sales minus CPF costs</span>.
                  </>
                ) : (
                  <>
                    The gross cumulative revenue of {formatCurrency(breakEvenAnalysis.finalCumulativeRevenueWithoutCPF)} at break-even 
                    represents <span className="font-bold">total milk sales before CPF deductions</span>.
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueBreakEven;
import React, { useState } from 'react';

const AssetMarketValue = ({
  treeData,
  buffaloDetails,
  calculateAgeInMonths,
  getBuffaloValueByAge,
  getBuffaloValueDescription,
  calculateDetailedAssetValue,
  assetMarketValue,
  formatCurrency,
  isAssetMarketValue = false,
  startYear,
  endYear,
  yearRange
}) => {
  const [selectedYear, setSelectedYear] = useState(treeData.startYear + treeData.years);

  if (isAssetMarketValue) {
    // This is the Asset Market Value component
    const selectedAssetValue = assetMarketValue.find(a => a.year === selectedYear) || assetMarketValue[0];

    return (
      <div className="bg-gradient-to-br from-orange-50 to-red-100 rounded-3xl p-10 shadow-2xl border border-orange-200 mb-16">
        <h2 className="text-4xl font-bold text-orange-800 mb-10 text-center flex items-center justify-center gap-4">
          <span className="text-5xl">🏦</span>
          Asset Market Value Analysis ({yearRange})
        </h2>

        {/* Year Selection and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-orange-200">
            <label className="block text-lg font-semibold text-orange-700 mb-3">
              Select Year for Valuation:
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full p-3 border border-orange-300 rounded-xl text-lg"
            >
              {assetMarketValue.map((asset, index) => (
                <option key={index} value={asset.year}>
                  {asset.year} (Year {asset.year - treeData.startYear + 1})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg text-center">
            <div className="text-2xl font-bold mb-2">Total Asset Value</div>
            <div className="text-4xl font-bold mb-2">{formatCurrency(selectedAssetValue?.totalAssetValue || 0)}</div>
            <div className="text-lg opacity-90">
              {selectedAssetValue?.totalBuffaloes || 0} buffaloes
              <br />
              Including {selectedAssetValue?.motherBuffaloes || 0} mother buffaloes (60+ months)
            </div>
          </div>
        </div>

        {/* Detailed Age Category Table */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Detailed Age-Based Asset Breakdown - {selectedYear}
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-orange-50">
                  <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">Age Category</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">Unit Value</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">Count</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">Total Value</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { category: '0-6 months', unitValue: 3000 },
                  { category: '6-12 months', unitValue: 6000 },
                  { category: '12-18 months', unitValue: 12000 },
                  { category: '18-24 months', unitValue: 25000 },
                  { category: '24-30 months', unitValue: 35000 },
                  { category: '30-36 months', unitValue: 50000 },
                  { category: '36-40 months', unitValue: 50000 },
                  { category: '40-48 months', unitValue: 100000 },
                  { category: '48-60 months', unitValue: 150000 },
                  { category: '60+ months (Mother Buffalo)', unitValue: 175000 }
                ].map((item, index) => {
                  const count = selectedAssetValue?.ageCategories?.[item.category]?.count || 0;
                  const value = selectedAssetValue?.ageCategories?.[item.category]?.value || 0;
                  const percentage = selectedAssetValue?.totalAssetValue > 0
                    ? (value / selectedAssetValue.totalAssetValue * 100).toFixed(1)
                    : 0;

                  return (
                    <tr key={index} className="hover:bg-orange-50 transition-colors">
                      <td className="px-6 py-4 border-b">
                        <div className="font-semibold text-gray-900">{item.category}</div>
                      </td>
                      <td className="px-6 py-4 border-b font-semibold text-blue-600">
                        {formatCurrency(item.unitValue)}
                      </td>
                      <td className="px-6 py-4 border-b font-semibold text-purple-600">
                        {count}
                      </td>
                      <td className="px-6 py-4 border-b font-semibold text-green-600">
                        {formatCurrency(value)}
                      </td>
                      <td className="px-6 py-4 border-b">
                        <div className="flex items-center gap-3">
                          <div className="w-full bg-gray-200 rounded-sm h-4">
                            <div
                              className="bg-orange-500 h-4 rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="text-sm font-semibold text-gray-600 min-w-[50px]">
                            {percentage}%
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                  <td className="px-6 py-4 font-bold">Total</td>
                  <td className="px-6 py-4 font-bold">-</td>
                  <td className="px-6 py-4 font-bold">{selectedAssetValue?.totalBuffaloes || 0}</td>
                  <td className="px-6 py-4 font-bold">{formatCurrency(selectedAssetValue?.totalAssetValue || 0)}</td>
                  <td className="px-6 py-4 font-bold">100%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Current vs Final Asset Value */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-8 border border-blue-200 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-4">
              {formatCurrency(assetMarketValue[0]?.totalAssetValue || 0)}
            </div>
            <div className="text-lg font-semibold text-blue-700">Initial Asset Value ({startYear})</div>
            <div className="text-sm text-gray-600 mt-2">
              {assetMarketValue[0]?.totalBuffaloes || 0} buffaloes
              <br />
              {assetMarketValue[0]?.motherBuffaloes || 0} mother buffaloes (60+ months)
              <br />
              {assetMarketValue[0]?.ageCategories?.['0-6 months']?.count || 0} newborn calves
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 text-white shadow-lg text-center">
            <div className="text-3xl font-bold mb-4">
              {formatCurrency(assetMarketValue[assetMarketValue.length - 1]?.totalAssetValue || 0)}
            </div>
            <div className="text-lg font-semibold opacity-90">Final Asset Value ({endYear})</div>
            <div className="text-sm opacity-80 mt-2">
              {assetMarketValue[assetMarketValue.length - 1]?.totalBuffaloes || 0} buffaloes
              <br />
              {assetMarketValue[assetMarketValue.length - 1]?.motherBuffaloes || 0} mother buffaloes (60+ months)
              <br />
              Multiple generations with age-based valuation
            </div>
          </div>
        </div>

        {/* Asset Growth Multiple */}
        <div className="bg-white rounded-2xl p-6 border border-green-200 shadow-lg text-center mb-8">
          <div className="text-2xl font-bold text-green-600">
            Asset Growth: {((assetMarketValue[assetMarketValue.length - 1]?.totalAssetValue || 0) / (assetMarketValue[0]?.totalAssetValue || 1)).toFixed(1)}x
          </div>
          <div className="text-lg text-gray-600 mt-2">
            From {formatCurrency(assetMarketValue[0]?.totalAssetValue || 0)} to {formatCurrency(assetMarketValue[assetMarketValue.length - 1]?.totalAssetValue || 0)}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Includes value appreciation as buffaloes mature through age brackets
          </div>
        </div>

        {/* Yearly Asset Value Table ({yearRange}) */}
        <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Yearly Asset Market Value ({yearRange})</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-orange-50">
                  <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">Year</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">Total Buffaloes</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">Mother Buffaloes (60+ months)</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">Calves (0-6m)</th>
                  <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">Total Asset Value</th>
                </tr>
              </thead>
              <tbody>
                {assetMarketValue.map((data, index) => (
                  <tr
                    key={data.year}
                    className={`hover:bg-orange-50 transition-colors ${data.year === selectedYear ? 'bg-orange-50 border-l-4 border-orange-500' : ''}`}
                  >
                    <td className="px-6 py-4 border-b">
                      <div className="font-semibold text-gray-900">{data.year}</div>
                      <div className="text-sm text-gray-600">Year {index + 1}</div>
                    </td>
                    <td className="px-6 py-4 border-b font-semibold text-purple-600">
                      {data.totalBuffaloes}
                    </td>
                    <td className="px-6 py-4 border-b font-semibold text-red-600">
                      {data.motherBuffaloes}
                    </td>
                    <td className="px-6 py-4 border-b font-semibold text-green-600">
                      {data.ageCategories?.['0-6 months']?.count || 0}
                    </td>
                    <td className="px-6 py-4 border-b font-semibold text-orange-600">
                      {formatCurrency(data.totalAssetValue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // This is the Buffalo Value By Age component
  const detailedAssetValue = calculateDetailedAssetValue(selectedYear);

  return (
    <div className="bg-gradient-to-br from-purple-50 to-indigo-100 rounded-3xl p-10 xl:py-5 shadow-2xl border border-purple-200 mb-16 xl:mb-8 xl:mx-25">
      <h2 className="text-4xl xl:text-3xl font-bold text-purple-800 mb-10 xl:mb-7 text-center flex items-center justify-center gap-4">
        <span className="text-5xl xl:text-3xl">💰</span>
        Buffalo Value By Age (Market Valuation)
      </h2>
      <div className='grid xl:grid-cols-2 md:grid-cols-1'>
        {/* Year Selection */}
        <div className="bg-white rounded-2xl p-6 border border-purple-200 mb-8 max-w-md mx-auto xl:w-100 xl:h-">
          <label className="block text-lg font-semibold text-gray-700 mb-3">
            Select Year for Valuation:
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="w-full p-3 xl:p-2 border border-purple-300 rounded-xl xl:text-sm"
          >
            {Array.from({ length: 10 }, (_, i) => (
              <option key={i} value={treeData.startYear + i}>
                {treeData.startYear + i} (Year {i + 1})
              </option>
            ))}
          </select>
        </div>
        {/* Total Value Summary */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl p-8 xl:p-4 xl:w-sm text-white text-center shadow-2xl mb-8">
          <div className="text-2xl font-bold mb-2 xl:text-xl">Total Asset Value in {selectedYear}</div>
          <div className="text-5xl font-bold mb-4 xl:text-2xl">{formatCurrency(detailedAssetValue.totalValue)}</div>
          <div className="text-lg opacity-90 xl:text-sm">
            {detailedAssetValue.totalCount} buffaloes | Average: {formatCurrency(detailedAssetValue.totalValue / detailedAssetValue.totalCount)}
          </div>
        </div>
      </div>

      {/* Age Group Breakdown */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-lg mb-8 xl:w-">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Age-Based Valuation Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-gray-50 to-purple-50">
                <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">Age Group</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">Unit Value</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">Count</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">Total Value</th>
                <th className="px-6 py-4 text-left font-bold text-gray-700 border-b">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(detailedAssetValue.ageGroups)
                .filter(([_, data]) => data.count > 0)
                .map(([ageGroup, data], index) => (
                  <tr key={ageGroup} className="hover:bg-purple-50 transition-colors">
                    <td className="px-6 py-4 border-b">
                      <div className="font-semibold text-gray-900">{ageGroup}</div>
                    </td>
                    <td className="px-6 py-4 border-b font-semibold text-blue-600">
                      {formatCurrency(data.unitValue)}
                    </td>
                    <td className="px-6 py-4 border-b font-semibold text-purple-600">
                      {data.count}
                    </td>
                    <td className="px-6 py-4 border-b font-semibold text-green-600">
                      {formatCurrency(data.value)}
                    </td>
                    <td className="px-6 py-4 border-b">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-gray-200 rounded-sm h-4">
                          <div
                            className="bg-purple-500 h-4 rounded-full"
                            style={{ width: `${(data.value / detailedAssetValue.totalValue) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-sm font-semibold text-gray-600 min-w-[50px]">
                          {((data.value / detailedAssetValue.totalValue) * 100).toFixed(1)}%
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
            <tfoot>
              <tr className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
                <td className="px-6 py-4 font-bold">Total</td>
                <td className="px-6 py-4 font-bold">-</td>
                <td className="px-6 py-4 font-bold">{detailedAssetValue.totalCount}</td>
                <td className="px-6 py-4 font-bold">{formatCurrency(detailedAssetValue.totalValue)}</td>
                <td className="px-6 py-4 font-bold">100%</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Price Schedule */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-100 rounded-2xl p-8 border border-blue-200">
        <h3 className="text-2xl font-bold text-black-800 mb-6 text-center"> Age-Based Price Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { age: '0-6 months ', price: '₹3,000', color: 'from-blue-100 to-blue-200', desc: 'New born calves' },
            { age: '6-12 months', price: '₹6,000', color: 'from-blue-200 to-blue-300', desc: 'Growing' },
            { age: '12-18 months', price: '₹12,000', color: 'from-green-100 to-green-200', desc: 'Growing' },
            { age: '18-24 months', price: '₹25,000', color: 'from-green-200 to-green-300', desc: 'Growing' },
            { age: '24-30 months', price: '₹35,000', color: 'from-orange-100 to-orange-200', desc: 'Growing' },
            { age: '30-36 months', price: '₹50,000', color: 'from-orange-200 to-orange-300', desc: 'Growing' },
            { age: '36-40 months', price: '₹50,000', color: 'from-red-100 to-red-200', desc: 'Transition' },
            { age: '40-48 months', price: '₹1,00,000', color: 'from-red-200 to-red-300', desc: '4+ years' },
            { age: '48-60 months', price: '₹1,50,000', color: 'from-purple-100 to-purple-200', desc: '5th year (4+ years)' },
            { age: '60+ months (Mother Buffalo)', price: '₹1,75,000', color: 'from-purple-200 to-purple-300', desc: '5+ years (Mother buffaloes)' }
          ].map((item, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${item.color} rounded-xl p-6 xl:p-4 border border-gray-200 shadow-lg`}
            >
              <div className="text-xl font-bold text-gray-800 mb-2">{item.age}</div>
              <div className="text-xl font-bold text-gray-900">{item.price}</div>
              <div className="text-sm text-gray-600 mt-2">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetMarketValue;
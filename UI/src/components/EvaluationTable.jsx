import { useState, useMemo } from 'react';
import ScoreCircle from './ScoreCircle';

export default function EvaluationTable({ data }) {
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Process and group the data by category
  const groupedData = useMemo(() => {
    const grouped = {};

    const flatten = (obj, parent = '') => {
      for (const key in obj) {
        const value = obj[key];
        const fullKey = parent || key;

        if (value && typeof value === 'object' && 'score' in value) {
          if (!grouped[fullKey]) grouped[fullKey] = [];
          grouped[fullKey].push({
            subcategory: key,
            score: value.score,
            rationale: value.rationale || '',
            suggestion: value.suggestion || 'None'
          });
        } else if (typeof value === 'object') {
          flatten(value, fullKey + `${key == fullKey ? '' : ' → ' + key}`);
        }
      }
    };

    flatten(data);
    return grouped;
  }, [data]);

  // Calculate average scores per category
  const categoryAverages = useMemo(() => {
    const averages = {};
  
    for (const category in groupedData) {
      const scores = groupedData[category]
        .map(item => {
          const parsed = Number(item.score);
          return Number.isFinite(parsed) ? parsed : null;
        })
        .filter(score => score !== null);
  
      const average = scores.length > 0
        ? scores.reduce((sum, score) => sum + score, 0) / scores.length
        : 0;
  
      averages[category] = average;
    }
  
    return averages;
  }, [groupedData]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="rounded-lg overflow-hidden relative" 
    style={{
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%)',
    }}>
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-lg p-[1px] bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="h-full w-full rounded-lg bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"></div>
      </div>
      
      <div className="relative overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800 border border-blue-800">
          <thead>
            <tr className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">Score</th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700"></th>
            </tr>
          </thead>
          <tbody className="bg-transparent divide-y divide-slate-800">
            {Object.keys(groupedData).map((category, idx) => (
              <>
                <tr 
                  key={category} 
                  className={`cursor-pointer hover:bg-slate-900/50 transition-all duration-200 ${idx % 2 === 0 ? 'bg-transparent' : 'bg-transparent'}`}
                  onClick={() => toggleCategory(category)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">
                    {category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    <div className="flex items-center">
                      <ScoreCircle score={categoryAverages[category]} size={28} />
                      <span className="ml-2 font-medium">{categoryAverages[category].toFixed(1)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-500 hover:text-blue-400 transition-colors duration-200">
                      {expandedCategories[category] ? 'Hide Details' : 'View Details'}
                    </button>
                  </td>
                </tr>
                
                {/* Expanded subcategories */}
                {expandedCategories[category] && (
                  <tr className='border border-blue-800'>
                    <td colSpan="3" className="px-0 py-0 border-b border-blue-800">
                      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 animate-fadeIn border-l border-r border-blue-800">
                        <table className="min-w-full divide-y divide-slate-800">
                          <thead>
                            <tr className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800">
                              <th className="px-6 py-2 text-left text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 uppercase tracking-wider">Subcategory</th>
                              <th className="px-6 py-2 text-left text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 uppercase tracking-wider">Score</th>
                              <th className="px-6 py-2 text-left text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 uppercase tracking-wider">Rationale</th>
                              <th className="px-6 py-2 text-left text-xs font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700 uppercase tracking-wider">Suggestions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-transparent divide-y divide-slate-800 border-b border-blue-800">
                            {groupedData[category].map((item, i) => (
                              <tr key={i} className={`${i % 2 === 0 ? 'bg-transparent' : 'bg-transparent'} transition-all duration-200`}>
                                <td className="px-6 py-3 text-sm text-gray-300">{item.subcategory}</td>
                                <td className="px-6 py-3 text-sm text-gray-300">
                                  <ScoreCircle score={item.score} size={24} />
                                </td>
                                <td className="px-6 py-3 text-sm text-gray-400">{item.rationale}</td>
                                <td className="px-6 py-3 text-sm text-gray-400">{item.suggestion}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CallRecord } from '@/data/callData';

interface EmotionHeatmapProps {
  data: CallRecord[];
}

interface EmotionRow {
  emotion: string;
  resolved: number;
  unresolved: number;
  escalated: number;
}

const EmotionHeatmap: React.FC<EmotionHeatmapProps> = ({ data }) => {
  const heatmapData = React.useMemo(() => {
    const emotions = ['anger', 'frustration', 'confusion', 'anxiety', 'sadness'];
    const outcomes = ['resolved', 'unresolved', 'escalated'];
    
    const matrix: EmotionRow[] = emotions.map(emotion => {
      const row: EmotionRow = { emotion, resolved: 0, unresolved: 0, escalated: 0 };
      outcomes.forEach(outcome => {
        const emotionCalls = data.filter(call => 
          call.emotions.includes(emotion) && call.outcome === outcome
        );
        row[outcome as keyof Omit<EmotionRow, 'emotion'>] = emotionCalls.length;
      });
      return row;
    });
    
    return matrix;
  }, [data]);

  const getIntensityColor = (value: number, maxValue: number) => {
    const intensity = value / maxValue;
    if (intensity === 0) return 'bg-gray-100';
    if (intensity < 0.3) return 'bg-red-200';
    if (intensity < 0.6) return 'bg-red-400';
    return 'bg-red-600';
  };

  const maxValue = Math.max(...heatmapData.flatMap(row => 
    [row.resolved, row.unresolved, row.escalated]
  ));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emotion-to-Outcome Mapping</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-2 font-medium">Emotion</th>
                <th className="text-center p-2 font-medium">Resolved</th>
                <th className="text-center p-2 font-medium">Unresolved</th>
                <th className="text-center p-2 font-medium">Escalated</th>
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row, index) => (
                <tr key={index}>
                  <td className="p-2 font-medium capitalize">{row.emotion}</td>
                  <td className="p-2 text-center">
                    <div className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                      getIntensityColor(row.resolved, maxValue)
                    } ${row.resolved > maxValue * 0.6 ? 'text-white' : 'text-gray-800'}`}>
                      {row.resolved}
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <div className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                      getIntensityColor(row.unresolved, maxValue)
                    } ${row.unresolved > maxValue * 0.6 ? 'text-white' : 'text-gray-800'}`}>
                      {row.unresolved}
                    </div>
                  </td>
                  <td className="p-2 text-center">
                    <div className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                      getIntensityColor(row.escalated, maxValue)
                    } ${row.escalated > maxValue * 0.6 ? 'text-white' : 'text-gray-800'}`}>
                      {row.escalated}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-600">
          <span>Intensity:</span>
          <div className="bg-gray-100 px-2 py-1 rounded">Low</div>
          <div className="bg-red-200 px-2 py-1 rounded">Medium</div>
          <div className="bg-red-600 text-white px-2 py-1 rounded">High</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionHeatmap;

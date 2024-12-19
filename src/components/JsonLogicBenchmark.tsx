// src/components/JsonLogicBenchmark.tsx
import React, { useState } from 'react';
import jsonLogic from 'json-logic-js';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const JsonLogicBenchmark = () => {
    const [benchmarkResults, setBenchmarkResults] = useState([]);
    const [currentTest, setCurrentTest] = useState('');

    // Sample test cases with increasing complexity
    const testCases = [
        {
            name: 'Simple Comparison',
            rule: { "==": [1, 1] },
            data: {}
        },
        {
            name: 'Data Variable Access',
            rule: { ">=": [{ "var": "temp" }, 20] },
            data: { temp: 25 }
        },
        {
            name: 'Nested Logic',
            rule: {
                "and": [
                    { ">=": [{ "var": "temp" }, 20] },
                    { "<=": [{ "var": "temp" }, 30] }
                ]
            },
            data: { temp: 25 }
        },
        {
            name: 'Complex Logic',
            rule: {
                "if": [
                    { ">=": [{ "var": "temp" }, 30] },
                    "hot",
                    {
                        "if": [
                            { ">=": [{ "var": "temp" }, 20] },
                            "warm",
                            "cold"
                        ]
                    }
                ]
            },
            data: { temp: 25 }
        },
        {
            name: 'Array Operations',
            rule: {
                "all": [
                    { "var": "readings" },
                    { ">=": [{ "var": "" }, 20] }
                ]
            },
            data: { readings: [25, 28, 22, 24] }
        },
        {
            name: 'Complex Data Access',
            rule: {
                "and": [
                    { ">=": [{ "var": "sensors.main.temp" }, 20] },
                    {
                        "all": [
                            { "var": "sensors.secondary[*].temp" },
                            { ">=": [{ "var": "" }, 15] }
                        ]
                    }
                ]
            },
            data: {
                sensors: {
                    main: { temp: 25 },
                    secondary: [
                        { temp: 22 },
                        { temp: 21 },
                        { temp: 23 }
                    ]
                }
            }
        }
    ];

    const runBenchmark = () => {
        const results = [];

        testCases.forEach(testCase => {
            console.log('Running test:', testCase.name);
            setCurrentTest(testCase.name);
            const iterations = 10000;
            const startTime = performance.now();

            for (let i = 0; i < iterations; i++) {
                jsonLogic.apply(testCase.rule, testCase.data);
            }

            const endTime = performance.now();
            const averageTime = (endTime - startTime) / iterations;

            results.push({
                name: testCase.name,
                timeMs: averageTime.toFixed(4),
                complexity: JSON.stringify(testCase.rule).length,
                result: JSON.stringify(jsonLogic.apply(testCase.rule, testCase.data))
            });
        });

        setBenchmarkResults(results);
        setCurrentTest('');
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle>json-logic-js Performance Benchmark</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={runBenchmark}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            Run Benchmark
                        </button>

                        {currentTest && (
                            <div className="text-sm text-gray-600">
                                Running: {currentTest}...
                            </div>
                        )}
                    </div>

                    {benchmarkResults.length > 0 && (
                        <>
                            <div className="h-64">
                                <LineChart
                                    width={600}
                                    height={250}
                                    data={benchmarkResults}
                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                    <YAxis label={{ value: 'Time (ms)', angle: -90, position: 'insideLeft' }} />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="timeMs"
                                        stroke="#8884d8"
                                        name="Execution Time (ms)"
                                        dot={{ strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </div>

                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50">
                                            <th className="text-left p-2 border-b">Test Case</th>
                                            <th className="text-left p-2 border-b">Avg. Time (ms)</th>
                                            <th className="text-left p-2 border-b">Rule Complexity</th>
                                            <th className="text-left p-2 border-b">Result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {benchmarkResults.map((result, index) => (
                                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                                <td className="p-2 border-b">{result.name}</td>
                                                <td className="p-2 border-b font-mono">{result.timeMs}</td>
                                                <td className="p-2 border-b font-mono">{result.complexity}</td>
                                                <td className="p-2 border-b font-mono max-w-xs truncate">
                                                    {result.result}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default JsonLogicBenchmark;
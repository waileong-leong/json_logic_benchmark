// src/components/JsonLogicBenchmark.tsx
import React, { useState } from 'react';
import jsonLogic from 'json-logic-js';
import * as Collapsible from '@radix-ui/react-collapsible';
import { ChevronDownIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const JsonLogicBenchmark = () => {
    const [benchmarkResults, setBenchmarkResults] = useState([]);
    const [currentTest, setCurrentTest] = useState('');

    // Sample test cases with increasing complexity
    const testCases = [
        {
            name: 'Simple Comparison',
            rule: { "==": [{ "var": "value" }, 1] },
            data: Array.from({ length: 100 }, () => ({ value: 1 }))
        },
        {
            name: 'Data Variable Access',
            rule: { ">=": [{ "var": "temp" }, 20] },
            data: Array.from({ length: 100 }, () => ({ temp: 25 }))
        },
        {
            name: 'Nested Logic',
            rule: {
                "and": [
                    { ">=": [{ "var": "temp" }, 20] },
                    { "<=": [{ "var": "temp" }, 30] }
                ]
            },
            data: Array.from({ length: 100 }, () => ({ temp: 25 }))
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
            data: Array.from({ length: 100 }, () => ({ temp: 25 }))
        },
        {
            name: 'Array Operations',
            rule: { ">=": [{ "var": "reading" }, 20] },
            data: Array.from({ length: 100 }, () => ({ reading: Math.floor(Math.random() * 10) + 20 }))
        },
        {
            name: 'Complex Data Access',
            rule: {
                "and": [
                    { ">=": [{ "var": "main.temp" }, 20] },
                    { ">=": [{ "var": "secondary.temp" }, 15] }
                ]
            },
            data: Array.from({ length: 100 }, () => ({
                main: { temp: 25 },
                secondary: { temp: 22 }
            }))
        },
        {
            name: 'Large Dataset Processing',
            rule: {
                "and": [
                    { ">=": [{ "var": "temp" }, 20] },
                    { "<=": [{ "var": "temp" }, 50] },
                    { ">=": [{ "var": "humidity" }, 20] },
                    { "<=": [{ "var": "humidity" }, 50] }
                ]
            },
            data: Array.from({ length: 50000 }, () => ({
                temp: Math.random() * 100,
                humidity: Math.random() * 100,
                field1: 1,
                field2: 2,
                field3: 3,
                field4: 4,
                field5: 5,
                field6: 6,
                field7: 7,
                field8: 8,
                field9: 9,
                field10: 10

            }))
        }
    ];

    const runBenchmark = () => {
        const results = [];

        testCases.forEach(testCase => {
            console.log('Running test:', testCase.name);
            console.log("data", testCase.data);
            setCurrentTest(testCase.name);
            const iterations = 3;
            const startTime = performance.now();

            for (let i = 0; i < iterations; i++) {
                testCase.data.forEach(item => {
                    jsonLogic.apply(testCase.rule, item);
                });
            }

            const endTime = performance.now();
            const averageTime = (endTime - startTime) / iterations;

            results.push({
                name: testCase.name,
                timeMs: averageTime.toFixed(4),
                complexity: JSON.stringify(testCase.rule).length,
                result: JSON.stringify(testCase.data.map(item => jsonLogic.apply(testCase.rule, item)))
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
                                            <th className="text-left p-2 border-b">Rule</th>
                                            <th className="text-left p-2 border-b">Data & Results</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {benchmarkResults.map((result, index) => {
                                            const testCase = testCases[index];
                                            return (
                                                <Collapsible.Root key={index}>
                                                    <tr className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                                                        <td className="p-2 border-b">
                                                            <Collapsible.Trigger className="flex items-center gap-2 w-full text-left">
                                                                <span className="inline-block">
                                                                    <ChevronRightIcon className="collapsible-icon" />
                                                                </span>
                                                                {result.name}
                                                            </Collapsible.Trigger>
                                                        </td>
                                                        <td className="p-2 border-b font-mono">{result.timeMs}</td>
                                                        <td className="p-2 border-b font-mono">{result.complexity}</td>
                                                        <td className="p-2 border-b font-mono">
                                                            <pre className="max-w-xs overflow-x-auto">
                                                                {JSON.stringify(testCase.rule, null, 2)}
                                                            </pre>
                                                        </td>
                                                    </tr>
                                                    <Collapsible.Content>
                                                        <tr>
                                                            <td colSpan={4}>
                                                                <div className="p-4 bg-gray-50">
                                                                    <table className="nested-table w-full">
                                                                        <thead>
                                                                            <tr>
                                                                                <th className="px-2">Data</th>
                                                                                <th className="px-2">Result</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {testCase.data.slice(0, 100).map((item, idx) => (
                                                                                <tr key={idx}>
                                                                                    <td className="px-2">
                                                                                        <pre className="max-w-xs overflow-x-auto">
                                                                                            {JSON.stringify(item, null, 2)}
                                                                                        </pre>
                                                                                    </td>
                                                                                    <td className="px-2">
                                                                                        <pre className="max-w-xs overflow-x-auto">
                                                                                            {JSON.stringify(JSON.parse(result.result)[idx], null, 2)}
                                                                                        </pre>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    </Collapsible.Content>
                                                </Collapsible.Root>
                                            );
                                        })}
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
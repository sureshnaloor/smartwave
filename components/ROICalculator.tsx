'use client';

import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function ROICalculator() {
    const [teamSize, setTeamSize] = useState(50);
    const [eventsPerYear, setEventsPerYear] = useState(12);
    const [cardCost, setCardCost] = useState(200);
    const chartRef = useRef<HTMLDivElement>(null);

    // Calculate ROI
    const calculateSavings = () => {
        const cardsPerPerson = eventsPerYear * 50; // Average cards per event
        const totalCards = teamSize * cardsPerPerson;
        const traditionalCost = (totalCards / 1000) * cardCost;
        const smartwaveCost = teamSize * 79 * 12; // Professional plan annual
        const savings = traditionalCost - smartwaveCost;
        return Math.max(0, savings);
    };

    const calculateTrees = () => {
        const cardsPerPerson = eventsPerYear * 50;
        const totalCards = teamSize * cardsPerPerson;
        // Rough estimate: 1 tree = ~8333 cards (based on industry averages)
        return Math.round(totalCards / 8333);
    };

    const annualSavings = calculateSavings();
    const treesSaved = calculateTrees();

    useEffect(() => {
        if (!chartRef.current) return;

        // Detect theme
        const isDark = document.documentElement.classList.contains('dark') || 
                      !document.documentElement.classList.contains('light');
        
        const textColor = isDark ? '#e8e8e8' : '#374151';
        const tooltipBg = isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)';
        const tooltipTextColor = isDark ? '#ffffff' : '#1f2937';
        const splitLineColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

        const chart = echarts.init(chartRef.current);

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: tooltipBg,
                borderColor: '#00d4aa',
                textStyle: {
                    color: tooltipTextColor
                }
            },
            xAxis: {
                type: 'category',
                data: ['Traditional', 'SmartWave'],
                axisLine: {
                    lineStyle: {
                        color: textColor
                    }
                },
                axisLabel: {
                    color: textColor
                }
            },
            yAxis: {
                type: 'value',
                name: 'Cost ($)',
                nameTextStyle: {
                    color: textColor
                },
                axisLine: {
                    lineStyle: {
                        color: textColor
                    }
                },
                axisLabel: {
                    color: textColor,
                    formatter: (value: number) => `$${value / 1000}k`
                },
                splitLine: {
                    lineStyle: {
                        color: splitLineColor
                    }
                }
            },
            series: [
                {
                    name: 'Annual Cost',
                    type: 'bar',
                    data: [
                        {
                            value: (teamSize * eventsPerYear * 50 / 1000) * cardCost,
                            itemStyle: { color: '#ff3b30' }
                        },
                        {
                            value: teamSize * 79 * 12,
                            itemStyle: { color: '#00d4aa' }
                        }
                    ],
                    label: {
                        show: true,
                        position: 'top',
                        color: textColor,
                        formatter: (params: any) => `$${Math.round(params.value / 1000)}k`
                    }
                }
            ]
        };

        chart.setOption(option);

        const handleResize = () => {
            chart.resize();
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.dispose();
        };
    }, [teamSize, eventsPerYear, cardCost]);

    return (
        <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                    Calculate Your <span className="text-gradient">ROI</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-smart-silver/80 mb-8">
                    See how much your business can save with SmartWave's digital business cards. Factor in printing costs, environmental impact, and networking efficiency.
                </p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Team Size</label>
                        <input
                            type="range"
                            id="teamSize"
                            min="1"
                            max="1000"
                            value={teamSize}
                            onChange={(e) => setTeamSize(Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600 dark:text-smart-silver/60 mt-1">
                            <span>1</span>
                            <span id="teamSizeValue">{teamSize}</span>
                            <span>1000+</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Annual Events per Person</label>
                        <input
                            type="range"
                            id="eventsPerYear"
                            min="1"
                            max="52"
                            value={eventsPerYear}
                            onChange={(e) => setEventsPerYear(Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600 dark:text-smart-silver/60 mt-1">
                            <span>1</span>
                            <span id="eventsValue">{eventsPerYear}</span>
                            <span>52</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Current Card Cost (per 1000)</label>
                        <input
                            type="range"
                            id="cardCost"
                            min="50"
                            max="500"
                            value={cardCost}
                            onChange={(e) => setCardCost(Number(e.target.value))}
                            className="w-full"
                        />
                        <div className="flex justify-between text-sm text-gray-600 dark:text-smart-silver/60 mt-1">
                            <span>$50</span>
                            <span id="costValue">${cardCost}</span>
                            <span>$500</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="roi-calculator p-8">
                <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Your Annual Savings</h3>
                <div ref={chartRef} className="w-full h-80 mb-6"></div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-smart-teal" id="annualSavings">
                            ${Math.round(annualSavings).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-smart-silver/60">Annual Savings</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-smart-amber" id="treesSaved">
                            {treesSaved}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-smart-silver/60">Trees Saved</div>
                    </div>
                </div>
            </div>
        </div>
    );
}


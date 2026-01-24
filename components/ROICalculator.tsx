'use client';

import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useCountry } from "@/context/CountryContext";
import { currencyConfig, ProductType } from "@/lib/currencyConfig";

export default function ROICalculator() {
    const { selectedCountry } = useCountry();
    const currency = currencyConfig[selectedCountry.currency] || currencyConfig.USD;

    const [teamSize, setTeamSize] = useState(50);
    const [eventsPerYear, setEventsPerYear] = useState(6);
    const [cardCost, setCardCost] = useState(200); // Cost per 1000 traditional cards
    const chartRef = useRef<HTMLDivElement>(null);

    const premiumRate = currency.rates.premium;

    // Calculate ROI over 5 years
    const calculateSavings = () => {
        const cardsPerPerson = eventsPerYear * 50;
        const totalCardsPerYear = teamSize * cardsPerPerson;
        const traditionalCost5Years = (totalCardsPerYear / 1000) * cardCost * 5;
        // Smartwave: one card per team member at premium rate, lasts 5 years
        const smartwaveCost5Years = teamSize * premiumRate;
        const savings5Years = traditionalCost5Years - smartwaveCost5Years;
        return Math.max(0, savings5Years / 5);
    };

    const calculate5YearCosts = () => {
        const cardsPerPerson = eventsPerYear * 50;
        const totalCardsPerYear = teamSize * cardsPerPerson;
        const traditionalCost5Years = (totalCardsPerYear / 1000) * cardCost * 5;
        const smartwaveCost5Years = teamSize * premiumRate;
        return {
            traditional: traditionalCost5Years,
            smartwave: smartwaveCost5Years,
            savings: traditionalCost5Years - smartwaveCost5Years
        };
    };

    const calculateTrees = () => {
        const cardsPerPerson = eventsPerYear * 50;
        const totalCards = teamSize * cardsPerPerson;
        return Math.round(totalCards / 8333);
    };

    const annualSavings = calculateSavings();
    const treesSaved = calculateTrees();
    const costs5Years = calculate5YearCosts();

    useEffect(() => {
        if (!chartRef.current) return;

        const { traditional: traditionalCost5Years, smartwave: smartwaveCost5Years } = calculate5YearCosts();

        // ... rest of useEffect remains similar but uses currency.symbol ...
        const htmlElement = document.documentElement;
        // ...
        const isDark = htmlElement.classList.contains('dark') || (!htmlElement.classList.contains('light') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        const textColor = isDark ? '#ffffff' : '#000000';
        const tooltipBg = isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)';
        const tooltipTextColor = isDark ? '#ffffff' : '#1f2937';
        const splitLineColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)';

        const chart = echarts.init(chartRef.current);

        const option = {
            backgroundColor: 'transparent',
            tooltip: {
                trigger: 'axis',
                backgroundColor: tooltipBg,
                borderColor: '#00d4aa',
                textStyle: { color: tooltipTextColor }
            },
            xAxis: {
                type: 'category',
                data: ['Traditional', 'SmartWave'],
                axisLine: { lineStyle: { color: textColor } },
                axisLabel: { color: textColor, fontSize: 14, fontWeight: 'bold' }
            },
            yAxis: {
                type: 'value',
                name: `Cost (${currency.symbol})`,
                nameTextStyle: { color: textColor, fontSize: 14, fontWeight: 'bold' },
                axisLine: { lineStyle: { color: textColor } },
                axisLabel: {
                    color: textColor,
                    fontSize: 12,
                    formatter: (value: number) => {
                        const sym = currency.symbol;
                        if (value >= 1000000) return `${sym}${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000) return `${sym}${(value / 1000).toFixed(1)}k`;
                        return `${sym}${Math.round(value)}`;
                    }
                },
                splitLine: { lineStyle: { color: splitLineColor } }
            },
            series: [
                {
                    name: '5-Year Cost',
                    type: 'bar',
                    data: [
                        { value: traditionalCost5Years, itemStyle: { color: '#ff3b30' } },
                        { value: smartwaveCost5Years, itemStyle: { color: '#00d4aa' } }
                    ],
                    label: {
                        show: true,
                        position: 'top',
                        color: textColor,
                        fontSize: 14,
                        fontWeight: 'bold',
                        formatter: (params: any) => {
                            const value = params.value;
                            const sym = currency.symbol;
                            if (value >= 1000000) return `${sym}${(value / 1000000).toFixed(1)}M`;
                            if (value >= 1000) return `${sym}${(value / 1000).toFixed(1)}k`;
                            return `${sym}${Math.round(value)}`;
                        }
                    }
                }
            ]
        };

        chart.setOption(option, { notMerge: true });
        // ... resize handlers ...
        const handleResize = () => chart.resize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.dispose();
        };
    }, [teamSize, eventsPerYear, cardCost, currency.symbol, premiumRate]);

    return (
        <div className="roi-calculator-wrapper grid lg:grid-cols-2 gap-12 items-center">
            <div>
                <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                    Calculate Your <span className="text-gradient">ROI</span>
                </h2>
                <p className="text-xl text-gray-600 dark:text-white/90 mb-8">
                    See how much your business can save with SmartWave's digital business cards. Factor in printing costs, environmental impact, and networking efficiency.
                </p>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Team Size</label>
                        <div className="relative group">
                            <input
                                type="range"
                                id="teamSize"
                                min="1"
                                max="100"
                                value={teamSize}
                                onChange={(e) => setTeamSize(Number(e.target.value))}
                                className="w-full slider-with-tooltip"
                            />
                            <div className="slider-tooltip" style={{ left: `${((teamSize - 1) / (100 - 1)) * 100}%` }}>
                                {teamSize}
                            </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-800 dark:text-white/80 mt-1">
                            <span>1</span>
                            <span>100+</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Annual Events per Person</label>
                        <div className="relative group">
                            <input
                                type="range"
                                min="1"
                                max="12"
                                value={eventsPerYear}
                                onChange={(e) => setEventsPerYear(Number(e.target.value))}
                                className="w-full slider-with-tooltip"
                            />
                            <div className="slider-tooltip" style={{ left: `${((eventsPerYear - 1) / (12 - 1)) * 100}%` }}>
                                {eventsPerYear}
                            </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-800 dark:text-white/80 mt-1">
                            <span>1</span>
                            <span>12</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">
                            Current Card Cost (per 1000)
                        </label>
                        <div className="relative group">
                            <input
                                type="range"
                                min="50"
                                max="500"
                                value={cardCost}
                                onChange={(e) => setCardCost(Number(e.target.value))}
                                className="w-full slider-with-tooltip"
                            />
                            <div className="slider-tooltip" style={{ left: `${((cardCost - 50) / (500 - 50)) * 100}%` }}>
                                {currency.symbol}{cardCost}
                            </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-800 dark:text-white/80 mt-1">
                            <span>{currency.symbol}50</span>
                            <span>{currency.symbol}500</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="roi-calculator p-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">5-Year Cost Comparison</h3>
                <p className="text-sm text-gray-600 dark:text-white/80 mb-6">
                    SmartWave: One card per team member ({currency.symbol}{premiumRate}) lasts 5 years. Traditional cards: Recurring cost based on events.
                </p>
                <div ref={chartRef} className="w-full h-80 mb-6"></div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-smart-teal">
                            {currency.symbol}{Math.round(annualSavings).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-white/80">Annual Savings</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-smart-amber">
                            {treesSaved}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-white/80">Trees Saved</div>
                    </div>
                </div>
            </div>
        </div>
    );
}


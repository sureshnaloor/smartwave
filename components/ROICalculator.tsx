'use client';

import { useState, useEffect, useRef } from 'react';
import * as echarts from 'echarts';

export default function ROICalculator() {
    const [teamSize, setTeamSize] = useState(50);
    const [eventsPerYear, setEventsPerYear] = useState(6);
    const [cardCost, setCardCost] = useState(200);
    const chartRef = useRef<HTMLDivElement>(null);

    // Calculate ROI over 5 years
    const calculateSavings = () => {
        const cardsPerPerson = eventsPerYear * 50; // Average cards per event assumed 50 per person
        const totalCardsPerYear = teamSize * cardsPerPerson;
        // Traditional cards: cost per year * 5 years
        const traditionalCost5Years = (totalCardsPerYear / 1000) * cardCost * 5;
        // Smartwave: one card per team member at $79, lasts 5 years
        const smartwaveCost5Years = teamSize * 79;
        const savings5Years = traditionalCost5Years - smartwaveCost5Years;
        // Annual savings = total savings / 5
        return Math.max(0, savings5Years / 5);
    };

    const calculate5YearCosts = () => {
        const cardsPerPerson = eventsPerYear * 50;
        const totalCardsPerYear = teamSize * cardsPerPerson;
        const traditionalCost5Years = (totalCardsPerYear / 1000) * cardCost * 5;
        const smartwaveCost5Years = teamSize * 79;
        return {
            traditional: traditionalCost5Years,
            smartwave: smartwaveCost5Years,
            savings: traditionalCost5Years - smartwaveCost5Years
        };
    };

    const calculateTrees = () => {
        const cardsPerPerson = eventsPerYear * 50;
        const totalCards = teamSize * cardsPerPerson;
        // Rough estimate: 1 tree = ~8333 cards (based on industry averages)
        return Math.round(totalCards / 8333);
    };

    const annualSavings = calculateSavings();
    const treesSaved = calculateTrees();
    const costs5Years = calculate5YearCosts();

    useEffect(() => {
        if (!chartRef.current) return;

        // Calculate 5-year costs
        const cardsPerPerson = eventsPerYear * 50;
        const totalCardsPerYear = teamSize * cardsPerPerson;
        const traditionalCost5Years = (totalCardsPerYear / 1000) * cardCost * 5;
        const smartwaveCost5Years = teamSize * 79;

        // Improved theme detection - check multiple sources
        const htmlElement = document.documentElement;
        const hasLightClass = htmlElement.classList.contains('light');
        const hasDarkClass = htmlElement.classList.contains('dark');

        // If light class is explicitly set, it's light mode
        // If dark class is set, it's dark mode
        // Otherwise, check system preference
        let isDark = false;
        if (hasLightClass) {
            isDark = false;
        } else if (hasDarkClass) {
            isDark = true;
        } else {
            isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        }

        // Force black in light mode, white in dark mode
        const textColor = isDark ? '#ffffff' : '#000000';
        const tooltipBg = isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)';
        const tooltipTextColor = isDark ? '#ffffff' : '#1f2937';
        const splitLineColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)';

        console.log('ROI Chart Init:', { hasLightClass, hasDarkClass, isDark, textColor });

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
                    color: textColor,
                    fontSize: 14,
                    fontWeight: 'bold'
                }
            },
            yAxis: {
                type: 'value',
                name: 'Cost ($)',
                nameTextStyle: {
                    color: textColor,
                    fontSize: 14,
                    fontWeight: 'bold'
                },
                axisLine: {
                    lineStyle: {
                        color: textColor
                    }
                },
                axisLabel: {
                    color: textColor,
                    fontSize: 12,
                    formatter: (value: number) => {
                        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                        if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
                        return `$${Math.round(value)}`;
                    }
                },
                splitLine: {
                    lineStyle: {
                        color: splitLineColor
                    }
                }
            },
            series: [
                {
                    name: '5-Year Cost',
                    type: 'bar',
                    data: [
                        {
                            value: traditionalCost5Years,
                            itemStyle: { color: '#ff3b30' }
                        },
                        {
                            value: smartwaveCost5Years,
                            itemStyle: { color: '#00d4aa' }
                        }
                    ],
                    label: {
                        show: true,
                        position: 'top',
                        color: textColor,
                        fontSize: 14,
                        fontWeight: 'bold',
                        formatter: (params: any) => {
                            const value = params.value;
                            if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
                            if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
                            return `$${Math.round(value)}`;
                        }
                    }
                }
            ]
        };

        chart.setOption(option, { notMerge: true });

        const handleResize = () => {
            chart.resize();
        };

        // Listen for theme changes
        const handleThemeChange = () => {
            const currentHtmlElement = document.documentElement;
            const currentHasLightClass = currentHtmlElement.classList.contains('light');
            const currentHasDarkClass = currentHtmlElement.classList.contains('dark');

            let currentIsDark = false;
            if (currentHasLightClass) {
                currentIsDark = false;
            } else if (currentHasDarkClass) {
                currentIsDark = true;
            } else {
                currentIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            }

            const currentTextColor = currentIsDark ? '#ffffff' : '#000000';
            const currentSplitLineColor = currentIsDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)';

            chart.setOption({
                xAxis: {
                    axisLine: {
                        lineStyle: {
                            color: currentTextColor
                        }
                    },
                    axisLabel: {
                        color: currentTextColor
                    }
                },
                yAxis: {
                    nameTextStyle: {
                        color: currentTextColor
                    },
                    axisLine: {
                        lineStyle: {
                            color: currentTextColor
                        }
                    },
                    axisLabel: {
                        color: currentTextColor
                    },
                    splitLine: {
                        lineStyle: {
                            color: currentSplitLineColor
                        }
                    }
                },
                series: [{
                    label: {
                        color: currentTextColor
                    }
                }]
            }, { notMerge: false });
        };

        // Create a MutationObserver to watch for class changes on documentElement
        const observer = new MutationObserver(handleThemeChange);
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class']
        });

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
            chart.dispose();
        };
    }, [teamSize, eventsPerYear, cardCost]);

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
                            <div
                                className="slider-tooltip"
                                style={{
                                    left: `${((teamSize - 1) / (100 - 1)) * 100}%`
                                }}
                            >
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
                                id="eventsPerYear"
                                min="1"
                                max="12"
                                value={eventsPerYear}
                                onChange={(e) => setEventsPerYear(Number(e.target.value))}
                                className="w-full slider-with-tooltip"
                            />
                            <div
                                className="slider-tooltip"
                                style={{
                                    left: `${((eventsPerYear - 1) / (12 - 1)) * 100}%`
                                }}
                            >
                                {eventsPerYear}
                            </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-800 dark:text-white/80 mt-1">
                            <span>1</span>
                            <span>12</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-900 dark:text-white">Current Card Cost (per 1000)</label>
                        <div className="relative group">
                            <input
                                type="range"
                                id="cardCost"
                                min="50"
                                max="500"
                                value={cardCost}
                                onChange={(e) => setCardCost(Number(e.target.value))}
                                className="w-full slider-with-tooltip"
                            />
                            <div
                                className="slider-tooltip"
                                style={{
                                    left: `${((cardCost - 50) / (500 - 50)) * 100}%`
                                }}
                            >
                                ${cardCost}
                            </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-800 dark:text-white/80 mt-1">
                            <span>$50</span>
                            <span>$500</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="roi-calculator p-8">
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">5-Year Cost Comparison</h3>
                <p className="text-sm text-gray-600 dark:text-white/80 mb-6">
                    SmartWave: One card per team member ($79) lasts 5 years. Traditional cards: Recurring cost based on events.
                </p>
                <div ref={chartRef} className="w-full h-80 mb-6"></div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-smart-teal" id="annualSavings">
                            ${Math.round(annualSavings).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-white/80">Annual Savings</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-smart-amber" id="treesSaved">
                            {treesSaved}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-white/80">Trees Saved</div>
                    </div>
                </div>
            </div>
        </div>
    );
}


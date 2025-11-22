'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import Image from 'next/image';

export default function MarketGrowth() {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || typeof window === 'undefined') return;

    const isDark = !document.documentElement.classList.contains('light');
    const textColor = isDark ? '#ffffff' : '#1a1a1a';
    const splitLineColor = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)';
    const tooltipBg = isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)';
    const tooltipTextColor = isDark ? '#ffffff' : '#1f2937';

    const chart = echarts.init(chartRef.current);

    // Market growth data (5 years)
    const years = ['2020', '2021', '2022', '2023', '2024', '2025'];
    const marketSize = [2.1, 2.5, 3.0, 3.6, 4.2, 5.0]; // in billions

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: tooltipBg,
        borderColor: '#00d4aa',
        textStyle: {
          color: tooltipTextColor,
        },
        formatter: (params: any) => {
          const param = params[0];
          return `${param.name}<br/>${param.seriesName}: $${param.value}B`;
        },
      },
      xAxis: {
        type: 'category',
        data: years,
        axisLine: {
          lineStyle: {
            color: textColor,
          },
        },
        axisLabel: {
          color: textColor,
        },
      },
      yAxis: {
        type: 'value',
        name: 'Market Size ($B)',
        nameTextStyle: {
          color: textColor,
        },
        axisLine: {
          lineStyle: {
            color: textColor,
          },
        },
        axisLabel: {
          color: textColor,
          formatter: (value: number) => `$${value}B`,
        },
        splitLine: {
          lineStyle: {
            color: splitLineColor,
          },
        },
      },
      series: [
        {
          name: 'Market Size',
          type: 'line',
          data: marketSize,
          smooth: true,
          lineStyle: {
            color: '#00d4aa',
            width: 3,
          },
          itemStyle: {
            color: '#00d4aa',
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(0, 212, 170, 0.3)',
                },
                {
                  offset: 1,
                  color: 'rgba(0, 212, 170, 0.05)',
                },
              ],
            },
          },
          label: {
            show: true,
            position: 'top',
            color: textColor,
            formatter: (params: any) => `$${params.value}B`,
          },
        },
      ],
    };

    chart.setOption(option);

    const handleResize = () => {
      chart.resize();
    };

    const handleThemeChange = () => {
      const currentIsDark = !document.documentElement.classList.contains('light');
      const currentTextColor = currentIsDark ? '#ffffff' : '#1a1a1a';
      const currentSplitLineColor = currentIsDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.25)';
      const currentTooltipBg = currentIsDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.95)';
      const currentTooltipTextColor = currentIsDark ? '#ffffff' : '#1f2937';

      chart.setOption({
        tooltip: {
          backgroundColor: currentTooltipBg,
          textStyle: {
            color: currentTooltipTextColor,
          },
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              color: currentTextColor,
            },
          },
          axisLabel: {
            color: currentTextColor,
          },
        },
        yAxis: {
          nameTextStyle: {
            color: currentTextColor,
          },
          axisLine: {
            lineStyle: {
              color: currentTextColor,
            },
          },
          axisLabel: {
            color: currentTextColor,
          },
          splitLine: {
            lineStyle: {
              color: currentSplitLineColor,
            },
          },
        },
        series: [
          {
            label: {
              color: currentTextColor,
            },
          },
        ],
      });
    };

    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      chart.dispose();
    };
  }, []);

  const contactSales = () => {
    window.location.href = '/contact-us';
  };

  return (
    <section className="py-20 bg-black relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 opacity-20">
        <Image
          src="/images/tech-bg.jpg"
          alt="Technology Background"
          fill
          className="object-cover"
        />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">
              The <span className="text-gradient">$4.2 Billion</span> Opportunity
            </h2>
            <p className="text-xl text-smart-silver/80 mb-8">
              The NFC business card market is experiencing explosive growth at 20% CAGR. SmartWave positions you at the forefront of this digital transformation.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-smart-teal rounded-full"></div>
                <span className="text-smart-silver">70% increase in contactless networking since 2020</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-smart-amber rounded-full"></div>
                <span className="text-smart-silver">7 million trees saved annually through digital cards</span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span className="text-smart-silver">Enterprise ESG mandates driving adoption</span>
              </div>
            </div>
          </div>

          <div className="market-chart p-8">
            <div ref={chartRef} className="w-full h-80"></div>
          </div>
        </div>
      </div>
    </section>
  );
}


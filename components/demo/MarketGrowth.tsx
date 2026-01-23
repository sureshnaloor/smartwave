'use client';

import { Building2, RefreshCw, Leaf, Bell, Users, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export default function MarketGrowth() {
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
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center space-x-2 bg-smart-teal/10 px-3 py-1 rounded-full mb-6">
              <Building2 className="w-4 h-4 text-smart-teal" />
              <span className="text-smart-teal text-sm font-medium">Enterprise Solutions</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Scale Your <span className="text-gradient">Corporate Identity</span>
            </h2>
            <p className="text-xl text-gray-400 mb-8 leading-relaxed">
              Equip your entire workforce with smart business cards. Manage hundreds of employees from a single dashboard with streamlined ordering and automated onboarding.
            </p>

            <div className="space-y-6">
              <div className="flex items-start space-x-4 group">
                <div className="w-12 h-12 bg-smart-teal/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-smart-teal/20 transition-colors">
                  <RefreshCw className="w-6 h-6 text-smart-teal" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Dynamic Lifetime Updates</h3>
                  <p className="text-gray-400">Promotions or department changes? Update employee details instantly across all cards without re-issuing hardware.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                  <Leaf className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Eco-Friendly Impact</h3>
                  <p className="text-gray-400">Eliminate paper waste completely. Support your company's ESG mandates with sustainable, reusable digital credentials.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="w-12 h-12 bg-smart-amber/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-smart-amber/20 transition-colors">
                  <Bell className="w-6 h-6 text-smart-amber" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Smart Engagement</h3>
                  <p className="text-gray-400">Push notifications ensure your network always has your team's latest contact info directly in their digital wallets.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-20">
            {/* Abstract Visual of Team Management / Enterprise Dashboard */}
            <div className="relative bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-10">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-smart-teal via-blue-500 to-purple-600"></div>

              {/* Dashboard Header */}
              <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900 backdrop-blur">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-xs text-gray-500 font-mono">Enterprise Admin</div>
              </div>

              {/* Dashboard Content Mockup */}
              <div className="p-8 bg-gray-900 backdrop-blur">
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h4 className="!text-white font-semibold text-lg">Team Overview</h4>
                    <p className="!text-gray-300 text-sm">Managing 850 active cards</p>
                  </div>
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-xs text-gray-400 overflow-hidden">
                        <Image src={`https://placehold.co/100x100/1f2937/ffffff?text=User${i}`} width={40} height={40} alt="User" />
                      </div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-gray-900 bg-smart-teal text-black font-bold flex items-center justify-center text-xs">
                      +846
                    </div>
                  </div>
                </div>

                {/* List Mockup */}
                <div className="space-y-3">
                  {[
                    { name: 'Sarah Miller', role: 'Sales Director', status: 'Active', statusColor: '!text-green-300' },
                    { name: 'James Chen', role: 'Software Engineer', status: 'Updated', statusColor: '!text-blue-300' },
                    { name: 'Elena Rodriguez', role: 'Product Manager', status: 'Active', statusColor: '!text-green-300' }
                  ].map((user, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 hover:border-gray-600 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-600"></div>
                        <div>
                          <div className="text-sm font-medium !text-white">{user.name}</div>
                          <div className="text-xs !text-gray-400">{user.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className={`w-4 h-4 ${user.statusColor}`} />
                        <span className={`text-xs font-medium ${user.statusColor}`}>{user.status}</span>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 rounded-xl border border-dashed border-gray-700 text-center !text-gray-400 text-sm hover:border-gray-500 hover:!text-gray-300 cursor-pointer transition-all">
                    + Bulk Import Employees (CSV)
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -right-6 bg-gray-800 backdrop-blur border border-gray-700 p-4 rounded-xl shadow-xl max-w-[200px] z-20">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <Leaf className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-xs font-medium dark:text-white text-sky-200">Impact Report</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">2,450 kg</div>
              <div className="text-xs text-gray-400">Paper waste saved this year</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


'use client'

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, Calendar, User, ShoppingBag } from 'lucide-react';
import { getOrderDetails } from '@/app/_actions/paymentrazorpay';
import { Button } from "@/components/ui/button";

export default function OrderSuccess() {
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const router = useRouter();

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    } else {
      setLoading(false);
    }
  }, [orderId]);

  const fetchOrderDetails = async (id: string) => {
    try {
      const data = await getOrderDetails(id);
      if (data.success) {
        setOrderDetails(data.order);
      }
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubscriptionInfo = (items: any[]) => {
    const digitalPlan = items?.find(item => item.type === 'edit_plan' || item.type === 'plan');
    if (!digitalPlan) return null;

    let duration = "1 year";
    if (digitalPlan.type.includes('5y') || digitalPlan.name?.toLowerCase().includes('5 year')) {
      duration = "5 years";
    } else if (digitalPlan.name?.toLowerCase().includes('perpetual')) {
      duration = "Lifetime Access";
    }

    return {
      name: digitalPlan.name || digitalPlan.type,
      duration
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-smart-teal/30 border-t-smart-teal rounded-full animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Securing your order details...</p>
        </div>
      </div>
    );
  }

  const subInfo = orderDetails ? getSubscriptionInfo(orderDetails.items) : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-zinc-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-white/5"
        >
          {/* Header Section */}
          <div className="bg-smart-teal p-12 text-center relative overflow-hidden">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-white/30"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">Order Success!</h1>
            <p className="text-white/80 font-medium">Thank you for choosing SmartWave.</p>

            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full blur-3xl" />
          </div>

          <div className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Order Details</h2>
                  <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 border border-gray-100 dark:border-white/5">
                    <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-white/10">
                      <span className="text-sm font-bold text-gray-500">Order ID</span>
                      <span className="text-sm font-black text-smart-teal tabular-nums">{orderId}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-500">Amount Paid</span>
                      <span className="text-lg font-black text-gray-900 dark:text-white">₹{orderDetails?.amount ? (orderDetails.amount).toFixed(2) : '0.00'}</span>
                    </div>
                  </div>
                </div>

                {subInfo && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Calendar className="w-5 h-5 text-indigo-500" />
                      <h3 className="font-bold text-indigo-600 dark:text-indigo-400">Subscription Activated</h3>
                    </div>
                    <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80 leading-relaxed font-medium">
                      Your <span className="font-black text-indigo-600 dark:text-indigo-400">{subInfo.name}</span> is now active for <span className="font-black text-indigo-600 dark:text-indigo-400">{subInfo.duration}</span>. You can now start using all premium features!
                    </p>
                  </motion.div>
                )}
              </div>

              <div>
                <h2 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Order Items</h2>
                <div className="space-y-3">
                  {orderDetails?.items?.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                      <div className="w-10 h-10 bg-white dark:bg-zinc-800 rounded-xl flex items-center justify-center shadow-sm">
                        {item.type?.includes('card') ? <Package className="w-5 h-5 text-smart-teal" /> : <User className="w-5 h-5 text-indigo-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1 italic">{item.name || item.type}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/myprofile" className="flex-1">
                <Button className="w-full h-14 bg-smart-teal hover:bg-smart-teal/90 text-white rounded-2xl font-black uppercase tracking-tighter text-lg shadow-xl shadow-smart-teal/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                  Manage Digital Profile <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/orders" className="flex-1">
                <Button variant="outline" className="w-full h-14 rounded-2xl border-2 border-gray-100 dark:border-white/10 font-bold uppercase tracking-tight text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5">
                  View Order History
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-white/5 p-6 border-t border-gray-100 dark:border-white/5 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2">
              <ShoppingBag className="w-3 h-3" /> A confirmation email has been sent to your registered email address.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
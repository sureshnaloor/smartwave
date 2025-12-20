'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  User,
  Palette,
  Share2,
  Smartphone,
  Globe,
  Settings,
  QrCode,
  Download,
  Edit3,
  Link as LinkIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  Star,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { getOnboardingProgress, StepStatus } from '@/app/_actions/onboarding';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function GuideMePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stepStatuses, setStepStatuses] = useState<Record<number, StepStatus>>({
    1: 'pending',
    2: 'pending',
    3: 'pending',
    4: 'pending',
    5: 'pending',
  });
  const [progressPercentage, setProgressPercentage] = useState(0);

  // Fetch user's onboarding progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (status === 'unauthenticated') {
        router.push('/');
        return;
      }

      if (status === 'authenticated' && session?.user?.email) {
        setLoading(true);
        try {
          const progress = await getOnboardingProgress(session.user.email);

          // Map step statuses
          const statusMap: Record<number, StepStatus> = {};
          progress.steps.forEach(step => {
            statusMap[step.id] = step.status;
          });

          setStepStatuses(statusMap);
          setProgressPercentage(progress.progressPercentage);
        } catch (error) {
          console.error('Failed to fetch onboarding progress:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProgress();
  }, [status, session, router]);

  const onboardingSteps = [
    {
      id: 1,
      title: "Complete Your Profile",
      description: "Set up your basic information and professional details",
      icon: <User className="h-6 w-6" />,
      tasks: [
        "Add your name and professional title",
        "Upload a professional profile photo",
        "Write a compelling bio",
        "Add your contact information"
      ],
      estimatedTime: "5 minutes",
      status: stepStatuses[1]
    },
    {
      id: 2,
      title: "Customize Your Design",
      description: "Choose colors, themes, and layout for your digital card",
      icon: <Palette className="h-6 w-6" />,
      tasks: [
        "Select your preferred color scheme",
        "Choose a professional theme",
        "Customize your card layout",
        "Preview your design"
      ],
      estimatedTime: "3 minutes",
      status: stepStatuses[2]
    },
    {
      id: 3,
      title: "Add Social Links",
      description: "Connect your social media and professional profiles",
      icon: <Share2 className="h-6 w-6" />,
      tasks: [
        "Add LinkedIn profile",
        "Connect your website",
        "Add other social media links",
        "Set up contact preferences"
      ],
      estimatedTime: "4 minutes",
      status: stepStatuses[3]
    },
    {
      id: 4,
      title: "Generate Your Digital Card",
      description: "Create your shareable digital business card",
      icon: <QrCode className="h-6 w-6" />,
      tasks: [
        "Generate your unique QR code",
        "Create your shareable link",
        "Test your digital card",
        "Download your QR code"
      ],
      estimatedTime: "2 minutes",
      status: stepStatuses[4]
    },
    {
      id: 5,
      title: "Share & Network",
      description: "Start sharing your digital card and networking",
      icon: <Globe className="h-6 w-6" />,
      tasks: [
        "Share your card via QR code",
        "Send your digital link",
        "Add to email signatures",
        "Start networking!"
      ],
      estimatedTime: "3 minutes",
      status: stepStatuses[5]
    }
  ];

  const quickActions = [
    {
      title: "Edit Profile",
      description: "Update your personal information",
      icon: <Edit3 className="h-5 w-5" />,
      href: "/myprofile",
      color: "bg-blue-500"
    },
    {
      title: "Customize Design",
      description: "Change your card appearance",
      icon: <Palette className="h-5 w-5" />,
      href: "/myprofile",
      color: "bg-purple-500"
    },
    {
      title: "View Analytics",
      description: "See who viewed your card",
      icon: <Star className="h-5 w-5" />,
      href: "/myprofile",
      color: "bg-green-500"
    },
    {
        title: "Generate Shareable Link",
        description: "Create your digital profile URL",
        icon: <LinkIcon className="h-5 w-5" />,
      href: "/myprofile",
      color: "bg-orange-500"
    }
  ];

  const tips = [
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Pro Tip",
      description: "Use a high-quality professional photo for better engagement"
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: "Engagement",
      description: "Cards with complete profiles get 3x more views"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: "Customization",
      description: "Match your card colors to your brand for consistency"
    }
  ];

  // Calculate completed steps for display
  const completedSteps = onboardingSteps.filter(step => step.status === "completed").length;

  // Show loading spinner while fetching data or authenticating
  if (loading || status === 'loading') return <LoadingSpinner />;
  if (!session?.user?.email) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to SmartWave! 🎉
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
            Let's get you set up with your digital business card in just a few steps
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Progress</span>
              <span>{completedSteps} of {onboardingSteps.length} completed</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Onboarding Steps */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Your Onboarding Journey
              </h2>

              <div className="space-y-4">
                {onboardingSteps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`transition-all duration-300 ${step.status === 'completed'
                      ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20'
                      : step.status === 'in-progress'
                        ? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700'
                      }`}>
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${step.status === 'completed'
                              ? 'bg-green-500 text-white'
                              : step.status === 'in-progress'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                              }`}>
                              {step.status === 'completed' ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                step.icon
                              )}
                            </div>
                            <div>
                              <CardTitle className="text-lg">{step.title}</CardTitle>
                              <CardDescription>{step.description}</CardDescription>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={
                              step.status === 'completed'
                                ? 'default'
                                : step.status === 'in-progress'
                                  ? 'secondary'
                                  : 'outline'
                            }>
                              {step.status === 'completed'
                                ? 'Completed'
                                : step.status === 'in-progress'
                                  ? 'In Progress'
                                  : 'Pending'
                              }
                            </Badge>
                            <span className="text-sm text-gray-500">{step.estimatedTime}</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {step.tasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="flex items-center space-x-2 text-sm">
                              <CheckCircle className={`h-4 w-4 ${step.status === 'completed'
                                ? 'text-green-500'
                                : 'text-gray-300 dark:text-gray-600'
                                }`} />
                              <span className={step.status === 'completed'
                                ? 'text-gray-700 dark:text-gray-300'
                                : 'text-gray-500 dark:text-gray-400'
                              }>
                                {task}
                              </span>
                            </li>
                          ))}
                        </ul>
                        {step.status === 'in-progress' && (
                          <div className="mt-4">
                            <Link href="/myprofile">
                              <Button className="w-full">
                                Continue Setup
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Link href={action.href}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${action.color} text-white`}>
                              {action.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {action.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Tips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tips & Tricks
              </h3>
              <div className="space-y-3">
                {tips.map((tip, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="p-1 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400">
                            {tip.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                              {tip.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {tip.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold mb-2">Need Help?</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Our support team is here to help you get started
                  </p>
                  <Link href="/contact-us">
                    <Button variant="secondary" size="sm">
                      Contact Support
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

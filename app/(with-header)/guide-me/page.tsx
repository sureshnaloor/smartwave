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
  Smartphone as MobileIcon,
  IdCard,
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
  Zap,
  Wallet,
  Copy,
  Check,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
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

  const tutorialSteps = [
    {
      title: "Create Your Digital Card",
      description: "Start by clicking 'Edit Profile'. The page auto-refreshes as you add data.",
      icon: <User className="h-8 w-8 text-blue-500" />,
      color: "blue",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            For a professional card, please fill in all fields (even partial data provides an incomplete card).
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Contact Email</Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Mobile Number</Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Work Address</Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Company Logo</Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">Photo</Badge>
          </div>
          <Link href="/myprofile">
            <Button className="w-full mt-2 bg-blue-600 hover:bg-blue-700 group text-white">
              Edit Profile
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      )
    },
    {
      title: "Download Assets",
      description: "Once updated, your QR code and digital cards are ready for your network.",
      icon: <QrCode className="h-8 w-8 text-purple-500" />,
      color: "purple",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Your unique QR code and digital card files are generated automatically. Use them on your email signature or marketing materials.
          </p>
          <div className="grid grid-cols-2 gap-3">
             <div className="p-3 border rounded-xl bg-purple-50 dark:bg-purple-900/10 flex flex-col items-center gap-2">
                <QrCode className="h-6 w-6 text-purple-500" />
                <span className="text-xs font-semibold">QR Code</span>
             </div>
             <div className="p-3 border rounded-xl bg-purple-50 dark:bg-purple-900/10 flex flex-col items-center gap-2">
                <IdCard className="h-6 w-6 text-purple-500" />
                <span className="text-xs font-semibold">Digital Card</span>
             </div>
          </div>
          <p className="text-xs text-center text-purple-600 dark:text-purple-400 font-medium italic">
            Available in your profile downloads!
          </p>
        </div>
      )
    },
    {
      title: "Share Your Profile",
      description: "Generate a short URL to share your profile across social platforms.",
      icon: <Share2 className="h-8 w-8 text-emerald-500" />,
      color: "emerald",
      content: (
        <div className="space-y-4">
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <li className="flex gap-2 items-start">
               <div className="mt-1 p-0.5 bg-emerald-500 rounded-full flex-shrink-0"><PlusCircle className="h-3 w-3 text-white" /></div>
               <span>Click <strong>'Generate ShortURL'</strong> in profile settings</span>
            </li>
            <li className="flex gap-2 items-start">
               <div className="mt-1 p-0.5 bg-emerald-500 rounded-full flex-shrink-0"><PlusCircle className="h-3 w-3 text-white" /></div>
               <span>Button changes to <strong>'Share Profile'</strong></span>
            </li>
            <li className="flex gap-2 items-start">
               <div className="mt-1 p-0.5 bg-emerald-500 rounded-full flex-shrink-0"><PlusCircle className="h-3 w-3 text-white" /></div>
               <span>Click to visit your public profile & copy the link!</span>
            </li>
          </ul>
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300">smartwave.me/u/yourname</span>
            <Copy className="h-4 w-4 text-emerald-600" />
          </div>
        </div>
      )
    },
    {
      title: "Viral Wallet Share",
      description: "The most powerful feature! Add your card to mobile wallets (iOS & Android).",
      icon: <Wallet className="h-8 w-8 text-orange-500" />,
      color: "orange",
      content: (
        <div className="space-y-4">
          <div className="flex gap-4 items-center">
            <MobileIcon className="h-10 w-10 text-orange-500 flex-shrink-0" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
               Open the website on your mobile phone and click <strong>'Add to Wallet'</strong>.
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/10 p-4 rounded-xl border-l-4 border-orange-500">
             <h4 className="text-xs font-bold text-orange-800 dark:text-orange-200 uppercase mb-2">Viral Spread Tip</h4>
             <p className="text-xs text-gray-700 dark:text-gray-300">
                Use the QR code inside your Apple or Google Wallet to share your profile instantly. It's the fastest way to get your digital card out there!
             </p>
          </div>
        </div>
      )
    }
  ];

  const [activeTutorialStep, setActiveTutorialStep] = useState(0);

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

          {/* Interactive Tutorial Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-12 max-w-4xl mx-auto"
          >
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-xl">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 min-h-[400px]">
                {/* Left Side: Navigation */}
                <div className="md:col-span-4 bg-gray-50/50 dark:bg-gray-900/20 p-6 border-r border-gray-100 dark:border-gray-700">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6 px-2">How it works</h3>
                  <div className="space-y-2">
                    {tutorialSteps.map((step, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTutorialStep(index)}
                        className={`w-full text-left p-4 rounded-2xl transition-all duration-300 flex items-center gap-3 ${
                          activeTutorialStep === index
                            ? 'bg-white dark:bg-gray-800 shadow-md scale-[1.02] border border-gray-100 dark:border-gray-700'
                            : 'hover:bg-gray-100 dark:hover:bg-white/5 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className={`p-2 rounded-xl bg-${step.color}-500/10 text-${step.color}-500`}>
                          {step.icon}
                        </div>
                        <div>
                          <p className={`text-sm font-bold ${activeTutorialStep === index ? 'text-gray-900 dark:text-white' : 'text-gray-500'}`}>
                            Step {index + 1}
                          </p>
                          <p className="text-[10px] uppercase font-bold tracking-tight opacity-50">{step.title.split(' ')[0]}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Side: Content */}
                <div className="md:col-span-8 p-8 relative">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeTutorialStep}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="h-full flex flex-col"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-3 rounded-2xl bg-${tutorialSteps[activeTutorialStep].color}-500 text-white shadow-lg shadow-${tutorialSteps[activeTutorialStep].color}-500/20`}>
                          {tutorialSteps[activeTutorialStep].icon}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                            {tutorialSteps[activeTutorialStep].title}
                          </h2>
                          <p className="text-gray-500 dark:text-gray-400 font-medium">
                            Follow this step to maximize your impact
                          </p>
                        </div>
                      </div>

                      <div className="flex-grow">
                        <p className="text-lg text-gray-700 dark:text-gray-200 mb-6 leading-relaxed">
                          {tutorialSteps[activeTutorialStep].description}
                        </p>
                        
                        <div className="bg-gray-50 dark:bg-gray-900/30 rounded-[1.5rem] p-6 border border-gray-100 dark:border-gray-800">
                          {tutorialSteps[activeTutorialStep].content}
                        </div>
                      </div>

                      <div className="mt-8 flex justify-between items-center bg-gray-50/50 dark:bg-black/20 p-4 rounded-2xl">
                        <span className="text-xs font-bold text-gray-400">
                          Tutorial Step {activeTutorialStep + 1} of {tutorialSteps.length}
                        </span>
                        <div className="flex gap-2">
                           <Button 
                             variant="ghost" 
                             size="sm" 
                             disabled={activeTutorialStep === 0}
                             onClick={() => setActiveTutorialStep(prev => prev - 1)}
                             className="rounded-xl"
                           >
                             Previous
                           </Button>
                           <Button 
                             size="sm" 
                             disabled={activeTutorialStep === tutorialSteps.length - 1}
                             onClick={() => setActiveTutorialStep(prev => prev + 1)}
                             className="bg-gray-900 dark:bg-white dark:text-black rounded-xl"
                           >
                             Next
                             <ArrowRight className="ml-2 h-4 w-4" />
                           </Button>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-16">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2 font-bold tracking-tight">
              <span className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-smart-teal animate-pulse" />
                Overall Journey Status
              </span>
              <span>{completedSteps} of {onboardingSteps.length} Steps</span>
            </div>
            <Progress value={progressPercentage} className="h-2.5 rounded-full bg-gray-100 dark:bg-gray-800" />
            <p className="text-[10px] text-center mt-2 uppercase tracking-widest font-bold text-gray-400">
               Complete all steps to unlock full potential
            </p>
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

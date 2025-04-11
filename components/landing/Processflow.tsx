import { CheckCircle2, Share2, Edit, CreditCard, Smartphone, QrCode, Wifi } from "lucide-react";
import { motion } from "framer-motion";

const ProcessFlow = () => {
  const steps = [
    {
      icon: <CheckCircle2 className="h-8 w-8" />,
      title: "Sign Up",
      description: "Create your account via Google or LinkedIn (coming soon) and build your digital profile in minutes.",
      color: "bg-gradient-to-r from-violet-500 to-indigo-600",
      svgPath: "/sign-up.svg",
      delay: 0.1
    },
    {
      icon: <Share2 className="h-8 w-8" />,
      title: "Share Anywhere",
      description: "Get a personalized link to share your profile with anyone, anywhere - completely free forever.",
      color: "bg-gradient-to-r from-amber-500 to-orange-600",
      svgPath: "/share.svg",
      delay: 0.3
    },
    {
      icon: <Edit className="h-8 w-8" />,
      title: "Edit & Update",
      description: "Free plan includes one week of edits. Upgrade for additional editing options to keep your profile current.",
      color: "bg-gradient-to-r from-emerald-500 to-teal-600",
      svgPath: "/edit.svg",
      delay: 0.5
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Go Physical",
      description: "Upgrade to NFC cards to share your profile with a simple tap, adding a personal touch to connections.",
      color: "bg-gradient-to-r from-rose-500 to-pink-600",
      svgPath: "/nfc-card.svg",
      delay: 0.7
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const svgVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="bg-sky-100 dark:bg-gray-900 py-16">
      <div className="container mx-auto px-4">
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-4">How SmartWave Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Create, share, and manage your professional digital identity in four simple steps
          </p>
        </motion.div>
        
        <motion.div 
          className="hidden md:grid md:grid-cols-4 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index}
              className="flex flex-col items-center"
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div 
                className={`rounded-full p-6 ${step.color} text-white shadow-lg mb-6`}
                whileHover={{ 
                  rotate: [0, -5, 5, -5, 0],
                  transition: { duration: 0.5 }
                }}
              >
                <motion.div variants={svgVariants}>
                  {step.icon}
                </motion.div>
              </motion.div>
              
              <motion.div className="text-center">
                <motion.h3 
                  className="text-xl font-semibold mb-2"
                  variants={textVariants}
                >
                  {step.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600"
                  variants={textVariants}
                >
                  {step.description}
                </motion.p>
              </motion.div>
              
              <motion.div 
                className="mt-4 h-32 w-full flex justify-center"
                variants={svgVariants}
              >
                {index === 0 && (
                  <svg className="w-full h-full" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                    <motion.path
                      d="M40,60 C40,30 160,30 160,60"
                      fill="transparent"
                      stroke="#6366f1"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                    <motion.circle
                      cx="40"
                      cy="60"
                      r="15"
                      fill="#8b5cf6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.circle
                      cx="160"
                      cy="60"
                      r="15"
                      fill="#6366f1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                    />
                    <motion.path
                      d="M160,60 L160,80 L140,80 L140,100"
                      fill="transparent"
                      stroke="#6366f1"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 1.5 }}
                    />
                  </svg>
                )}
                
                {index === 1 && (
                  <svg className="w-full h-full" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                    <motion.circle
                      cx="100"
                      cy="60"
                      r="30"
                      fill="#fb923c"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.path
                      d="M100,30 L70,15 M100,30 L130,15 M100,90 L70,105 M100,90 L130,105"
                      stroke="#f97316"
                      strokeWidth="3"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                    <motion.circle
                      cx="100"
                      cy="60"
                      r="10"
                      fill="#fdba74"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    />
                  </svg>
                )}
                
                {index === 2 && (
                  <svg className="w-full h-full" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                    <motion.rect
                      x="50"
                      y="30"
                      width="100"
                      height="60"
                      rx="5"
                      fill="#10b981"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.path
                      d="M65,50 L135,50 M65,70 L105,70"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                    <motion.circle
                      cx="160"
                      cy="30"
                      r="10"
                      fill="#14b8a6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 1.2 }}
                    />
                  </svg>
                )}
                
                {index === 3 && (
                  <svg className="w-full h-full" viewBox="0 0 200 120" xmlns="http://www.w3.org/2000/svg">
                    <motion.rect
                      x="50"
                      y="20"
                      width="90"
                      height="60"
                      rx="5"
                      fill="#f43f5e"
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                    <motion.circle
                      cx="120"
                      cy="40"
                      r="10"
                      fill="#fecdd3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                    />
                    <motion.path
                      d="M70,35 L100,35 M70,50 L90,50"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    />
                    <motion.path
                      d="M70,90 C90,110 110,110 130,90"
                      stroke="#f43f5e"
                      strokeWidth="3"
                      fill="transparent"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 1.2 }}
                    />
                  </svg>
                )}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="md:hidden space-y-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="flex items-start"
              variants={itemVariants}
            >
              <motion.div 
                className={`flex-shrink-0 ${step.color} text-white p-3 rounded-full mr-4`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.8 }}
              >
                {step.icon}
              </motion.div>
              <motion.div variants={textVariants}>
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="mt-1 text-gray-600">{step.description}</p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="mt-10 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <motion.button 
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default ProcessFlow;
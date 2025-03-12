import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Bot, Building, Users, Computer, Lightbulb, Shield, Target, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Company logos for carousel - ensure these paths are correct
const companyLogos = [
  "/company1.webp",
  "/company2.webp",
  "/company3.webp",
  "/company4.webp",
  "/company5.webp",
  "/company6.webp",
  "/company7.webp",
  "/company8.webp",
  "/company9.webp",
  "/company10.webp",
];

const HomePage = () => {
  // Refs for animations and measurements
  const titleRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightContentRef = useRef(null);
  const heroRef = useRef(null);
  const accurateRef = useRef(null);
  const universalRef = useRef(null);
  const workforceRef = useRef(null);
  const observerRef = useRef(null);
  
  // Animation states with memoized values
  const [leftHeight, setLeftHeight] = useState(0);
  const [rightHeight, setRightHeight] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // InView hooks for scroll animations - with reduced sensitivity
  const isHeroInView = useInView(heroRef, { once: false, amount: 0.2 });
  const isAccurateInView = useInView(accurateRef, { once: true, amount: 0.2 });
  const isUniversalInView = useInView(universalRef, { once: true, amount: 0.2 });
  const isWorkforceInView = useInView(workforceRef, { once: true, amount: 0.2 });
  
  // Scroll animations with reduced complexity
  const { scrollYProgress } = useScroll({
    layoutEffect: false // Use useEffect instead of layoutEffect for better performance
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);
  
  // Measure heights after the component mounts
  const measureHeights = useCallback(() => {
    if (leftContentRef.current) {
      setLeftHeight(leftContentRef.current.scrollHeight / 2);
    }
    if (rightContentRef.current) {
      setRightHeight(rightContentRef.current.scrollHeight / 2);
    }
  }, []);
  
  useEffect(() => {
    // Scroll to top only on initial load
    if (!isLoaded) {
      window.scrollTo(0, 0);
      setIsLoaded(true);
    }
    
    // Measure heights with debouncing
    const timeoutId = setTimeout(measureHeights, 500);
    
    // Handle resize with debouncing
    const handleResize = () => {
      clearTimeout(timeoutId);
      setTimeout(measureHeights, 300);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Add animation to elements - optimized observer
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          observerRef.current.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '50px' });
    
    const elementsToObserve = document.querySelectorAll('.animate-on-scroll');
    elementsToObserve.forEach((el) => {
      observerRef.current.observe(el);
    });
    
    return () => {
      // Cleanup
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
      
      if (observerRef.current) {
        elementsToObserve.forEach((el) => {
          observerRef.current.unobserve(el);
        });
      }
    };
  }, [isLoaded, measureHeights]);
  
  // Define roles for the workforce section
  const leftContent = [
    "Sales Development Representative",
    "Sales Data Analyst",
    "Clinician Assistant",
    "Recruiting Specialist",
    "Sales Intelligence",
    "AI Support Agent"
  ];
  
  const rightContent = [
    "Airlines agent",
    "Legal Assistant",
    "Onboarding Assistant",
    "Agentic AI Chatbot",
    "Contracts Analyzer",
    "Claims Assessment"
  ];
  
  const services = [
    "HRMS Service",
    "QSR Service",
    "Hospitality Service",
    "Insurance Service",
    "Airlines Service",
  ];
  
  // Get icons based on role name - memoized
  const getIcon = useCallback((title) => {
    if (title.includes("Sales")) return "📈";
    if (title.includes("Data")) return "📊";
    if (title.includes("Recruiting")) return "👥";
    if (title.includes("Legal")) return "⚖️";
    if (title.includes("Proposal")) return "📝";
    if (title.includes("Clinician")) return "🩺";
    if (title.includes("Onboarding")) return "🚀";
    if (title.includes("Chatbot")) return "💬";
    if (title.includes("Contracts")) return "📑";
    if (title.includes("Claims")) return "🔍";
    if (title.includes("Support")) return "🛠️";
    if (title.includes("Intelligence")) return "🧠";
    return "✨";
  }, []);

  // Card component with memoization
  const Card = useCallback(({ title }) => (
    <div className="p-5 m-2 bg-white rounded-xl shadow-md border border-gray-50 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center mb-3">
        <div className="w-10 h-10 bg-xpectrum-purple/20 rounded-lg flex items-center justify-center mr-3">
          <span className="text-lg">{getIcon(title)}</span>
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="space-y-2">
        <div className="h-2 bg-gray-100 rounded w-4/5"></div>
        <div className="h-2 bg-gray-100 rounded w-3/5"></div>
      </div>
    </div>
  ), [getIcon]);

  // Animation variants with optimized transition values
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Reduced from 0.1
        duration: 0.4 // Faster transition
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4 // Faster transition
      }
    }
  };

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 2000); 
    return () => clearInterval(interval);
  }, [services.length]);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      
      <motion.section
        ref={heroRef}
        className="w-full min-h-screen flex flex-col items-center justify-center px-8 font-sans mt-16 lg:mt-28 mb-16 relative"
        initial={false}
      >
        <div className="max-w-6xl w-full flex flex-col-reverse md:flex-row items-center text-center md:text-left gap-8">
          
          {/* Left Content - FIXED: Added proper spacing for rotating text */}
          <motion.div 
            className="w-full md:w-1/2 space-y-6 flex flex-col items-center md:items-start"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              One AI Employee to Reshape{" "}
            </h1>
            {/* FIXED: Changed from inline-block to block and added height to container */}
            <div className="h-12 sm:h-16 md:h-20 relative text-4xl sm:text-5xl md:text-6xl font-bold text-xpectrum-purple flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={services[index]} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
                  {services[index]}
                </motion.span>
              </AnimatePresence>
            </div>

            <p className="text-gray-600 text-lg sm:text-xl mt-2">
              Transform financial services processes across every function with Agentic AI.
            </p>

            <motion.button 
              className="bg-xpectrum-purple text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-xpectrum-darkpurple transition duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Hire Xpectrum
            </motion.button>
          </motion.div>

          {/* Right Side: Animated Bot */}
          <motion.div 
            className="w-full md:w-1/2 flex justify-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="relative">
              <motion.div
                animate={{ y: [0, -10, 0], rotateZ: [0, 1, 0, -1, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Bot size={280} className="text-xpectrum-purple" />
              </motion.div>
              <motion.div 
                className="absolute inset-0 bg-xpectrum-purple/5 rounded-full"
                animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.6, 0.5] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>

        {/* Icons Section */}
        <motion.div 
          className="w-full py-12 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            
            <motion.div 
              className="flex flex-col items-center"
              whileHover={{ scale: 1.03, y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className="w-12 h-12 bg-xpectrum-purple text-white rounded-full flex items-center justify-center">
                <RefreshCw size={24} />
              </div>
              <p className="text-gray-800 text-lg mt-4">
                One platform to automate <br /> many workflows
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center"
              whileHover={{ scale: 1.03, y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className="w-12 h-12 bg-xpectrum-magenta text-white rounded-full flex items-center justify-center">
                <Shield size={24} />
              </div>
              <p className="text-gray-800 text-lg mt-4">
                Compliant with leading <br /> industry standards
              </p>
            </motion.div>

            <motion.div 
              className="flex flex-col items-center"
              whileHover={{ scale: 1.03, y: -3 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            >
              <div className="w-12 h-12 bg-xpectrum-blue text-white rounded-full flex items-center justify-center">
                <Target size={24} />
              </div>
              <p className="text-gray-800 text-lg mt-4">
                Above human-level accuracy
              </p>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* The rest of the component remains unchanged */}
      
      {/* Services Title */}
      <motion.div 
        className="text-center mt-24 mb-16 px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-xpectrum-purple uppercase tracking-widest text-sm">
          CHOOSE XPECTRUM'S ROLE TO START
        </p>
        <h2 className="text-3xl font-bold mt-2">
          10X productivity with no additional headcount
        </h2>
        <p className="text-lg text-gray-600 mt-4">
          Experience a different level of operational efficiency
        </p>
      </motion.div>

      {/* Multiply Workforce Section - Optimized Animation */}
      <div 
        ref={workforceRef}
        className="w-full py-16 px-6 md:px-12 bg-gray-50"
      >
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isWorkforceInView ? 1 : 0, y: isWorkforceInView ? 0 : 20 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-xpectrum-purple font-medium tracking-wide uppercase mb-2">WHY HIRE XPECTRUM</h3>
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
            Multiply your workforce<br />in minutes
          </h1>
        </motion.div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
          <motion.div 
            className="w-full md:w-2/5"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: isWorkforceInView ? 1 : 0, x: isWorkforceInView ? 0 : -30 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 mr-4 text-xpectrum-purple">
                <motion.svg 
                  viewBox="0 0 100 100" 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="w-full h-full"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: isWorkforceInView ? 1 : 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <motion.circle 
                    cx="50" cy="50" r="40" 
                    stroke="currentColor" 
                    strokeWidth="6" 
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: isWorkforceInView ? 1 : 0 }}
                    transition={{ duration: 1 }}
                  />
                  <motion.path 
                    d="M30,50 L45,65 L70,35" 
                    stroke="currentColor" 
                    strokeWidth="6" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: isWorkforceInView ? 1 : 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </motion.svg>
              </div>
              <h2 className="text-3xl font-bold">Simple</h2>
            </div>
            
            <p className="text-gray-700 text-lg mb-6">
              With its Generative Workflow Engine™ and pre-built library of agents, Xpectrum conversationally activates 
              new AI employees to execute any complex workflow in the enterprise. Pre-integrated with hundreds of 
              apps, Xpectrum is easy to configure and deploy.
            </p>
            
            <motion.button 
              className="bg-xpectrum-darkpurple hover:bg-xpectrum-purple text-white py-3 px-8 rounded-full font-medium transition duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Explore integrations
            </motion.button>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-3/5 flex overflow-hidden h-96"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: isWorkforceInView ? 1 : 0, x: isWorkforceInView ? 0 : 30 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <div className="w-1/2 overflow-hidden relative h-full">
              <motion.div 
                ref={leftContentRef}
                className="absolute w-full"
                animate={{ 
                  y: [0, -leftHeight || -800]
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear"
                  }
                }}
              >
                {[...leftContent, ...leftContent].map((item, index) => (
                  <Card key={`left-${index}`} title={item} />
                ))}
              </motion.div>
            </div>
            
            <div className="w-1/2 overflow-hidden relative h-full">
              <motion.div
                ref={rightContentRef}
                className="absolute w-full"
                animate={{ 
                  y: [-rightHeight || -800, 0]
                }}
                transition={{
                  y: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 30,
                    ease: "linear"
                  }
                }}
              >
                {[...rightContent, ...rightContent].map((item, index) => (
                  <Card key={`right-${index}`} title={item} />
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <div 
        ref={accurateRef}
        className="flex flex-col md:flex-row p-6 mx-auto gap-8 items-center py-16 bg-gray-50"
      >
        <motion.div 
          className="w-full md:w-1/2 md:ml-24 px-4"
          initial={{ opacity: 0, x: -30 }} 
          animate={{ opacity: isAccurateInView ? 1 : 0, x: isAccurateInView ? 0 : -30 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center mb-6">
            <motion.div 
              className="w-12 h-12 mr-4 text-xpectrum-purple"
              animate={{ rotate: isAccurateInView ? [0, 180] : 0 }}
              transition={{ duration: 1, delay: 0.1 }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-.997-4L6.76 11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z" />
              </svg>
            </motion.div>
            <h2 className="text-4xl font-bold">LLM Model Hub</h2>
          </div>
          
          <p className="text-lg leading-relaxed">
            Xpectrum maximizes accuracy at the lowest possible cost, 
            thanks to 2T+ parameter proprietary Xpectrum Model 
            Hub that intelligently blends the best public and 
            private models. Plus, Xpectrum is future-proof - it's 
            constantly adding new models to avoid over-reliance on one technology stack.
          </p>
          
          <motion.button 
            className="mt-8 bg-xpectrum-darkpurple text-white px-6 py-3 rounded-full font-medium hover:bg-xpectrum-purple transition duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Know more
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="w-full md:w-1/2 mt-8 md:mt-0 px-4"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: isAccurateInView ? 1 : 0, x: isAccurateInView ? 0 : 30 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <motion.div 
            className="bg-white rounded-lg shadow-lg overflow-hidden flex justify-center items-center"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            {/* Video component - Centered & Full Width */}
            <div className="relative w-full max-w-[1200px] mx-auto">
              <video
                className="w-full h-full object-contain"
                autoPlay
                muted
                loop
                playsInline
                poster="/api/placeholder/600/400" 
              >
                <source src="/Models.mp4" type="video/mp4" />
                <source src="/xpectrum-accurate.webm" type="video/webm" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <div className="absolute bottom-4 left-4 text-white text-lg font-medium">
                Xpectrum Model Hub
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Universal AI Employee Section - Optimized Animation */}
      <div 
        ref={universalRef}
        className="flex flex-col md:flex-row items-center w-full bg-gray-50 py-16 px-6"
      >
        <motion.div 
          className="w-full md:w-1/2 md:ml-24 md:pr-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isUniversalInView ? 1 : 0, y: isUniversalInView ? 0 : 20 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-xpectrum-purple text-2xl font-medium mb-2">Xpectrum</p>
          <h1 className="text-5xl font-bold leading-tight mb-8">
            Your Universal AI<br />Employee
          </h1>
          <motion.button 
            className="bg-xpectrum-darkpurple hover:bg-xpectrum-purple text-white px-8 py-4 rounded-full font-medium text-lg transition duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Hire Xpectrum today
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isUniversalInView ? 1 : 0, y: isUniversalInView ? 0 : 20 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="relative w-full max-w-lg aspect-square">
            <motion.div 
              className="absolute inset-0 bg-xpectrum-purple rounded-full flex items-center justify-center overflow-hidden"
              animate={{ 
                scale: [1, 1.03, 1],
                boxShadow: [
                  "0 0 0 rgba(123, 104, 238, 0.4)",
                  "0 0 15px rgba(123, 104, 238, 0.5)",
                  "0 0 0 rgba(123, 104, 238, 0.4)"
                ]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <motion.div 
                className="absolute inset-0 opacity-30"
                animate={{ rotate: 360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full border border-white rounded-full"
                    style={{ width: `${100 - i * 10}%`, height: `${100 - i * 10}%` }}
                  />
                ))}
              </motion.div>
              
              <div className="text-white text-center px-8 text-3xl font-medium leading-tight z-10">
                Reimagine the<br />future of work<br />with us
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* Global styles for animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s forwards;
        }
        
        .animate-fade-in-permanent {
          opacity: 0;
          animation: fade-in 0.8s forwards;
        }
        
        .animate-visible {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.6s, transform 0.6s;
        }
        
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(123, 104, 238, 0.6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(123, 104, 238, 0.8);
        }
      `}</style>
    </div>
  );
};

export default HomePage;

import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { CheckCircle, ShoppingBag, LineChart, Clock, ShoppingCart, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MetricCardProps {
  value: string;
  label: string;
  delay: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, label, delay }) => (
  <div 
    className="text-center animate-fade-in-up" 
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="text-4xl font-bold text-xpectrum-purple mb-2">{value}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

interface FeatureCardProps {
  title: string;
  description: React.ReactNode;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, delay }) => (
  <div 
    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up" 
    style={{ animationDelay: `${delay}ms` }}
  >
    <h3 className="text-xl font-bold mb-3 text-xpectrum-darkpurple">{title}</h3>
    {description}
  </div>
);

interface OfferingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const OfferingCard: React.FC<OfferingCardProps> = ({ icon, title, description, delay }) => (
  <div 
    className="flex gap-4 mb-8 animate-fade-in-up" 
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex-shrink-0">
      <div className="bg-xpectrum-lightpurple rounded-full p-3 w-14 h-14 flex items-center justify-center">
        {icon}
      </div>
    </div>
    <div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description, delay }) => (
  <div 
    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up" 
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center mb-4">
      <div className="bg-xpectrum-lightpurple rounded-full p-2 mr-3">
        {icon}
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

const QSR = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Add animation to elements as they appear in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-28 pb-16 bg-gradient-to-b from-white to-gray-50">
          <div className="content-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="animate-slide-in">
                <h1 className="text-4xl font-bold mb-4 text-xpectrum-darkpurple">QSR</h1>
                <h2 className="text-2xl mb-6 text-xpectrum-purple">Xpectrum Quick Service Restaurant Management Agent</h2>
                <p className="text-gray-600 mb-8">
                  Introducing our comprehensive QSR solution—powered by advanced AI—that revolutionizes restaurant operations. 
                  Streamline order processing, inventory management, customer engagement, and performance analytics while enhancing 
                  service speed and overall customer satisfaction.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
                  <MetricCard value="95%" label="Customer Satisfaction" delay={100} />
                  <MetricCard value="300+" label="Outlets Worldwide" delay={200} />
                  <MetricCard value="2M+" label="Orders Processed" delay={300} />
                  <MetricCard value="$2B" label="Annual Revenue" delay={400} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
                <div className="space-y-4">
                  <div className="bg-xpectrum-lightpurple rounded-lg h-48 overflow-hidden animate-float">
                    <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5" alt="Restaurant Interior" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-xpectrum-lightpurple rounded-lg h-48 overflow-hidden animate-float" style={{ animationDelay: "0.2s" }}>
                    <img src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445" alt="Food Preparation" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-xpectrum-lightpurple rounded-lg h-48 overflow-hidden animate-float" style={{ animationDelay: "0.4s" }}>
                    <img src="https://images.unsplash.com/photo-1606914501449-5a96b6ce24ca" alt="Digital Ordering" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-xpectrum-lightpurple rounded-lg h-48 overflow-hidden animate-float" style={{ animationDelay: "0.6s" }}>
                    <img src="https://images.unsplash.com/photo-1534482421-64566f976cfa" alt="Restaurant Service" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Functions & Capabilities Section */}
        <section className="py-16 bg-gray-50">
          <div className="content-container">
            <h2 className="text-3xl font-bold mb-12 text-center animate-slide-in">Key Functions & Capabilities</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureCard 
                title="Order Management & Digital Ordering" 
                description={
                  <div>
                    <p className="mb-3 text-gray-600">Streamline order capture and enhance the dining experience</p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Automate order intake through kiosks, mobile apps, and POS integration</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Ensure accurate order processing and timely service delivery</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Integrate real-time order tracking for improved customer satisfaction</span>
                      </li>
                    </ul>
                  </div>
                }
                delay={100}
              />
              
              <FeatureCard 
                title="Inventory & Supply Chain Management" 
                description={
                  <div>
                    <p className="mb-3 text-gray-600">Optimize stock levels and streamline supplier interactions</p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Monitor inventory in real time to reduce waste and prevent shortages</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Automate supplier orders and manage deliveries efficiently</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Utilize predictive analytics for optimal stock replenishment</span>
                      </li>
                    </ul>
                  </div>
                }
                delay={200}
              />
              
              <FeatureCard 
                title="Customer Engagement & Loyalty Programs" 
                description={
                  <div>
                    <p className="mb-3 text-gray-600">Boost repeat business and build lasting customer relationships</p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Personalize marketing offers based on customer preferences</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Integrate loyalty programs to reward frequent guests</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Gather real-time feedback to continuously improve service</span>
                      </li>
                    </ul>
                  </div>
                }
                delay={300}
              />
              
              <FeatureCard 
                title="Operational Analytics & Performance Monitoring" 
                description={
                  <div>
                    <p className="mb-3 text-gray-600">Drive efficiency with data-driven insights across operations</p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Access real-time dashboards for sales and service metrics</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Monitor staff performance and optimize shift scheduling</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Leverage analytics to improve service speed and operational efficiency</span>
                      </li>
                    </ul>
                  </div>
                }
                delay={400}
              />
            </div>
          </div>
        </section>
        
        {/* Offerings Section */}
        <section className="py-16 bg-white">
          <div className="content-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-8 animate-slide-in">Key QSR Offerings:</h2>
                
                <OfferingCard 
                  icon={<ShoppingBag size={28} className="text-xpectrum-purple" />}
                  title="Digital Order Assistant"
                  description="An AI-powered assistant that streamlines order taking, order management, and customer queries for a seamless dining experience."
                  delay={100}
                />
                
                <OfferingCard 
                  icon={<ShoppingCart size={28} className="text-xpectrum-purple" />}
                  title="Order Management & Delivery Coordination"
                  description="Automate order processing, optimize kitchen workflows, and coordinate delivery schedules to enhance efficiency and customer satisfaction."
                  delay={200}
                />
                
                <OfferingCard 
                  icon={<LineChart size={28} className="text-xpectrum-purple" />}
                  title="Performance Analytics & Insights"
                  description="Leverage AI to monitor sales performance, track customer feedback, and drive continuous improvement across operations."
                  delay={300}
                />
              </div>
              
              <div className="animate-fade-in-up flex items-center" style={{ animationDelay: "400ms" }}>
                <div className="bg-xpectrum-lightpurple rounded-lg overflow-hidden w-full h-[400px]">
                  <img 
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4" 
                    alt="Restaurant Operations" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 bg-xpectrum-darkpurple text-white">
          <div className="content-container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-in">Optimize Your Quick Service Operations</h2>
              <h3 className="text-2xl mb-6 animate-slide-in" style={{ animationDelay: "100ms" }}>Transform Your QSR Management with Xpectrum AI</h3>
              <p className="text-white/90 mb-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                The QSR Management System Powered by Xpectrum AI revolutionizes restaurant operations, customer engagement, and order 
                efficiency through intelligent automation, real-time analytics, and optimized workflows. Our AI-driven platform streamlines 
                order processing, enhances customer service, and provides actionable insights to drive efficiency in fast-paced environments 
                while ensuring high standards of food safety and quality.
              </p>
              
              <Button className="bg-white text-xpectrum-darkpurple hover:bg-xpectrum-lightpurple animate-pulse-slow">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </section>
        
        {/* Benefits Grid */}
        <section className="py-16 bg-gray-50">
          <div className="content-container">
            <h2 className="text-3xl font-bold mb-12 text-center animate-slide-in">Advanced Capabilities</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BenefitCard 
                icon={<Clock size={24} className="text-xpectrum-purple" />}
                title="Order Efficiency"
                description="Accelerate order processing with automated systems that reduce wait times and enhance accuracy."
                delay={100}
              />
              
              <BenefitCard 
                icon={<Users size={24} className="text-xpectrum-purple" />}
                title="Customer Engagement"
                description="Boost customer satisfaction with personalized offers and seamless digital ordering experiences."
                delay={200}
              />
              
              <BenefitCard 
                icon={<ShoppingBag size={24} className="text-xpectrum-purple" />}
                title="Inventory Management"
                description="Leverage real-time analytics to monitor stock levels, reduce waste, and optimize supply chains."
                delay={300}
              />
              
              <BenefitCard 
                icon={<ShoppingCart size={24} className="text-xpectrum-purple" />}
                title="Drive-Thru Optimization"
                description="Enhance drive-thru efficiency with AI-driven queue management and predictive order preparation."
                delay={400}
              />
              
              <BenefitCard 
                icon={<LineChart size={24} className="text-xpectrum-purple" />}
                title="Operational Insights"
                description="Access live dashboards to track performance metrics, customer feedback, and sales trends."
                delay={500}
              />
              
              <BenefitCard 
                icon={<CheckCircle size={24} className="text-xpectrum-purple" />}
                title="Food Safety & Quality"
                description="Ensure compliance with health regulations and maintain consistent quality through automated monitoring."
                delay={600}
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default QSR;

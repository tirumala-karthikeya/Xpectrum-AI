
import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CaseStudyCard = ({ 
  title, 
  description,
  index
}: { 
  title: string, 
  description: string,
  index: number
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in-up" 
      style={{ animationDelay: `${index * 150}ms` }}>
      <div className="p-6">
        <div className="text-sm font-medium text-xpectrum-purple mb-2">
          Case Study
        </div>
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        
        <p className="text-gray-700 mb-4">{description}</p>
        
        <Button variant="outline" className="group border-xpectrum-purple text-xpectrum-purple hover:bg-xpectrum-purple hover:text-white">
          See Details <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
        </Button>
      </div>
    </div>
  );
};

const CaseStudies = () => {
  // Sample case studies data
  const caseStudies = [
    {
      title: "Transforming Global HR Operations",
      description: "A multinational corporation leveraged our HRMS solution to streamline recruitment, onboarding, and performance management. By integrating a digital HR assistant, they reduced administrative overhead and boosted employee engagement across global offices."
    },
    {
      title: "Innovating Claims Processing in Insurance",
      description: "A leading insurance provider adopted our AI-driven solution to automate risk assessment, policy underwriting, and claims processing. This transformation enhanced customer satisfaction while reducing processing times and operational costs."
    },
    {
      title: "Revolutionizing Guest Experiences in Hospitality",
      description: "A premier hospitality chain utilized our platform to enhance guest check-in processes, automate room service, and streamline reservations. Real-time analytics enabled staff to deliver personalized experiences, resulting in higher guest loyalty."
    }
  ];

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
      <section className="pt-24 pb-20 bg-gradient-to-b from-white to-gray-50">
        <div className="content-container">
          <div className="text-center mb-12">
            <h4 className="text-xpectrum-purple font-semibold mb-2 animate-slide-in">Case Studies</h4>
            <h2 className="section-title animate-slide-in" style={{ animationDelay: '100ms' }}>
              Empower Your Organization
            </h2>
            
            <p className="max-w-3xl mx-auto text-gray-600 animate-slide-in" style={{ animationDelay: '200ms' }}>
              At Xpectrum, our solutions have transformed the operations of leading companies across various industries. 
              Our innovative AI-driven products have enabled these organizations to streamline processes, enhance customer 
              experiences, and achieve remarkable results. Below are some of the standout examples of how our technology 
              is making a difference.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <CaseStudyCard 
                key={index}
                index={index}
                title={study.title}
                description={study.description}
              />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default CaseStudies;

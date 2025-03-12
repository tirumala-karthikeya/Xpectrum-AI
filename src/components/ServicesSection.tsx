
import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight, Building, Users, Computer, Bot } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const ServiceCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  imageIndex 
}: { 
  icon: LucideIcon, 
  title: string, 
  description: string, 
  color: string,
  imageIndex: number
}) => {
  return (
    <div 
      className="service-card group"
      style={{ 
        backgroundImage: `url(https://images.unsplash.com/photo-148${imageIndex}-0ad4aaf24ca7)` 
      }}
    >
      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className={`${color} rounded-full p-2 w-12 h-12 flex items-center justify-center mb-4`}>
          <Icon size={24} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/90 mb-4 flex-grow">{description}</p>
        <div className="flex justify-end">
          <a href="#" className="text-white flex items-center group-hover:underline">
            Learn more <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </a>
        </div>
      </div>
    </div>
  );
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="content-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title">
            Supercharge your customer operations
          </h2>
          <p className="text-lg text-gray-600">
            Integrate AI at the core of your organization
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard 
            icon={Building}
            title="HRMS" 
            description="Expctrum HRMS Service Agent to streamline your human resources management" 
            color="bg-xpectrum-purple"
            imageIndex={7058792}
          />
          
          <ServiceCard 
            icon={Users}
            title="Insurance" 
            description="Insurance Service Support Agent delivering fast and accurate service" 
            color="bg-xpectrum-magenta"
            imageIndex={8590528}
          />
          
          <ServiceCard 
            icon={Computer}
            title="Hospitality" 
            description="Hospitality Support AI Agent enhancing guest experiences" 
            color="bg-xpectrum-blue"
            imageIndex={1749280}
          />
          
          <ServiceCard 
            icon={Bot}
            title="QSR" 
            description="QSR Service AI Agent improving quick service restaurant operations" 
            color="bg-xpectrum-darkpurple"
            imageIndex={5827404}
          />
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-700">
            Our core offering is a quantitative digital expert that seamlessly integrates into your organization, 
            providing unparalleled support across various functions. Whether it's customer service, IT management, 
            or decision-making, Xpectrum's solutions empower your teams to deliver exceptional outcomes, consistently.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

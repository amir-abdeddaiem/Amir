"use client";
import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import { Suspense } from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import { ButtonRedirect, CardUser } from "./chatBotComponents/components";
import { 
  X, Maximize2, Minimize2, Send, 
  PawPrint, User, ShoppingCart, 
  Heart, Search, ClipboardList, Map,
  Stethoscope, Bone, Dog, Cat,
  MapPin
} from 'lucide-react';

type ChatBotProps = {
  role?: string;
};

interface ModelProps {
  url: string;
  mouseX: number;
  mouseY: number;
}

interface ChatMessage {
  role: "user" | "bot";
  text: string;
  components?: React.ReactNode;
}

interface ServiceProvider {
  _id: string;
  firstName: string;
  lastName: string;
  businessName?: string;
  businessType?: string;
  services: string[];
  description: string;
  boutiqueImage?: string;
  location: string;
  certifications?: string;
  website?: string;
}

function Model({ url, mouseX, mouseY }: ModelProps) {
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, scene);
  const modelRef = useRef<any>(null);

  useEffect(() => {
    if (actions) {
      const firstAction = Object.values(actions)[0];
      if (firstAction) {
        firstAction.play();
      }
    }
  }, [actions]);

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
      const deltaX = (mouseX / window.innerWidth - 0.5) * 0.1;
      const deltaY = (mouseY / window.innerHeight - 0.5) * 0.1;
      modelRef.current.rotation.y += (deltaX - modelRef.current.rotation.y) * 0.1;
      modelRef.current.rotation.x += (deltaY - modelRef.current.rotation.x) * 0.1;
    }
  });

  return <primitive ref={modelRef} object={scene} scale={1.0} position={[0, -0.5, 0]} />;
}

export default function ChatBot({ role }: ChatBotProps) {
  const DEFAULT_ROLE = `
    You are an assistant that responds only to questions related with animals.
    Your name is Animola.
    Use these placeholders for redirection:
    [BOOKING_BUTTON] - For booking services
    [LOST_FOUND_BUTTON] - For lost and found animals
    [PROFILE_BUTTON] - For user profile
    [MARKETPLACE_BUTTON] - For marketplace
    [SERVICES_BUTTON] - For services
    [SITE_MAP] - For showing the site map
    When asked about service providers (vets, groomers, etc.), include [SERVICE_PROVIDERS:serviceType]
    where serviceType can be: vet, groomer, trainer, walker, etc.
    If no providers are available, suggest alternative options.
  `;

  role = role || DEFAULT_ROLE;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [dots, setDots] = useState<string>('');

  const SiteMap = () => (
    <div className="mt-4 p-4 bg-white rounded-lg border border-[#83C5BE]">
      <h3 className="text-lg font-bold text-[#006D77] mb-3 flex items-center">
        <Map className="mr-2" /> Site Map
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ButtonRedirect url="/user" variant="primary" className="w-full">
          <ClipboardList className="mr-2" /> Book Services
        </ButtonRedirect>
        <ButtonRedirect url="/lost-found" variant="secondary" className="w-full">
          <Search className="mr-2" /> Lost & Found Pets
        </ButtonRedirect>
        <ButtonRedirect url="/user" variant="outline" className="w-full">
          <User className="mr-2" /> My Profile
        </ButtonRedirect>
        <ButtonRedirect url="/marketplace" variant="secondary" className="w-full">
          <ShoppingCart className="mr-2" /> Marketplace
        </ButtonRedirect>
        <ButtonRedirect url="/services" variant="primary" className="w-full">
          <Heart className="mr-2" /> Our Services
        </ButtonRedirect>
      </div>
    </div>
  );

  const getServiceIcon = (serviceType: string) => {
    switch(serviceType.toLowerCase()) {
      case 'vet': return <Stethoscope size={16} className="mr-2" />;
      case 'groomer': return <Dog size={16} className="mr-2" />;
      case 'trainer': return <Bone size={16} className="mr-2" />;
      case 'walker': return <Cat size={16} className="mr-2" />;
      default: return <Heart size={16} className="mr-2" />;
    }
  };

  const fetchProviders = async (serviceType: string): Promise<ServiceProvider[]> => {
    try {
      const response = await axios.get('/api/services', {
        params: { type: serviceType }
      });

      // Mapping of common service type requests to business types
      const serviceTypeMap: Record<string, string> = {
        'vet': 'veterinarian',
        'groomer': 'groomer',
        'trainer': 'trainer',
        'walker': 'walker'
      };

      // Get the matching business type from our map
      const businessType = serviceTypeMap[serviceType.toLowerCase()] || serviceType.toLowerCase();

      // Filter providers based on businessType
      const filteredProviders = response.data.data.filter((provider: any) => 
        provider.businessType?.toLowerCase() === businessType
      );

      return filteredProviders.map((provider: any) => ({
        _id: provider._id,
        firstName: provider.firstName,
        lastName: provider.lastName,
        businessName: provider.businessName,
        businessType: provider.businessType,
        services: provider.services || [],
        description: provider.description,
        boutiqueImage: provider.boutiqueImage,
        location: provider.location,
        certifications: provider.certifications,
        website: provider.website
      }));
      
    } catch (error) {
      console.error('Error fetching providers:', error);
      return [];
    }
  };

  const renderProviderCards = (providers: ServiceProvider[]) => {
    if (!providers || providers.length === 0) {
      return (
        <div className="mt-3 text-[#83C5BE]">
          <p>No providers available at the moment.</p>
          <p className="mt-2">You can try:</p>
          <ul className="list-disc pl-5 mt-1">
            <li>Searching in nearby locations</li>
            <li>Checking back later</li>
            <li>Contacting our support team</li>
          </ul>
        </div>
      );
    }
    
    return (
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {providers.map((provider, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-[#83C5BE]/30">
            <CardUser
              url={`/service/provider/${provider._id}`}
              name={provider.businessName || `${provider.firstName} ${provider.lastName}`}
              img={provider.boutiqueImage || "/default-provider.jpg"}
            />
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-2">{provider.description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {provider.services?.map((service, ind) => (
                  <span key={`${provider._id}-service-${service}-${ind}`} className="text-xs bg-[#EDF6F9] text-[#006D77] px-2 py-1 rounded">
                    {service}
                  </span>
                ))}
              </div>
              <p className="text-sm text-[#83C5BE] flex items-center">
                <MapPin size={14} className="mr-1" />
                {provider.location}
              </p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const processMessage = async (text: string): Promise<{ text: string, components?: React.ReactNode }> => {
    const components: React.ReactNode[] = [];
    let processedText = text;

    // Check for service providers placeholder
    const serviceProviderMatch = text.match(/\[SERVICE_PROVIDERS:(\w+)\]/);
    if (serviceProviderMatch) {
      const serviceType = serviceProviderMatch[1];
      processedText = processedText.replace(serviceProviderMatch[0], '');
      const providers = await fetchProviders(serviceType);
      
      if (providers.length > 0) {
        components.push(
          <div  className="mt-3">
            <h4 className="text-md font-semibold text-[#006D77] mb-2 flex items-center">
              {getServiceIcon(serviceType)}
              Available {serviceType}s:
            </h4>
            {renderProviderCards(providers)}
          </div>
        );
      } else {
        processedText += `\n\nI couldn't find any ${serviceType}s available right now.`;
        components.push(renderProviderCards([]));
      }
    }

    // Check for site map placeholder
    if (processedText.includes('[SITE_MAP]')) {
      processedText = processedText.replace('[SITE_MAP]', '');
      components.push(<SiteMap key="site-map" />);
    }

    const buttonMap = [
      { 
        placeholder: '[BOOKING_BUTTON]', 
        url: '/user', 
        text: 'Go to Booking', 
        icon: <ClipboardList size={16} className="mr-2" />,
        variant: 'primary' as const
      },
      { 
        placeholder: '[LOST_FOUND_BUTTON]', 
        url: '/lost-found', 
        text: 'Lost & Found', 
        icon: <Search size={16} className="mr-2" />,
        variant: 'secondary' as const
      },
      { 
        placeholder: '[PROFILE_BUTTON]', 
        url: '/profile', 
        text: 'My Profile', 
        icon: <User size={16} className="mr-2" />,
        variant: 'outline' as const
      },
      { 
        placeholder: '[MARKETPLACE_BUTTON]', 
        url: '/marketplace', 
        text: 'Marketplace', 
        icon: <ShoppingCart size={16} className="mr-2" />,
        variant: 'secondary' as const
      },
      { 
        placeholder: '[SERVICES_BUTTON]', 
        url: '/services', 
        text: 'Our Services', 
        icon: <Heart size={16} className="mr-2" />,
        variant: 'primary' as const
      }
    ];

    buttonMap.forEach((button,ind) => {
      if (processedText.includes(button.placeholder)) {
        processedText = processedText.replace(button.placeholder, '');
        components.push(
          <div key={ind} className="mt-2">
            <ButtonRedirect 
              url={button.url} 
              variant={button.variant}
              className="flex items-center"
            >
              {button.icon}
              {button.text}
            </ButtonRedirect>
          </div>
        );
      }
    });

    return {
      text: processedText,
      components: components.length > 0 ? <div className="space-y-3">{components}</div> : undefined
    };
  };

  // Animation for typing indicator
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatBoxRef.current?.scrollTo({ top: chatBoxRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Mouse movement tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fetchBotResponse = async (userMessage: string) => {
    setIsBotTyping(true);
    try {
      const response = await axios.post("/api/ChatBot", {
        message: `${role} ${userMessage}`,
      });
      
      const botResponse = response.data.text || "I couldn't understand that.";
      const processed = await processMessage(botResponse);
      
      setMessages((prev) => [...prev, { 
        role: "bot", 
        text: processed.text,
        components: processed.components
      }]);
    } catch (error) {
      setMessages((prev) => [...prev, { 
        role: "bot", 
        text: "Error fetching response." 
      }]);
    }
    setIsBotTyping(false);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setMessages([...messages, { role: "user", text: message }]);
    fetchBotResponse(message);
    setMessage("");
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <>
      {/* Floating Button (always visible) */}
      {!isOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          <div className="w-16 h-16 rounded-full bg-[#83C5BE] p-2 shadow-lg flex items-center justify-center">
            <Canvas 
              camera={{ position: [0, 0, 2], fov: 50 }} 
              className="w-full h-full"
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[2, 1, 1]} intensity={1.2} />
              <Suspense fallback={null}>
                <Model url="/Models/cat.glb" mouseX={mousePosition.x} mouseY={mousePosition.y} />
              </Suspense>
              <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Canvas>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`
          fixed z-50 bg-white shadow-xl rounded-t-lg overflow-hidden
          ${isFullScreen ? 
            'inset-0 rounded-none' : 
            'bottom-0 right-0 w-full h-[80vh] max-w-3xl md:right-6 md:bottom-6 md:rounded-lg md:h-[70vh]'
          }
          transition-all duration-300 ease-in-out
        `}>
          {/* Header */}
          <div className="bg-[#006D77] text-white p-4 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#83C5BE] flex items-center justify-center">
                <PawPrint size={18} className="text-white" />
              </div>
              <h2 className="text-lg font-semibold">Animola Assistant</h2>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={toggleFullScreen}
                className="p-1 rounded-full hover:bg-[#83C5BE]/30 transition-colors"
                aria-label={isFullScreen ? "Minimize" : "Maximize"}
              >
                {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-[#83C5BE]/30 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div 
            ref={chatBoxRef} 
            className="h-[calc(100%-120px)] overflow-y-auto p-4 bg-[#EDF6F9]"
          >
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 text-[#006D77]">
                <div className="w-24 h-24 mb-4 flex items-center justify-center">
                  <PawPrint size={48} className="text-[#E29578]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Hello! I'm Animola</h3>
                <p className="max-w-md">Ask me anything about animals, pet care, or book services for your furry friends.</p>
                <p className="text-sm mt-2">Try asking about vets or our site map!</p>
              </div>
            )}

            {messages.map((msg, index) => (
              <div 
                key={index} 
                className={`mb-4 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg p-3 ${msg.role === "user" 
                    ? "bg-[#83C5BE] text-white rounded-br-none" 
                    : "bg-[#E29578] text-white rounded-bl-none"}`}
                >
                  <ReactMarkdown
                    components={{
                      a: ({ node, ...props }) => (
                        <a {...props} className="text-[#006D77] underline font-medium" target="_blank" rel="noopener noreferrer" />
                      ),
                    }}
                  >
                    {msg.text}
                  </ReactMarkdown>
                  {msg.components && msg.components}
                </div>
              </div>
            ))}

            {isBotTyping && (
              <div className="flex justify-start">
                <div className="bg-[#E29578] text-white p-3 rounded-lg rounded-bl-none max-w-[80%] flex items-center">
                  <PawPrint size={16} className="mr-2 animate-pulse" />
                  Typing{dots}
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-[#83C5BE]/30">
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-3 bg-[#EDF6F9] text-[#006D77] border border-[#83C5BE]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E29578] focus:border-transparent"
                placeholder="Ask about animals..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                className="p-3 bg-[#006D77] hover:bg-[#83C5BE] text-white rounded-lg transition-colors flex items-center justify-center"
                onClick={handleSendMessage}
                disabled={isBotTyping}
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-xs text-[#83C5BE] mt-2 text-center flex items-center justify-center">
              <PawPrint size={12} className="mr-1" />
              Animola will only respond to animal-related questions
            </p>
          </div>
        </div>
      )}
    </>
  );
}
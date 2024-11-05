import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const slides = [
  {
    title: "Welcome to the Hume App",
    description: "This official app is free and brings you the latest model improvements from Hume AI.",
    image: "/onboarding-1.svg"
  },
  {
    title: "Chat about any topic",
    description: "On the home screen, you'll be able to select a topic to chat about with one of our unique personalities",
    image: "/onboarding-2.svg"
  },
  {
    title: "Start your journey",
    description: "Begin exploring conversations with our AI personalities",
    image: "/onboarding-3.svg"
  }
];

export function Onboarding() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(curr => curr + 1);
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen gradient-bg p-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-8 animate-fade-in">
        <img 
          src={slides[currentSlide].image} 
          alt={slides[currentSlide].title}
          className="w-64 h-64 mx-auto"
        />
        
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-gray-900">
            {slides[currentSlide].title}
          </h1>
          <p className="text-gray-600">
            {slides[currentSlide].description}
          </p>
        </div>

        <div className="flex justify-center space-x-2 mt-8">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-colors ${
                index === currentSlide ? "bg-gray-800" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        <Button
          className="w-full py-6 text-lg rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-colors"
          onClick={nextSlide}
        >
          {currentSlide === slides.length - 1 ? (
            "Get Started"
          ) : (
            <>
              Next
              <ArrowRight className="ml-2 h-5 w-5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
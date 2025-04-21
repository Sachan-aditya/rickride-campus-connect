
import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Image } from "lucide-react";

// Add your own rickshaw/campus images in /public and reference here
const images = [
  "/rickshaw1.jpg",
  "/rickshaw2.jpg",
  "/campus1.jpg",
  "/campus2.jpg",
  "/fun1.jpg",
];

export default function CarouselImages({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full max-w-xl mx-auto ${className}`}>
      <Carousel opts={{ loop: true }}>
        <CarouselContent>
          {images.map((src, idx) => (
            <CarouselItem key={idx} className="flex items-center justify-center">
              <div className="rounded-xl overflow-hidden bg-gradient-to-br from-blue-200/40 to-purple-200/40 shadow-lg backdrop-blur-md w-80 h-52 flex items-center justify-center">
                <img
                  src={src}
                  alt={`RickRide gallery ${idx + 1}`}
                  className="object-cover w-full h-full"
                  style={{ minHeight: "13rem" }}
                  onError={e => {
                    (e.target as HTMLImageElement).src = "";
                  }}
                />
                {/* If image not found, fallback */}
                {!src && <Image className="w-24 h-24 text-blue-300 opacity-40" />}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

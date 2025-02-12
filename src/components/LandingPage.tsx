import React from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { useEventStore } from "../lib/store";

interface LandingPageProps {
  eventImage?: string;
  eventTitle?: string;
  eventDescription?: string;
}

export default function LandingPage({
  eventTitle = "Conferência Tech 2024",
  eventDescription = "Junte-se a nós na conferência de tecnologia mais emocionante do ano. Faça networking com líderes da indústria, aprenda com especialistas e descubra as últimas inovações.",
}: LandingPageProps) {
  const { backgroundImage } = useEventStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-2 right-4 z-10">
        <button
          onClick={() => navigate("/admin")}
          className="text-white/70 hover:text-white text-sm underline underline-offset-4 transition-colors"
        >
          Área Administrativa
        </button>
      </div>

      <div className="relative h-screen bg-black">
        <img
          src={backgroundImage}
          alt="Capa do Evento"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
          <h1 className="text-6xl font-bold mb-6">{eventTitle}</h1>
          <p className="text-2xl max-w-3xl mb-12">{eventDescription}</p>
          <Button
            className="h-16 px-12 text-xl"
            onClick={() => navigate("/register")}
          >
            Inscreva-se Agora
          </Button>
        </div>
      </div>
    </div>
  );
}

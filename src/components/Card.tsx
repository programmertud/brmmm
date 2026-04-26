// src/components/Card.tsx
import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  color?: string;
  onClick?: () => void;
}

export default function Card({ title, children, color, onClick }: CardProps) {
  const bgColor = color ? color : "bg-white";
  return (
    <div
      className={`p-6 rounded-xl shadow-md cursor-pointer transition transform hover:scale-105 ${bgColor} text-white`}
      onClick={onClick}
    >
      {title && <h2 className="text-lg font-bold mb-2">{title}</h2>}
      {children}
    </div>
  );
}

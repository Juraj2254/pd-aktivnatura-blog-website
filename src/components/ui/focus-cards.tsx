import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Calendar, Users } from "lucide-react";

interface FocusCard {
  id: string;
  title: string;
  slug: string;
  src: string;
  category?: string;
  date?: string;
  attendees?: number;
}

const Card = React.memo(
  ({
    card,
    index,
    hovered,
    setHovered,
  }: {
    card: FocusCard;
    index: number;
    hovered: number | null;
    setHovered: React.Dispatch<React.SetStateAction<number | null>>;
  }) => (
    <Link
      to={`/izleti/${card.slug}`}
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "rounded-lg relative bg-muted overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out block",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
      )}
    >
      <img
        src={card.src}
        alt={card.title}
        className="object-cover absolute inset-0 w-full h-full"
      />
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-background/95 via-background/60 to-transparent flex flex-col justify-end p-4 md:p-6 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      >
        {card.category && (
          <div className="mb-2">
            <span className="inline-block bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-xs md:text-sm font-medium">
              {card.category}
            </span>
          </div>
        )}
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
          {card.title}
        </h3>
        <div className="flex flex-wrap gap-3 md:gap-4 text-sm text-muted-foreground">
          {card.date && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{card.date}</span>
            </div>
          )}
          {card.attendees && (
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{card.attendees} sudionika</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
);

Card.displayName = "Card";

export function FocusCards({ cards }: { cards: FocusCard[] }) {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 w-full">
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}

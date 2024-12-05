import React from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils";
import { ChevronRight, Megaphone } from 'lucide-react';

const HomeAnnouncementCard = ({ title, content, link, isCenter }) => (
    <Card className={cn(
      "bg-white/90 backdrop-blur-sm border-0 shadow-lg transition-all duration-300",
      "w-full max-w-[400px] aspect-square mx-auto flex flex-col justify-between",
      "hover:shadow-xl transform hover:-translate-y-1",
      isCenter ? "opacity-100 scale-100" : "opacity-70 scale-95"
    )}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Megaphone size={20} className="text-red-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow pb-4">
        <p className="text-gray-600 leading-relaxed">{content}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          variant="link" 
          className="text-red-600 text-2xl hover:text-red-700 p-0 hover:no-underline font-semibold"
          asChild
        >
          <a href={link} className="flex items-center gap-2">
            Learn More <ChevronRight size={16} />
          </a>
        </Button>
      </CardFooter>
    </Card>
);

export default HomeAnnouncementCard;


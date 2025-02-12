import React from "react";
import { Card } from "./ui/card";

interface EventLocationMapProps {
  latitude?: number;
  longitude?: number;
  eventName?: string;
  address?: string;
}

const EventLocationMap = ({
  latitude = 40.7128,
  longitude = -74.006,
  eventName = "Sample Event",
  address = "123 Main St, New York, NY 10001",
}: EventLocationMapProps) => {
  return (
    <Card className="w-full h-[300px] bg-white p-4 relative">
      <div className="absolute inset-0 bg-gray-100">
        {/* Placeholder for map - in real implementation this would be replaced with a proper map component */}
        <div className="w-full h-full flex items-center justify-center flex-col gap-2 text-gray-600">
          <div className="text-lg font-semibold">{eventName}</div>
          <div className="text-sm">{address}</div>
          <div className="text-xs text-gray-500">
            {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </div>
          <div className="text-sm mt-2">[Map Component Placeholder]</div>
        </div>
      </div>
    </Card>
  );
};

export default EventLocationMap;

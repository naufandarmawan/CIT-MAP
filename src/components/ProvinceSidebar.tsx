import React, { useState, useEffect } from "react";
import axios from "axios";
import { cn } from "../lib/utils";
import { ProvinceHeader } from "./province/ProvinceHeader";
import { ProvinceTabs } from "./province/ProvinceTabs";
import { ProvinceAbout } from "./province/ProvinceAbout";
import { ProvinceSchools } from "./province/ProvinceSchools";
import { ProvincePhotos } from "./province/ProvincePhotos";
import { useIsMobile } from "../hooks/use-mobile";

interface SchoolInfo {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

interface VolunteerInfo {
  name: string;
  contact?: string;
}

interface ProvinceData {
  description: string;
  provinceImage: string;
  images: string[];
  schools: SchoolInfo[];
  volunteers: VolunteerInfo[];
  stats: { districts: number; students: number };
}

interface ProvinceSidebarProps {
  province: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ProvinceSidebar: React.FC<ProvinceSidebarProps> = ({
  province,
  isOpen,
  onClose,
}) => {
  const [provinceData, setProvinceData] = useState<ProvinceData | null>(null);
  const [activeTab, setActiveTab] = useState<"about" | "schools" | "photos">(
    "about"
  );
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Record<string, ProvinceData>>(
          `/data/provincesData.json`
        );
        console.log(response.data)
        setProvinceData(
          response.data[province] || {
            description: "Information not available",
            provinceImage: "",
            images: [
              "https://images.unsplash.com/photo-1544735716-392fe2489ffa",
            ],
            schools: [],
            volunteers: [],
            stats: { districts: 0, students: 0 },
          }
        );
      } catch (error) {
        console.error("Failed to fetch province data:", error);
        setProvinceData(null);
      }
    };

    fetchData();
  }, [province]);

  const mobileClasses = isOpen ? "translate-y-0" : "translate-y-full";
  const desktopClasses = isOpen ? "translate-x-0" : "-translate-x-full";

  if (!provinceData) {
    return <div>Loading...</div>; // Or any other loading state indication
  }

  return (
    <div
      className={cn(
        "fixed transition-transform duration-300 ease-in-out z-50 bg-gray-900 shadow-lg",
        isMobile
          ? cn(
              "bottom-0 left-0 right-0 h-[50vh] border-t border-[#2DD4BF]/20 rounded-t-xl",
              mobileClasses
            )
          : cn(
              "top-0 left-0 h-full w-[450px] border-r border-[#2DD4BF]/20",
              desktopClasses
            )
      )}
    >
      <ProvinceHeader province={province} onClose={onClose} />
      <ProvinceTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div
        className={cn(
          "p-4 overflow-y-auto text-gray-300",
          isMobile ? "max-h-[calc(45vh-120px)]" : "max-h-[calc(100vh-120px)]"
        )}
      >
        {activeTab === "about" && (
          <ProvinceAbout
            image={provinceData.provinceImage}
            province={province}
            description={provinceData.description}
            volunteers={provinceData.volunteers}
            stats={provinceData.stats}
          />
        )}
        {activeTab === "schools" && (
          <ProvinceSchools province={province} schools={provinceData.schools} />
        )}
        {activeTab === "photos" && (
          <ProvincePhotos
            province={province}
            provinceImages={provinceData.images}
          />
        )}
      </div>
    </div>
  );
};
import { BusinessCard } from "@/components/ui/business-card";
import Link from "next/link";
import {
  Edit3,
  Calendar,
  BarChart3,
  Clock,
  Activity,
  Unlock,
} from "lucide-react";

const routeMap: { [key: string]: string } = {
  "各店リスト": "/store-list",
  "ホステスマネージャリスト": "/hostess-manager-list",
  "店舗別実績ノルマ集計表": "/store-customer-route-summary",
  "時間帯別ホステス出勤": "/time-based-hostess-attendance",
  "リアルタイム自動成績集計表": "/realtime-performance-summary",
  "店舗別メディア利用集計": "/store-media-usage-summary",
  "ロック解除承認リスト": "/unlock-approval-list"
};

export const RightPanel = () => {
  const sections = [
    {
      title: "F",
      items: [
        { name: "各店リスト", icon: Edit3 },
        { name: "ホステスマネージャリスト", icon: Calendar },
        { name: "店舗別実績ノルマ集計表", icon: BarChart3 },
        { name: "時間帯別ホステス出勤", icon: Clock },
        { name: "リアルタイム自動成績集計表", icon: Activity },
        { name: "店舗別メディア利用集計", icon: BarChart3 },
        { name: "ロック解除承認リスト", icon: Unlock }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {sections.map((section, index) => (
        <div key={index} className="border border-border rounded-lg p-4">
          <div className="grid grid-cols-1 gap-2">
            {section.items.map((item) => {
              const route = routeMap[item.name];
              return (
                <Link key={item.name} href={route}>
                  <BusinessCard
                    variant="accent"
                    className="flex items-center gap-3 p-3 text-sm cursor-pointer hover:bg-opacity-80 transition-colors"
                  >
                    <item.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </BusinessCard>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
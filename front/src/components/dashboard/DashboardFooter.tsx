"use client";

import { useRouter } from "next/navigation";
import { BusinessCard } from "@/components/ui/business-card";
import { LogOut, Circle } from "lucide-react";
import { logout } from "@/lib/auth";

export const DashboardFooter = () => {
  const router = useRouter();
  // 現在の日付を取得
  const today = new Date();
  const todayStr = today.toLocaleDateString('ja-JP', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  });

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <div className="bg-gradient-secondary p-4 border-t border-border">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">
            処理日：{todayStr}
          </span>
          <div className="flex items-center gap-2">
            <Circle className="w-3 h-3 fill-primary text-primary" />
            <span className="text-sm text-muted-foreground">着信=1件</span>
          </div>
        </div>
        
        <BusinessCard 
          variant="secondary"
          className="flex items-center gap-2 px-4 py-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm">ログアウト</span>
        </BusinessCard>
      </div>
    </div>
  );
};
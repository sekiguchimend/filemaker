'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, TrendingUp, ArrowUp, ArrowDown, Minus, Crown, Award, Star } from "lucide-react";
import { sampleHostessRanking } from "@/data/hostessSampleData";
import type { HostessRanking } from "@/types/hostess";
import type { SortKey, RankingCardProps, RankChangeIconProps } from "@/types/hostess-ranking";
import { SORT_OPTIONS } from "@/types/hostess-ranking";

// ランク変動アイコン
const RankChangeIcon = ({ change }: RankChangeIconProps) => {
  switch (change) {
    case 'up':
      return <ArrowUp className="w-4 h-4 text-green-600" />;
    case 'down':
      return <ArrowDown className="w-4 h-4 text-red-600" />;
    case 'same':
      return <Minus className="w-4 h-4 text-gray-400" />;
    case 'new':
      return <Star className="w-4 h-4 text-yellow-500" />;
  }
};

// ランキングカードコンポーネント
const RankingCard = ({ 
  title, 
  icon: Icon,
  sortKey, 
  onSortChange 
}: RankingCardProps) => {
  const [selectedStore, setSelectedStore] = useState<string>('all');
  
  // 店舗でフィルタリング
  const filteredData = useMemo(() => {
    if (selectedStore === 'all') {
      return sampleHostessRanking;
    }
    return sampleHostessRanking.filter(item => item.storeId === selectedStore);
  }, [selectedStore]);

  // データをソート
  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      const aValue = a[sortKey] || 0;
      const bValue = b[sortKey] || 0;
      return bValue - aValue;
    });
  }, [filteredData, sortKey]);

  // 店舗リストを取得
  const stores = useMemo(() => {
    const storeMap = new Map<string, string>();
    sampleHostessRanking.forEach(item => {
      if (item.storeId && item.storeName) {
        storeMap.set(item.storeId, item.storeName);
      }
    });
    return Array.from(storeMap.entries()).map(([id, name]) => ({ id, name }));
  }, []);

  // 現在のソート基準のラベルを取得
  const currentSortLabel = SORT_OPTIONS.find(opt => opt.value === sortKey)?.label || '';

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {title}
          </CardTitle>
        </div>
        
        {/* ソート基準選択 */}
        <div className="space-y-2">
          <Select value={sortKey} onValueChange={(value) => onSortChange(value as SortKey)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="ソート基準を選択" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* 店舗フィルター */}
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="店舗を選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全店舗</SelectItem>
              {stores.map((store) => (
                <SelectItem key={store.id} value={store.id}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {sortedData.map((hostess, index) => {
            const displayValue = hostess[sortKey];
            const isPercentage = sortKey === 'repeatCustomerRate' || sortKey === 'extensionRate';
            const isCurrency = sortKey === 'monthlyEarnings' || sortKey === 'nominationRevenue' || sortKey === 'averageCustomerSpending';
            
            return (
              <div
                key={hostess.id}
                className={`p-3 rounded-lg border transition-colors ${
                  index === 0 ? 'bg-yellow-50 border-yellow-300' :
                  index === 1 ? 'bg-gray-50 border-gray-300' :
                  index === 2 ? 'bg-orange-50 border-orange-300' :
                  'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {/* ランク表示 */}
                    <div className="flex flex-col items-center min-w-[40px]">
                      <div className={`text-2xl font-bold ${
                        index === 0 ? 'text-yellow-600' :
                        index === 1 ? 'text-gray-600' :
                        index === 2 ? 'text-orange-600' :
                        'text-gray-800'
                      }`}>
                        {index + 1}
                      </div>
                      <RankChangeIcon change={hostess.rankChange} />
                    </div>

                    {/* ホステス情報 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-sm">{hostess.stageName}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          hostess.category === 'VIP' ? 'bg-purple-100 text-purple-700' :
                          hostess.category === 'Lady' ? 'bg-pink-100 text-pink-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {hostess.category}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{hostess.hostessName}</p>
                      <p className="text-xs text-gray-500">{hostess.storeName}</p>
                      
                      {/* 主要指標 */}
                      <div className="mt-2 text-sm">
                        <div className="font-bold text-blue-600">
                          {currentSortLabel}: {
                            isCurrency ? `¥${displayValue?.toLocaleString()}` :
                            isPercentage ? `${displayValue}%` :
                            displayValue?.toLocaleString()
                          }
                        </div>
                      </div>

                      {/* サブ指標 */}
                      <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-gray-600">
                        <div>月収: ¥{hostess.monthlyEarnings.toLocaleString()}</div>
                        <div>客数: {hostess.totalCustomers}名</div>
                        <div>指名: {hostess.regularNominationCount + hostess.panelNominationCount}件</div>
                        <div>満足度: {hostess.customerSatisfactionScore}</div>
                      </div>

                      {/* 特別な実績 */}
                      {hostess.specialAchievements.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {hostess.specialAchievements.map((achievement, i) => (
                            <span
                              key={i}
                              className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1"
                            >
                              <Award className="w-3 h-3" />
                              {achievement}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default function HostessRanking() {
  const router = useRouter();
  const [sortKeys, setSortKeys] = useState<[SortKey, SortKey, SortKey, SortKey]>([
    'monthlyEarnings',
    'nominationRevenue',
    'totalCustomers',
    'regularNominationCount'
  ]);

  const handleSortChange = (index: number, key: SortKey) => {
    const newSortKeys = [...sortKeys] as [SortKey, SortKey, SortKey, SortKey];
    newSortKeys[index] = key;
    setSortKeys(newSortKeys);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 戻るボタン */}
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={() => router.push('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          ダッシュボードに戻る
        </Button>
      </div>

      {/* ヘッダー */}
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6" />
              <div>
                <h1 className="text-2xl font-bold">ホステスランキング</h1>
                <p className="text-sm text-gray-600 mt-1">
                  指名料金区分や様々な条件で集計し、ランキングを作成します
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Crown className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
              <p className="text-sm text-gray-600">総ホステス数</p>
              <p className="text-2xl font-bold">{sampleHostessRanking.length}名</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <p className="text-sm text-gray-600">平均月間売上</p>
              <p className="text-2xl font-bold">
                ¥{Math.round(sampleHostessRanking.reduce((sum, h) => sum + h.monthlyEarnings, 0) / sampleHostessRanking.length).toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Award className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <p className="text-sm text-gray-600">総指名数</p>
              <p className="text-2xl font-bold">
                {sampleHostessRanking.reduce((sum, h) => sum + h.regularNominationCount + h.panelNominationCount, 0)}件
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <p className="text-sm text-gray-600">平均満足度</p>
              <p className="text-2xl font-bold">
                {(sampleHostessRanking.reduce((sum, h) => sum + h.customerSatisfactionScore, 0) / sampleHostessRanking.length).toFixed(1)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4つのランキングリスト */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RankingCard
          title="ランキング1"
          icon={Crown}
          sortKey={sortKeys[0]}
          onSortChange={(key) => handleSortChange(0, key)}
        />
        <RankingCard
          title="ランキング2"
          icon={TrendingUp}
          sortKey={sortKeys[1]}
          onSortChange={(key) => handleSortChange(1, key)}
        />
        <RankingCard
          title="ランキング3"
          icon={Award}
          sortKey={sortKeys[2]}
          onSortChange={(key) => handleSortChange(2, key)}
        />
        <RankingCard
          title="ランキング4"
          icon={Star}
          sortKey={sortKeys[3]}
          onSortChange={(key) => handleSortChange(3, key)}
        />
      </div>
    </div>
  );
}

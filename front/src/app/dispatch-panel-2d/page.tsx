'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
// 将来の実装で使用予定の型とデータ
// import type { HostessSchedule, StaffSchedule, DispatchData, DriverData, InDriverPendingReservation, HostessDelivery } from '@/types';
import { sampleHostesses, sampleStaff, sampleDrivers } from '@/data/dispatchSampleData';

const StatusIndicator = ({ status }: { status: string }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-500';
      case 'working': return 'bg-red-500';
      case 'finished': return 'bg-gray-500';
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
  );
};

export default function DispatchPanel2D() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedHostess, setSelectedHostess] = useState<string | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}年${month}月${day}日`;
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 戻るボタン */}
      <div className="p-4">
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          ダッシュボードに戻る
        </Button>
      </div>

      {/* 上部ボタン群 */}
      <div className="px-4 mb-4">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" className="bg-blue-100">
            ドライバー情報
          </Button>
          <Button variant="outline" size="sm" className="bg-purple-100">
            新規配車検査
          </Button>
          <Button variant="outline" size="sm" className="bg-green-100">
            RTIIパネル
          </Button>
          <Button variant="outline" size="sm" className="bg-yellow-100">
            手配表
          </Button>
          <Button variant="outline" size="sm" className="bg-gray-100">
            Menu
          </Button>
          <Button variant="outline" size="sm" className="bg-blue-200">
            チャット表示
          </Button>
          <div className="ml-auto text-sm font-bold">
            {formatDate(currentTime)} {formatTime(currentTime)}
          </div>
        </div>
      </div>

      {/* メインコンテンツエリア */}
        <div className="px-4 grid grid-cols-12 gap-4 h-[calc(100vh-200px)]">
        {/* 左側パネル - 出勤予定ホステス & スタッフ */}
        <div className="col-span-3 space-y-4">
          {/* 出勤予定ホステス */}
          <Card className="h-[400px]">
            <CardHeader className="pb-2">
              <h3 className="text-xs font-bold bg-pink-200 p-2 rounde text-center">出勤予定ホステス</h3>
            </CardHeader>
            <CardContent className="p-2">
              {/* ヘッダー行（固定） */}
                <div className="grid gap-1 p-1 bg-white rounded text-[8px] font-bold sticky top-0 z-10" style={{gridTemplateColumns: '60px 60px 30px 40px 1fr 40px 40px'}}>
                <div className="text-center flex items-end justify-center">ホステス名</div>
                <div className="text-center flex items-end justify-center">迎えドラ</div>
                <div className="text-center flex items-end justify-center">決定</div>
                <div className="text-center flex items-end justify-center">出勤</div>
                <div className="text-center flex items-end justify-center">迎え場所</div>
                <div className="text-center flex items-end justify-center">終了</div>
                <div className="text-center flex items-end justify-center">帰宅</div>
              </div>
              
              {/* データ行（スクロール可能） */}
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {sampleHostesses.map((hostess) => (
                  <div 
                    key={hostess.id} 
                    className={`grid gap-1 p-1 rounded cursor-pointer hover:bg-gray-100 text-[8px] ${
                      selectedHostess === hostess.id ? 'bg-blue-100' : ''
                    }`}
                    style={{gridTemplateColumns: '60px 60px 30px 40px 1fr 40px 40px'}}
                    onClick={() => setSelectedHostess(hostess.id)}
                  >
                    {/* ホステス名 */}
                    <div className="text-center font-semibold text-blue-600 whitespace-nowrap">
                      {hostess.name}
                    </div>
                    
                    {/* 迎えドラ */}
                    <div className="text-center text-orange-600 whitespace-nowrap">
                      {hostess.pickupDriver || '-'}
                    </div>
                    
                    {/* 決定 */}
                    <div className="text-center font-bold whitespace-nowrap">
                      {hostess.decision}
                    </div>
                    
                    {/* 出勤 */}
                    <div className="text-center font-bold text-green-600 whitespace-nowrap">
                      {hostess.workStart || '-'}
                    </div>
                    
                    {/* 迎え場所 */}
                    <div className="text-center text-gray-600 truncate">
                      {hostess.pickupLocation || '-'}
                    </div>
                    
                    {/* 終了 */}
                    <div className="text-center text-red-600 whitespace-nowrap">
                      {hostess.workEnd || '-'}
                    </div>
                    
                    {/* 帰宅 */}
                    <div className="text-center text-purple-600 whitespace-nowrap">
                      {hostess.goHome || '-'}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* スタッフ予定リスト */}
          <Card className="h-64">
            <CardHeader className="pb-2">
              <h3 className="text-xs font-bold bg-blue-200 p-2 rounded text-center">スタッフ予定リスト</h3>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1 max-h-44 overflow-y-auto">
                {sampleStaff.map((staff, index) => (
                  <div 
                    key={index} 
                    className={`p-2 rounded cursor-pointer hover:bg-gray-100 ${
                      selectedStaff === index.toString() ? 'bg-blue-100' : ''
                    }`}
                    onClick={() => setSelectedStaff(index.toString())}
                  >
                    <div className="text-[8px]">
                      <div className="font-semibold text-gray-800">{staff.memo}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* INドラ未定予約リスト */}
        <div className="col-span-3 space-y-4">
          <Card className="h-[400px]">
            <CardHeader className="pb-2">
              <h3 className="text-xs font-bold bg-orange-200 p-2 rounded text-center">INドラ未定予約リスト</h3>
            </CardHeader>
            <CardContent className="p-2">
              {/* ヘッダー行（固定） */}
                <div className="grid gap-1 p-1 bg-white rounded text-[8px] font-bold sticky top-0 z-10" style={{gridTemplateColumns: '40px 1fr 50px 45px 18px 18px 18px 18px 20px'}}>
                <div className="text-center flex items-end justify-center">開始</div>
                <div className="text-center flex items-end justify-center">場所</div>
                <div className="text-center flex items-end justify-center">ホステス名</div>
                <div className="text-center flex items-end justify-center">時間計</div>
                <div className="text-center flex items-end justify-center">領収書</div>
                <div className="text-center flex items-end justify-center">待合せ</div>
                <div className="text-center flex items-end justify-center">着TEL</div>
                <div className="text-center flex items-end justify-center">カード</div>
                <div className="text-center flex items-end justify-center">オプション</div>
              </div>
              
              {/* データ行（スクロール可能） */}
              <div className="space-y-1 max-h-[320px] overflow-y-auto">
                {/* サンプルデータ */}
                {[
                  { id: "1", start: "16:30", location: "成田空港", hostessName: "みぽりん", timeTotal: "120分", receipt: true, waiting: false, arrivalCall: true, card: false, option: true },
                  { id: "2", start: "17:00", location: "羽田空港", hostessName: "さとか", timeTotal: "90分", receipt: false, waiting: true, arrivalCall: true, card: true, option: false },
                  { id: "3", start: "17:30", location: "上野駅", hostessName: "せり", timeTotal: "180分", receipt: true, waiting: true, arrivalCall: false, card: false, option: true },
                  { id: "4", start: "18:00", location: "成田空港", hostessName: "みか", timeTotal: "60分", receipt: false, waiting: false, arrivalCall: true, card: true, option: false },
                  { id: "5", start: "18:30", location: "羽田空港", hostessName: "らん", timeTotal: "150分", receipt: true, waiting: true, arrivalCall: true, card: false, option: true }
                ].map((reservation) => (
                  <div 
                    key={reservation.id} 
                      className="grid gap-1 p-1 rounded cursor-pointer hover:bg-gray-100 text-[8px] bg-yellow-50"
                    style={{gridTemplateColumns: '40px 1fr 50px 45px 18px 18px 18px 18px 20px'}}
                  >
                    <div className="text-center font-bold text-red-600 whitespace-nowrap">
                      {reservation.start}
                    </div>
                    <div className="text-center text-gray-600 truncate">
                      {reservation.location}
                    </div>
                    <div className="text-center font-semibold text-pink-600 whitespace-nowrap">
                      {reservation.hostessName}
                    </div>
                    <div className="text-center font-bold text-blue-600 whitespace-nowrap">
                      {reservation.timeTotal}
                    </div>
                    <div className="text-center">
                      <span className={`px-1 py-0.5 rounded text-[8px] ${reservation.receipt ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {reservation.receipt ? '○' : '×'}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className={`px-1 py-0.5 rounded text-[8px] ${reservation.waiting ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {reservation.waiting ? '○' : '×'}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className={`px-1 py-0.5 rounded text-[8px] ${reservation.arrivalCall ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {reservation.arrivalCall ? '○' : '×'}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className={`px-1 py-0.5 rounded text-[8px] ${reservation.card ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {reservation.card ? '○' : '×'}
                      </span>
                    </div>
                    <div className="text-center">
                      <span className={`px-1 py-0.5 rounded text-[8px] ${reservation.option ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {reservation.option ? '○' : '×'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* メモ・引継事項　ドラ休憩 */}
          <Card className="h-64">
            <CardHeader className="pb-2">
              <h3 className="text-xs font-bold bg-green-200 p-2 rounded text-center">メモ・引継事項　ドラ休憩</h3>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-1 max-h-44 overflow-y-auto">
                {[
                  { memo: "田中ドライバー 14:00-15:00 休憩中" },
                  { memo: "佐藤ドライバー 羽田空港方面担当" },
                  { memo: "山田ドライバー 成田空港ルート優先" },
                  { memo: "鈴木ドライバー 16:30まで休憩予定" },
                  { memo: "高橋ドライバー 長距離配車可能" },
                  { memo: "伊藤ドライバー 新人研修中・短距離のみ" }
                ].map((item, index) => (
                  <div 
                    key={index} 
                    className="p-2 rounded cursor-pointer hover:bg-gray-100 bg-green-50"
                  >
                    <div className="text-[8px]">
                      <div className="font-semibold text-gray-800">{item.memo}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 中央エリア - メイン配車情報 */}
        <div className="col-span-3">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-center">OUTドラ未定・接客中リスト</h3>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {/* 配車情報テーブル */}
              <div className="border border-gray-300 rounded">
                <table className="w-full text-[8px]">
                  <thead>
                    <tr className="bg-white">
                      <th className="border border-gray-300 px-2 py-1 align-bottom">ホステス名</th>
                      <th className="border border-gray-300 px-2 py-1 align-bottom">出発地</th>
                      <th className="border border-gray-300 px-2 py-1 align-bottom">目的地</th>
                      <th className="border border-gray-300 px-2 py-1 align-bottom">時刻</th>
                      <th className="border border-gray-300 px-2 py-1 align-bottom">ドライバー</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: "1", number: "0057", hostess: "みぽりん", from: "店舗", to: "成田空港", time: "22:15", driver: "未定", status: "out_pending" },
                      { id: "2", number: "0058", hostess: "さとか", from: "店舗", to: "羽田空港", time: "22:45", driver: "未定", status: "out_pending" },
                      { id: "3", number: "0059", hostess: "せり", from: "店舗", to: "成田空港", time: "23:00", driver: "未定", status: "out_pending" },
                      { id: "4", number: "0060", hostess: "みか", from: "店舗", to: "上野駅", time: "23:30", driver: "未定", status: "serving" },
                      { id: "5", number: "0061", hostess: "らん", from: "店舗", to: "羽田空港", time: "24:00", driver: "未定", status: "serving" }
                    ].map((outDispatch) => (
                      <tr key={outDispatch.id} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-1 font-semibold text-pink-600">{outDispatch.hostess}</td>
                        <td className="border border-gray-300 px-2 py-1">{outDispatch.from}</td>
                        <td className="border border-gray-300 px-2 py-1">{outDispatch.to}</td>
                        <td className="border border-gray-300 px-2 py-1 text-center font-bold">{outDispatch.time}</td>
                        <td className="border border-gray-300 px-2 py-1 text-center text-red-600 font-bold">{outDispatch.driver}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* 右側パネル - 統計とドライバー管理 */}
        <div className="col-span-1 space-y-4">
          {/* 終了済みリスト */}
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-xs font-bold bg-red-200 p-2 rounded text-center">終了済みリスト</h3>
            </CardHeader>
            <CardContent className="p-2">
              <div className="text-[8px] text-gray-600">
                <div>OUT中予定・特急中リスト</div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between">
                    <span>みか</span>
                    <span className="text-red-600">16:09</span>
                  </div>
                  <div className="flex justify-between">
                    <span>せり</span>
                    <span className="text-red-600">21:58</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ドライバー管理 */}
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-xs font-bold bg-blue-200 p-2 rounded text-center">ドライバー管理</h3>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-2">
                {sampleDrivers.map((driver) => (
                  <div key={driver.id} className="flex items-center gap-2 p-2 bg-white rounded border">
                    <StatusIndicator status={driver.status} />
                    <div className="flex-1 text-[8px]">
                      <div className="font-bold">{driver.name}</div>
                      <div className="text-gray-500">{driver.location}</div>
                      {driver.currentJob && (
                        <div className="text-blue-600">Job: {driver.currentJob}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 統計情報 */}
          <Card>
            <CardHeader className="pb-2">
              <h3 className="text-xs font-bold bg-yellow-200 p-2 rounded text-center">統計情報</h3>
            </CardHeader>
            <CardContent className="p-2">
              <div className="space-y-2 text-[8px]">
                <div className="flex justify-between">
                  <span>本日配車数:</span>
                  <span className="font-bold text-blue-600">12件</span>
                </div>
                <div className="flex justify-between">
                  <span>完了:</span>
                  <span className="font-bold text-green-600">8件</span>
                </div>
                <div className="flex justify-between">
                  <span>進行中:</span>
                  <span className="font-bold text-orange-600">3件</span>
                </div>
                <div className="flex justify-between">
                  <span>待機中:</span>
                  <span className="font-bold text-red-600">1件</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* 右端パネル - ホステス送り・帰宅 */}
        <div className="col-span-2">
          <Card className="h-[680px]">
            <CardHeader className="pb-2">
              <h3 className="text-xs font-bold bg-purple-200 p-2 rounded text-center">ホステス送り・帰宅</h3>
            </CardHeader>
            <CardContent className="p-2">
              {/* ヘッダー行（固定） */}
              <div className="grid gap-1 p-1 bg-white rounded text-[8px] font-bold sticky top-0 z-10" style={{gridTemplateColumns: '0.5fr 1fr 1fr 0.7fr 0.7fr 1fr 0.5fr'}}>
                <div className="text-center flex items-end justify-center">荷物</div>
                <div className="text-center flex items-end justify-center">ホステス</div>
                <div className="text-center flex items-end justify-center">送りドラ</div>
                <div className="text-center flex items-end justify-center">終了</div>
                <div className="text-center flex items-end justify-center">帰宅</div>
                <div className="text-center flex items-end justify-center">送り場所</div>
                <div className="text-center flex items-end justify-center">件数</div>
              </div>
              
              {/* データ行（スクロール可能） */}
              <div className="space-y-1 max-h-[600px] overflow-y-auto">
                {/* サンプルデータ */}
                {[
                  { id: "1", luggage: "有", hostessName: "みぽりん", deliveryDriver: "田中", endTime: "22:15", homeTime: "23:30", deliveryLocation: "成田空港", count: 1 },
                  { id: "2", luggage: "無", hostessName: "さとか", deliveryDriver: "佐藤", endTime: "22:45", homeTime: "23:45", deliveryLocation: "羽田空港", count: 2 },
                  { id: "3", luggage: "有", hostessName: "せり", deliveryDriver: "山田", endTime: "23:00", homeTime: "24:15", deliveryLocation: "成田空港", count: 1 },
                  { id: "4", luggage: "無", hostessName: "みか", deliveryDriver: "鈴木", endTime: "23:30", homeTime: "24:30", deliveryLocation: "上野駅", count: 3 },
                  { id: "5", luggage: "有", hostessName: "らん", deliveryDriver: "高橋", endTime: "24:00", homeTime: "25:00", deliveryLocation: "羽田空港", count: 1 }
                ].map((delivery) => (
                  <div 
                    key={delivery.id} 
                    className="grid gap-1 p-1 rounded cursor-pointer hover:bg-gray-100 text-[8px] bg-purple-50"
                    style={{gridTemplateColumns: '0.5fr 1fr 1fr 0.7fr 0.7fr 1fr 0.5fr'}}
                  >
                    <div className="text-center">
                      <span className={`px-1 py-0.5 rounded text-[8px] ${delivery.luggage === '有' ? 'bg-orange-100 text-orange-800' : 'bg-gray-100 text-gray-800'}`}>
                        {delivery.luggage}
                      </span>
                    </div>
                    <div className="text-center font-semibold text-pink-600">
                      {delivery.hostessName}
                    </div>
                    <div className="text-center text-blue-600">
                      {delivery.deliveryDriver}
                    </div>
                    <div className="text-center font-bold text-red-600">
                      {delivery.endTime}
                    </div>
                    <div className="text-center font-bold text-purple-600">
                      {delivery.homeTime}
                    </div>
                    <div className="text-center text-gray-600">
                      {delivery.deliveryLocation}
                    </div>
                    <div className="text-center font-bold text-green-600">
                      {delivery.count}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

    </div>
  );
}

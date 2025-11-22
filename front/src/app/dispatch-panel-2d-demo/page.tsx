'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Pen, Package, ArrowLeft } from 'lucide-react';
import { Card, CardHeader } from "@/components/ui/card";
import { formatDate } from 'date-fns';
import {
  scheduledHostessSampleData,
  undecidedDriverReservationSampleData,
  hostessTransportSampleData,
  returningHostessSampleData,
  scheduleItemSampleData,
  driverDispatchPanelSampleData,
  staffScheduleSampleData,
  outDriverUndecidedSampleData,
  completedListSampleData,
  officeWaitingSampleData,
  shootingSampleData,
  memoItemSampleData,
  walkingDispatchSampleData,
} from '@/data/newRt2SampleData';
import {
  ScheduledHostess,
  UndecidedDriverReservation,
  HostessTransport,
  ReturningHostess,
  ScheduleItem,
  DriverDispatchPanel,
  StaffSchedule,
  OutDriverUndecided,
  CompletedList,
  OfficeWaiting,
  Shooting,
  MemoItem,
  WalkingDispatch,
} from '@/types/new-rt2';

export default function DispatchPanel2DDemo() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="w-[2064px] h-[1280px] relative overflow-hidden">
      {/* 戻るボタン */}
      <div className="absolute left-4 top-4 z-10">
        <Button 
          variant="outline" 
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          ダッシュボードに戻る
        </Button>
      </div>
      
      {/* ヘッダー */}
      <div className="absolute left-4 top-[60px] right-4 z-10">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold">配車パネル2D</h1>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-2">
              <div className="text-lg font-mono bg-gray-500 text-white px-3 py-1 rounded">
                {formatDate(currentTime, 'yyyy/MM/dd(EEE)')}
              </div>
              <div className="text-lg font-mono bg-gray-500 text-white px-3 py-1 rounded">
                {formatTime(currentTime)}
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>
  
      {/* スタッフ予定リスト */}
      <div className="w-80 h-5 left-[5px] top-[793px] absolute bg-lime-200" />
      <div className="w-28 left-[121px] top-[795px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">スタッフ予定リスト</div>
      <div className="w-80 h-96 left-[5px] top-[815px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto relative">
        {staffScheduleSampleData.map((schedule: StaffSchedule, index: number) => {
          const topPosition = index * 36;
          return (
            <div key={schedule.id} className="w-80 h-8 left-0 absolute" style={{ top: `${topPosition}px` }}>
              <div className={`w-80 h-8 left-0 top-0 absolute ${schedule.isHighlighted ? 'bg-lime-200' : 'bg-white'}`} />
              <div className="w-80 h-8 left-0 top-0 absolute justify-center text-black text-xs font-normal font-['Inter']">
                {schedule.driverName}→{schedule.destination}<br />{schedule.note}
              </div>
            </div>
          );
        })}
      </div>

      {/* INドラ未定予約リスト */}
      <div className="w-10 h-4 left-[722px] top-[248px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">オプション</div>
      <div className="w-10 h-4 left-[706px] top-[255px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">カード</div>
      <div className="w-10 h-4 left-[690px] top-[255px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">着TEL</div>
      <div className="w-10 h-4 left-[674px] top-[255px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">待合せ</div>
      <div className="w-10 h-4 left-[658px] top-[255px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">領収書</div>
      <div className="w-10 left-[632px] top-[265px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">時間計</div>
      <div className="w-8 left-[425px] top-[265px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">迎え場所</div>
      <div className="w-[42px] left-[348px] top-[265px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">出勤</div>
      <div className="w-24 left-[488px] top-[265px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">ホステス名</div>
      <div className="w-32 h-5 left-[499px] top-[245px] absolute bg-lime-200" />
      <div className="w-32 left-[502px] top-[247px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">INドラ未定予約リスト</div>
      <div className="w-[404px] h-[600px] left-[348px] top-[278px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
        {undecidedDriverReservationSampleData.map((reservation: UndecidedDriverReservation, index: number) => {
          const topPosition = index * 22;
          return (
            <div key={reservation.id} className="w-[404px] h-5 left-0 absolute" style={{ top: `${topPosition}px` }}>
              {reservation.hasOption5 && (
                <div className="w-4 h-5 left-[388px] top-0 absolute border border-rose-300/60" />
              )}
              {reservation.hasOption4 && (
                <div className="w-4 h-5 left-[372px] top-0 absolute border border-indigo-200/60" />
              )}
              {reservation.hasOption3 && (
                <div className="w-4 h-5 left-[356px] top-0 absolute border border-rose-300/60" />
              )}
              {reservation.hasOption2 && (
                <div className="w-4 h-5 left-[340px] top-0 absolute border border-indigo-200/60" />
              )}
              {reservation.hasOption1 && (
                <div className="w-4 h-5 left-[324px] top-0 absolute border border-rose-300/60" />
              )}
              <div className="w-10 h-5 left-[284px] top-0 absolute border border-indigo-200/60" />
              <div className="w-3 left-[310px] top-[2px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">分</div>
              <div className="w-5 left-[288px] top-[2px] absolute text-right justify-end text-black text-xs font-normal font-['Inter']">{reservation.timeTotal}</div>
              <div className="w-12 h-5 left-[236px] top-0 absolute border border-neutral-300" />
              <div className="w-10 left-[232px] top-[2px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">{reservation.sColumn}</div>
              {reservation.isConfirmed && (
                <>
                  <div className="w-[20px] h-5 left-[40px] top-0 absolute bg-purple-300 border border-neutral-300" />
                  <div className="w-3 left-[44px] top-[2px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">確</div>
                </>
              )}
              <div className="w-24 h-5 left-[140px] top-0 absolute bg-yellow-200 border border-rose-300/60" />
              <div className="w-20 left-[147px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{reservation.area} {reservation.hostessName}</div>
              <div className="w-16 h-5 left-[60px] top-0 absolute border border-indigo-200/60" />
              <div className="w-14 left-[63px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{reservation.pickupLocation}</div>
              <div className="w-4 h-[20px] left-[124px] top-0 absolute bg-purple-300 border border-neutral-300"/>
              <div className="w-10 h-5 left-0 top-0 absolute bg-purple-300" />
              <div className="w-9 left-[3px] top-[2px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">{reservation.departureTime}</div>
            </div>
          );
        })}
      </div>
      {/* メモ・引継事項　ドラ休憩 */}
      <div className="w-[416px] h-5 left-[348px] top-[892px] absolute bg-fuchsia-300" />
      <div className="w-36 left-[500px] top-[894px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">メモ・引継事項　ドラ休憩</div>
      <div className="w-[416px] h-[384px] left-[348px] top-[911px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
        {memoItemSampleData.map((memo: MemoItem, index: number) => {
          const topPosition = index === 0 ? 3 : index === 1 ? 39 : index === 2 ? 75 : index === 3 ? 111 : index === 4 ? 147 : index === 5 ? 183 : index === 6 ? 219 : index === 7 ? 255 : index === 8 ? 291 : 327;
          return (
            <div key={memo.id} className="w-[416px] h-8 left-0 absolute" style={{ top: `${topPosition}px` }}>
              
              <div className="w-[416px] h-8 left-0 top-0 absolute bg-zinc-300" />
              <button
                type="button"
                onClick={() => {
                  // TODO: 編集機能を実装
                }}
                className="size-6 p-1 left-[384px] top-[2px] absolute bg-white rounded-[3px] inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden hover:bg-gray-100 cursor-pointer transition-colors"
                aria-label="編集"
              >
                <Pen className="w-4 h-4 text-black" />
              </button>
              <div className="w-[416px] h-8 left-0 top-0 absolute justify-center text-black text-xs font-normal font-['Inter']">
                {memo.content.split('\n').map((line, i) => (
                  <React.Fragment key={i}>
                    {line}
                    {i < memo.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {/* 出勤予定ホステス */}
      <div className="w-24 h-5 left-[124px] top-[245px] absolute bg-cyan-200" />
      <div className="w-24 left-[126px] top-[247px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">出勤予定ホステス</div>
      <div className="w-[334px] h-[501px] left-[4px] top-[278px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
        {scheduledHostessSampleData.map((hostess: ScheduledHostess, index: number) => {
          const topPosition = index * 22;
          return (
            <div key={hostess.id} className="w-[333px] h-5 left-[1px] absolute" style={{ top: `${topPosition}px` }}>
              
              <div className="w-[194px] h-5 left-[138px] top-0 absolute bg-zinc-300" />
              <div className="w-4 h-5 left-[122px] top-0 absolute bg-zinc-400" />
              <div className="w-[70px] h-5 left-[10px] top-0 absolute bg-yellow-200" />
              <div className="w-2.5 h-5 left-0 top-0 absolute bg-zinc-300" />
              <div className="w-9 left-[293px] top-[2px] absolute text-center justify-end text-pink-500 text-xs font-normal font-['Inter']">{hostess.endTime}</div>
              <div className="w-9 left-[251px] top-[2px] absolute text-center justify-end text-orange-500 text-xs font-normal font-['Inter']">{hostess.startTime}</div>
              <div className="w-20 left-[185px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{hostess.location}</div>
              <div className="w-9 left-[143px] top-[2px] absolute text-center justify-end text-lime-500 text-xs font-normal font-['Inter']">{hostess.arrivalTime}</div>
              <div className="w-3 left-[125px] top-[2px] absolute text-center justify-end text-white text-xs font-normal font-['Inter']">{hostess.count}</div>
              <div className="w-9 left-[83px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{hostess.driverName}</div>
              <div className="w-12 left-[29px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{hostess.hostessName}</div>
              <div className="left-[12px] top-[2px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">{hostess.area}</div>
              <div className="w-3.5 h-1.5 left-[8px] top-[4px] absolute origin-top-left rotate-90 bg-rose-300/60" />
            </div>
          );
        })}
        <div className="w-[334px] h-5 left-[1px] top-[280px] absolute">
          
        </div>
      </div>

      {/* OUTドラ未定予約リスト */}
      <div className="w-40 h-5 left-[984px] top-[245px] absolute bg-lime-200" />
      <div className="w-40 left-[987px] top-[247px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">OUTドラ未定・接客中リスト</div>
      <div className="w-4 left-[308px] top-[265px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">帰宅</div>
      <div className="w-4 left-[266px] top-[265px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">終了</div>
      <div className="w-8 left-[204px] top-[265px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">迎え場所</div>
      <div className="w-4 left-[158px] top-[265px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">出勤</div>
      <div className="w-4 left-[128px] top-[265px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">決定</div>
      <div className="w-8 left-[90px] top-[265px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">迎えドラ</div>
      <div className="w-10 left-[38px] top-[265px] absolute justify-end text-black text-[8px] font-normal font-['Inter']">ホステス名</div>
      <div className="w-10 h-4 left-[1348px] top-[248px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">オプション</div>
      <div className="w-10 h-4 left-[1332px] top-[255px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">カード</div>
      <div className="w-10 h-4 left-[1316px] top-[255px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">着TEL</div>
      <div className="w-10 h-4 left-[1300px] top-[255px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">待合せ</div>
      <div className="w-10 h-4 left-[1284px] top-[255px] absolute text-center justify-center text-black text-[8px] font-normal font-['Inter'] rotate-90">領収書</div>
      <div className="w-[646px] h-[950px] left-[774px] top-[278px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
        {outDriverUndecidedSampleData.map((item: OutDriverUndecided, index: number) => (
          <div key={item.id} className="w-[646px] h-5 left-0 absolute" style={{ top: `${index * 22}px` }}>
          <div className={`w-10 h-5 px-[3px] pt-0.5 pb-[3px] left-0 top-0 absolute ${item.status === 'start' ? 'bg-cyan-100' : 'bg-rose-500'} inline-flex justify-center items-center gap-2.5`}>
            <div className={`justify-center text-xs font-normal font-['Inter'] ${item.status === 'start' ? 'text-black' : 'text-white'}`}>
              {item.status === 'start' ? '開始' : 'HP'}
            </div>
          </div>
          <div className="w-24 h-5 left-[40px] top-0 absolute bg-yellow-200 border border-rose-300/60" />
          <div className="w-20 left-[44px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{item.hostessName}</div>
          <div className="w-28 h-5 left-[256px] top-0 absolute border border-rose-300/60" />
          <div className="w-28 left-[258px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{item.destination}</div>
          <div className="w-14 h-5 left-[388px] top-0 absolute border border-rose-300/60" />
          <div className="w-12 h-3.5 left-[392px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{item.station}</div>
          {item.option1 && (
            <div className="w-10 h-5 left-[444px] top-0 absolute bg-yellow-200 border border-rose-300/60" />
          )}
          {item.option1 && (
            <div className="w-9 left-[446px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{item.option1}</div>
          )}
          {item.option2 && (
            <div className="w-10 h-5 left-[484px] top-0 absolute bg-yellow-200 border border-indigo-200/60" />
          )}
          {item.option2 && (
            <div className="w-9 left-[486px] top-[2px] absolute justify-end text-black text-xs font-normal font-['Inter']">{item.option2}</div>
          )}
          <div className="w-10 h-5 left-[216px] top-0 absolute border border-indigo-200/60" />
          <div className="w-9 left-[218px] top-[2px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">{item.arrivalTime}</div>
          <div className="w-10 h-5 left-[176px] top-0 absolute border border-rose-300/60" />
          <div className="w-9 left-[178px] top-[2px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">{item.pickupTime}</div>
          <div className="w-10 h-5 left-[136px] top-0 absolute border border-indigo-200/60" />
          <div className="w-3 left-[162px] top-[2px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">分</div>
          <div className="w-5 left-[140px] top-[2px] absolute text-right justify-end text-black text-xs font-normal font-['Inter']">{item.timeTotal}</div>
          {item.hasOptions.map((hasOption, optIndex) => {
            const optionPositions = [524, 540, 556, 572, 588];
            const relativePosition = optionPositions[optIndex];
            return hasOption ? (
              <div key={optIndex} className={`w-4 h-5 absolute border ${optIndex % 2 === 0 ? 'border-rose-300/60' : 'border-indigo-200/60'}`} style={{ left: `${relativePosition}px`, top: '0px' }} />
            ) : <div key={optIndex} className="w-4 h-5 z-10 absolute text-center bg-rose-100 justify-center text-black text-xs font-normal font-['Inter']" style={{ left: `${relativePosition}px`, top: '0px' }}>あ</div>;
          })}
          <div className="size-5 absolute bg-purple-300" style={{ left: '368px', top: '0px' }} />
          </div>
        ))}
      </div>

      {/* 終了リスト */}
      <div className="w-[342px] h-5 left-[1431px] top-[245px] absolute bg-fuchsia-300" />
      <div className="w-[342px] left-[1431px] top-[247px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">終了リスト</div>
      <div className="w-[342px] h-[66px] left-[1431px] top-[278px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
        {completedListSampleData.map((item: CompletedList, index: number) => {
        const topPosition = index * 22;
        return (
          <React.Fragment key={item.id}>
            {item.option1 && (
              <>
                <div className="w-[54px] h-5 absolute bg-yellow-200 border border-indigo-200/60" style={{ left: 288, top: topPosition }} />
                <div className="w-12 absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ left: 290, top: topPosition + 2 }}>{item.option1}</div>
              </>
            )}
            <div className="w-24 h-5 absolute bg-yellow-200 border border-rose-300/60" style={{ left: 0, top: topPosition }} />
            <div className="w-20 absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ left: 2, top: topPosition + 2 }}>{item.hostessName}</div>
            <div className="w-10 h-5 absolute border border-indigo-200/60" style={{ left: 136, top: topPosition }} />
            <div className="w-9 absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ left: 138, top: topPosition + 2 }}>{item.arrivalTime}</div>
            <div className="w-10 h-5 absolute border border-rose-300/60" style={{ left: 96, top: topPosition }} />
            <div className="w-9 absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ left: 98, top: topPosition + 2 }}>{item.pickupTime}</div>
            <div className="w-28 h-5 absolute border border-rose-300/60" style={{ left: 176, top: topPosition }} />
            <div className="w-28 absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ left: 179, top: topPosition + 2 }}>{item.destination}</div>
          </React.Fragment>
        );
        })}
      </div>
      
      <div className="w-40 h-5 left-[1605px] top-[732px] absolute bg-yellow-200" />
      <div className="w-40 h-5 left-[1431px] top-[913px] absolute bg-yellow-200" />
      
      <div className="w-40 left-[1431px] top-[915px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">南IC待機　ドライバー</div>
      <div className="w-40 left-[1605px] top-[734px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">精算告知済　ドライバー</div>
      

      {/* 南IC事務所　待機 */}
      <div className="w-[166px] h-5 left-[1431px] top-[354px] absolute bg-cyan-100" />
      <div className="w-24 left-[1466px] top-[356px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">南IC事務所　待機</div>
      <div className="w-[166px] h-[520px] left-[1431px] top-[377px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
        {officeWaitingSampleData.map((item: OfficeWaiting, index: number) => {
          const topPosition = index * 22;
          return (
            <React.Fragment key={item.id}>
              <div className="w-[18px] h-5 left-[148px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-[18px] h-5 left-[130px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-[18px] h-5 left-[112px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-[70px] h-5 left-0 absolute bg-yellow-200 border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-16 left-[3px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName}</div>
              <div className="w-[42px] h-5 left-[70px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-9 left-[73px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.departureTime}</div>
            </React.Fragment>
          );
        })}
      </div>
      
      {/* FGCS　他撮影中 */}
      <div className="w-[166px] h-5 left-[1605px] top-[354px] absolute bg-fuchsia-300" />
      <div className="w-[166px] left-[1605px] top-[356px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">FGCS　他撮影中</div>
      <div className="w-[166px] h-[60px] left-[1605px] top-[377px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
        {shootingSampleData.map((item: Shooting, index: number) => {
          const topPosition = index * 22;
          return (
            <React.Fragment key={item.id}>
              <div className="w-[18px] h-5 left-[148px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-[18px] h-5 left-[130px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-[18px] h-5 left-[112px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-[70px] h-5 left-0 absolute bg-yellow-200 border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-16 left-[3px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName}</div>
              <div className="w-[42px] h-5 left-[70px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-9 left-[73px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.departureTime}</div>
            </React.Fragment>
          );
        })}
      </div>

      {/* 南IC徒歩派遣or仮置き */}
      <div className="w-[166px] h-5 left-[1605px] top-[453px] absolute bg-cyan-100" />
      <div className="w-[166px] h-5 left-[1605px] top-[455px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">南IC徒歩派遣or仮置き</div>
      <div className="w-[166px] h-60 left-[1605px] top-[-108px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto relative">
        {walkingDispatchSampleData.map((item: WalkingDispatch, index: number) => {
          const topPosition = index * 22;
          return (
            <React.Fragment key={item.id}>
              <div className="w-[70px] h-5 left-0 absolute bg-yellow-200 border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-16 left-[3px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName}</div>
              <div className="w-[42px] h-5 left-[70px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-9 left-[73px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.departureTime}</div>
              <div className="w-[18px] h-5 left-[112px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-[18px] h-5 left-[130px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-[18px] h-5 left-[148px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
            </React.Fragment>
          );
        })}
      </div>


      <div className="w-40 h-44 left-[1431px] top-[936px] absolute outline outline-1 outline-offset-[-1px] outline-rose-300/60 overflow-y-auto">
        <div className="w-40 h-5 left-0 top-0 absolute bg-zinc-300" />
        <div className="w-40 h-5 left-0 top-[220px] absolute bg-zinc-300" />
        <div className="w-40 h-5 left-0 top-[240px] absolute bg-zinc-300" />
        <div className="w-40 h-5 left-0 top-[260px] absolute bg-zinc-300" />
        <div className="w-40 h-5 left-0 top-[280px] absolute bg-zinc-300" />
        <div className="w-40 h-5 left-0 top-[300px] absolute bg-zinc-300" />
        <div className="w-40 h-5 left-0 top-[320px] absolute bg-zinc-300" />
        <div className="w-40 h-5 left-0 top-[340px] absolute bg-zinc-300" />
        <div className="w-40 h-5 left-0 top-[360px] absolute bg-zinc-300" />
      </div>
      <div className="w-40 h-24 left-[1605px] top-[755px] absolute outline outline-1 outline-offset-[-1px] outline-rose-300/60 overflow-y-auto">
        <div className="w-40 h-5 left-0 top-0 absolute bg-zinc-300" />
        <div className="w-40 h-5 left-0 top-[220px] absolute bg-zinc-300" />
        <div className="w-40 h-5 left-0 top-[240px] absolute bg-zinc-300" />
        <div className="w-40 h-5 left-0 top-[260px] absolute bg-zinc-300" />
        <div className="w-40 h-5 left-0 top-[280px] absolute bg-zinc-300" />
      </div>


      {/* 帰宅ホステス */}
      <div className="w-60 h-5 left-[1783px] top-[245px] absolute bg-yellow-200" />
      <div className="w-32 left-[1807px] top-[247px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">ホステス送り・帰宅</div>
      <div className="w-60 h-5 left-[1783px] top-[748px] absolute bg-cyan-100" />
      <div className="w-60 left-[1783px] top-[751px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">帰宅ホステス</div>
      <div className="w-60 h-5 left-[1783px] top-[772px] absolute bg-yellow-200" />
      <div className="w-60 left-[1783px] top-[774px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">自宅or寮　待機</div>
      <div className="w-60 h-14 left-[1783px] top-[795px] absolute outline outline-1 outline-offset-[-1px] outline-rose-300/60 overflow-y-auto">
        {returningHostessSampleData.map((item: ReturningHostess, index: number) => {
          const topPosition = index * 22;
          return (
            <div key={item.id} className="w-60 h-5 left-0 absolute bg-zinc-300" style={{ top: `${topPosition}px` }}>
              <div className="w-60 h-5 left-0 top-0 absolute justify-center text-black text-xs font-normal font-['Inter']">
                {item.hostessName} - {item.returnTime} - {item.location}
              </div>
            </div>
          );
        })}
      </div>

      {/* ホステス送り・帰宅 */}
      <div className="w-4 left-[1753px] top-[266px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">荷物</div>
      <div className="w-4 left-[1838px] top-[266px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">終了</div>
      <div className="w-4 left-[1880px] top-[266px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">帰宅</div>
      <div className="w-4 left-[1977px] top-[266px] absolute text-center justify-end text-black text-[8px] font-normal font-['Inter']">件数</div>
      <div className="w-10 left-[1778px] top-[266px] absolute justify-end text-black text-[8px] font-normal font-['Inter']">ホステス名</div>
      <div className="w-8 left-[1926px] top-[266px] absolute justify-end text-black text-[8px] font-normal font-['Inter']">送り場所</div>
      <div className="w-[243px] h-[460px] left-[1783px] top-[278px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
        {hostessTransportSampleData.map((item: HostessTransport, index: number) => {
          const topPosition = index * 22;
          return (
            <React.Fragment key={item.id}>
              <div className="w-[42px] h-5 left-[116px] absolute bg-zinc-300 border border-indigo-200/60" style={{ top: `${topPosition}px` }} />
              <div className="w-9 left-[119px] absolute text-center justify-end text-pink-500 text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.returnTime}</div>
              <div className="w-[42px] h-5 left-[74px] absolute bg-zinc-300 border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-9 left-[77px] absolute text-center justify-end text-orange-500 text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.departureTime}</div>
              <div className="w-[66px] h-5 left-[158px] absolute bg-zinc-300 border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-[69px] left-[161px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.destination}</div>
              <div className="w-[19px] h-5 left-[224px] absolute bg-zinc-300 border border-indigo-200/60" style={{ top: `${topPosition}px` }} />
              <div className="w-3 h-3.5 left-[227px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.count}</div>
              <div className="w-[54px] h-5 left-[20px] absolute bg-zinc-300 border border-indigo-200/60" style={{ top: `${topPosition}px` }} />
              <div className="w-12 left-[23px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName.split(' ')[1] || item.hostessName}</div>
              <div className="size-5 left-0 absolute flex items-center justify-center" style={{ top: `${topPosition}px` }}>
                <Package className={`size-3.5 ${(item.count ?? 0) === 0 ? 'text-stone-500' : 'text-red-500'}`} />
              </div>
            </React.Fragment>
          );
        })}
      </div>
      
      
      {/* 予定(打ち合わせ・撮影など) */}
      <div className="w-[400px] h-4 left-[1626px] top-[871px] absolute bg-purple-300" />
      <div className="w-[400px] left-[1626px] top-[871px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">予定(打ち合わせ・撮影など)</div>
      <div className="w-[400px] h-24 left-[1626px] top-[891px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
        {scheduleItemSampleData.map((item: ScheduleItem, index: number) => {
          const topPosition = index * 36;
          return (
            <div key={item.id} className="w-[400px] h-8 left-0 absolute" style={{ top: `${topPosition}px` }}>
              <div className="w-[400px] h-8 left-0 top-0 absolute bg-zinc-300" />
              <div className="w-[400px] h-8 left-0 top-0 absolute justify-center text-black text-xs font-normal font-['Inter']">
                {item.title}<br/>{item.description}
              </div>
              <button
                type="button"
                onClick={() => {
                  // TODO: 編集機能を実装
                }}
                className="size-6 p-1 left-[370px] top-[2px] absolute z-10 bg-white rounded-[3px] inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden hover:bg-gray-100 cursor-pointer transition-colors"
                aria-label="編集"
              >
                <Pen className="w-4 h-4 text-black" />
              </button>
            </div>
          );
        })}
      </div>

      {/* ドライバ配車パネル */}
      <div className="w-40 h-20 left-[1431px] top-[1148px] absolute bg-rose-300/60" />
      <div className="w-40 h-20 left-[1431px] top-[1148px] absolute text-center justify-center text-black text-xs font-normal font-['Inter']">ドライバ配車パネル</div>


      {/* 面接予定 */}
      <div className="w-[400px] h-3.5 left-[1626px] top-[1009px] absolute bg-rose-300/60" />
      <div className="w-[400px] left-[1626px] top-[1009px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']">面接予定</div>
      <div className="w-[400px] h-[201px] left-[1626px] top-[1028px] absolute outline outline-1 outline-offset-[-1px] outline-zinc-300 overflow-y-auto">
        {driverDispatchPanelSampleData.map((item: DriverDispatchPanel, index: number) => {
          const topPosition = index * 22;
          return (
            <React.Fragment key={item.id}>
              <div className="w-[18px] h-5 left-[78px] absolute bg-purple-300 border border-neutral-300" style={{ top: `${topPosition}px` }} />
              <div className="w-9 h-5 left-0 absolute bg-purple-300 border border-neutral-300" style={{ top: `${topPosition}px` }} />
              <div className="w-3 left-[81px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.status === 'completed' ? '済' : ''}</div>
              <div className="w-6 left-[6px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.type === 'entry' ? '入店' : ''}</div>
              <div className="w-[42px] h-5 left-[36px] absolute border border-rose-300/60" style={{ top: `${topPosition}px` }} />
              <div className="w-9 left-[39px] absolute text-center justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.time}</div>
              <div className="w-48 h-5 left-[96px] absolute bg-purple-300 border border-neutral-300" style={{ top: `${topPosition}px` }} />
              <div className="w-44 left-[99px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.location}</div>
              {item.hostessName1 && (
                <>
                  <div className="w-14 h-5 left-[288px] absolute bg-yellow-200 border border-indigo-200/60" style={{ top: `${topPosition}px` }} />
                  <div className="w-12 left-[291px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName1}</div>
                </>
              )}
              {item.hostessName2 && (
                <>
                  <div className="w-14 h-5 left-[344px] absolute bg-yellow-200 border border-indigo-200/60" style={{ top: `${topPosition}px` }} />
                  <div className="w-12 left-[347px] absolute justify-end text-black text-xs font-normal font-['Inter']" style={{ top: `${topPosition + 2}px` }}>{item.hostessName2}</div>
                </>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}


// 南IC往来派遣データ
const minamiIcDispatchData = [
  { name: "G あやら", nameBg: "bg-[#FFB3BA]", time: "20:40" },
  { name: "南くれあ", nameBg: "bg-white", time: "18:23" },
  { name: "L すず芽", nameBg: "bg-[#FFB3BA]", time: "0:52" },
  { name: "L ミリア", nameBg: "bg-white", time: "0:21" },
  { name: "南 アヤナ", nameBg: "bg-white", time: "0:48" },
  { name: "G あやら", nameBg: "bg-[#FFB3BA]", time: "20:40" },
  { name: "南くれあ", nameBg: "bg-white", time: "18:23" },
  { name: "L すず芽", nameBg: "bg-[#FFB3BA]", time: "0:52" },
  { name: "L ミリア", nameBg: "bg-white", time: "0:21" },
  { name: "南 アヤナ", nameBg: "bg-white", time: "0:48" },
  { name: "G あやら", nameBg: "bg-[#FFB3BA]", time: "20:40" },
  { name: "南くれあ", nameBg: "bg-white", time: "18:23" },
  { name: "L すず芽", nameBg: "bg-[#FFB3BA]", time: "0:52" },
  { name: "L ミリア", nameBg: "bg-white", time: "0:21" },
  { name: "南 アヤナ", nameBg: "bg-white", time: "0:48" },
];

export default function DispatchPanel2DPage() {
  const hostessList = [
    { name: "サナ", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-yellow-100", driver: "松尾", driverBgColor: "bg-orange-200", decided: true, departure: "9:00", location: "阪急桂", endTime: "16:00", returnTime: "17:30" },
    { name: "すず", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-yellow-100", driver: "主居4", driverBgColor: "bg-orange-200", decided: true, departure: "9:00", location: "竹田駅", endTime: "15:30", returnTime: "17:00" },
    { name: "セリ", badge: "L", badgeColor: "bg-red-500", bgColor: "bg-pink-200", driver: "事務", driverBgColor: "", decided: true, departure: "9:00", location: "2南ICコ", endTime: "18:00", returnTime: "19:30" },
    { name: "なごみ", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-blue-100", driver: "松尾", driverBgColor: "bg-orange-200", decided: true, departure: "9:00", location: "阪急桂", endTime: "18:30", returnTime: "20:00" },
    { name: "ゆう", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-yellow-100", driver: "主居4", driverBgColor: "bg-orange-200", decided: true, departure: "9:00", location: "竹田駅", endTime: "15:30", returnTime: "17:00" },
    { name: "るか", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-pink-100", driver: "松尾", driverBgColor: "bg-orange-200", decided: true, departure: "9:30", location: "阪急桂", endTime: "16:00", returnTime: "18:00" },
    { name: "みお", badge: "G", badgeColor: "bg-green-500", bgColor: "bg-purple-100", driver: "準備", driverBgColor: "bg-orange-200", decided: true, departure: "10:00", location: "竹田駅", endTime: "17:00", returnTime: "19:00" },
    { name: "あい", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-yellow-100", driver: "主居4", driverBgColor: "bg-orange-200", decided: true, departure: "9:00", location: "京都イコイ", endTime: "16:30", returnTime: "18:30" },
    { name: "さき", badge: "L", badgeColor: "bg-red-500", bgColor: "bg-pink-200", driver: "南和", driverBgColor: "", decided: true, departure: "9:30", location: "阪急桂", endTime: "15:00", returnTime: "17:00" },
    { name: "りな", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-blue-100", driver: "松尾", driverBgColor: "bg-orange-200", decided: true, departure: "10:00", location: "竹田駅", endTime: "18:00", returnTime: "20:00" },
    { name: "まい", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-yellow-100", driver: "主居4", driverBgColor: "bg-orange-200", decided: true, departure: "9:00", location: "阪急桂", endTime: "16:00", returnTime: "18:00" },
    { name: "ゆき", badge: "G", badgeColor: "bg-green-500", bgColor: "bg-purple-100", driver: "準備", driverBgColor: "bg-orange-200", decided: true, departure: "9:30", location: "2南ICコ", endTime: "17:30", returnTime: "19:30" },
    { name: "かな", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-pink-100", driver: "松尾", driverBgColor: "bg-orange-200", decided: true, departure: "10:00", location: "竹田駅", endTime: "15:30", returnTime: "17:30" },
    { name: "えり", badge: "L", badgeColor: "bg-red-500", bgColor: "bg-pink-200", driver: "事務", driverBgColor: "", decided: true, departure: "9:00", location: "京都イコイ", endTime: "18:30", returnTime: "20:30" },
    { name: "のあ", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-blue-100", driver: "主居4", driverBgColor: "bg-orange-200", decided: true, departure: "9:30", location: "阪急桂", endTime: "16:30", returnTime: "18:30" },
    { name: "ひな", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-yellow-100", driver: "松尾", driverBgColor: "bg-orange-200", decided: true, departure: "9:00", location: "竹田駅", endTime: "16:00", returnTime: "17:30" },
    { name: "もえ", badge: "G", badgeColor: "bg-green-500", bgColor: "bg-purple-100", driver: "主居4", driverBgColor: "bg-orange-200", decided: true, departure: "9:30", location: "阪急桂", endTime: "15:30", returnTime: "17:00" },
    { name: "ちか", badge: "L", badgeColor: "bg-red-500", bgColor: "bg-pink-200", driver: "事務", driverBgColor: "", decided: true, departure: "10:00", location: "2南ICコ", endTime: "18:00", returnTime: "19:30" },
    { name: "れい", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-blue-100", driver: "松尾", driverBgColor: "bg-orange-200", decided: true, departure: "9:00", location: "京都イコイ", endTime: "18:30", returnTime: "20:00" },
    { name: "あや", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-yellow-100", driver: "主居4", driverBgColor: "bg-orange-200", decided: true, departure: "9:30", location: "竹田駅", endTime: "15:30", returnTime: "17:00" },
    { name: "ゆり", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-pink-100", driver: "松尾", driverBgColor: "bg-orange-200", decided: true, departure: "10:00", location: "阪急桂", endTime: "16:00", returnTime: "18:00" },
    { name: "ここ", badge: "G", badgeColor: "bg-green-500", bgColor: "bg-purple-100", driver: "準備", driverBgColor: "bg-orange-200", decided: true, departure: "9:00", location: "竹田駅", endTime: "17:00", returnTime: "19:00" },
    { name: "みく", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-yellow-100", driver: "主居4", driverBgColor: "bg-orange-200", decided: true, departure: "9:30", location: "京都イコイ", endTime: "16:30", returnTime: "18:30" },
    { name: "りお", badge: "L", badgeColor: "bg-red-500", bgColor: "bg-pink-200", driver: "南和", driverBgColor: "", decided: true, departure: "10:00", location: "阪急桂", endTime: "15:00", returnTime: "17:00" },
    { name: "はる", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-blue-100", driver: "松尾", driverBgColor: "bg-orange-200", decided: true, departure: "9:00", location: "竹田駅", endTime: "18:00", returnTime: "20:00" },
    { name: "みゆ", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-yellow-100", driver: "主居4", driverBgColor: "bg-orange-200", decided: true, departure: "9:30", location: "阪急桂", endTime: "16:00", returnTime: "18:00" },
    { name: "ゆな", badge: "G", badgeColor: "bg-green-500", bgColor: "bg-purple-100", driver: "準備", driverBgColor: "bg-orange-200", decided: true, departure: "10:00", location: "2南ICコ", endTime: "17:30", returnTime: "19:30" },
    { name: "さや", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-pink-100", driver: "松尾", driverBgColor: "bg-orange-200", decided: true, departure: "9:00", location: "竹田駅", endTime: "15:30", returnTime: "17:30" },
    { name: "れな", badge: "L", badgeColor: "bg-red-500", bgColor: "bg-pink-200", driver: "事務", driverBgColor: "", decided: true, departure: "9:30", location: "京都イコイ", endTime: "18:30", returnTime: "20:30" },
    { name: "あん", badge: "南", badgeColor: "bg-blue-400", bgColor: "bg-blue-100", driver: "主居4", driverBgColor: "bg-orange-200", decided: true, departure: "10:00", location: "阪急桂", endTime: "16:30", returnTime: "18:30" },
  ];

  const outDispatchList = [
    { status: "開始", statusBg: "bg-[#E0E0E0]", source: "HP", sourceBg: "bg-[#EC407A]", hostess: "南 真麻ー", hostessBg: "bg-[#E1BEE7]", timeType: "S", duration: "180分", startTime: "21:58", endTime: "0:58", hotel: "ハードンホテル片岸野", location: "島丸御池", hasD: false, dLocation: "", inDriver: "建材１", inDriverBg: "bg-[#FFF9C4]", outDriver: "決済", outDriverBg: "bg-white" },
    { status: "開始", statusBg: "bg-[#E0E0E0]", source: "HP", sourceBg: "bg-[#EC407A]", hostess: "南 すずな", hostessBg: "bg-[#E1BEE7]", timeType: "RHS", duration: "60分", startTime: "0:06", endTime: "1:06", hotel: "ファインガーデン仙山", location: "南IC", hasD: false, dLocation: "", inDriver: "ホテへ", inDriverBg: "bg-[#FFF9C4]", outDriver: "ホテへ", outDriverBg: "bg-[#FFF9C4]" },
    { status: "開始", statusBg: "bg-[#E0E0E0]", source: "HP", sourceBg: "bg-[#EC407A]", hostess: "南 りの", hostessBg: "bg-[#E1BEE7]", timeType: "N", duration: "60分", startTime: "0:37", endTime: "1:37", hotel: "ラジィン(芦かけ有", location: "", hasD: true, dLocation: "東山安井", inDriver: "須賀", inDriverBg: "bg-[#FFF9C4]", outDriver: "決済", outDriverBg: "bg-white" },
    { status: "開始", statusBg: "bg-[#E0E0E0]", source: "HP", sourceBg: "bg-[#EC407A]", hostess: "南 たれま", hostessBg: "bg-[#E1BEE7]", timeType: "S", duration: "60分", startTime: "0:50", endTime: "1:50", hotel: "マイスクラス(芦掛け", location: "南IC", hasD: false, dLocation: "", inDriver: "", inDriverBg: "bg-white", outDriver: "八階４", outDriverBg: "bg-[#FFF9C4]" },
    { status: "開始", statusBg: "bg-[#E0E0E0]", source: "HP", sourceBg: "bg-[#EC407A]", hostess: "南 アヤナ", hostessBg: "bg-[#E1BEE7]", timeType: "S", duration: "120分", startTime: "0:46", endTime: "2:46", hotel: "グランシー八田屋番", location: "", hasD: true, dLocation: "南IC", inDriver: "", inDriverBg: "bg-white", outDriver: "八階４", outDriverBg: "bg-[#FFF9C4]" },
    { status: "開始", statusBg: "bg-[#E0E0E0]", source: "HP", sourceBg: "bg-[#EC407A]", hostess: "南 真麻ー", hostessBg: "bg-[#E1BEE7]", timeType: "S", duration: "180分", startTime: "21:58", endTime: "0:58", hotel: "ハードンホテル片岸野", location: "島丸御池", hasD: false, dLocation: "", inDriver: "建材１", inDriverBg: "bg-[#FFF9C4]", outDriver: "決済", outDriverBg: "bg-white" },
    { status: "開始", statusBg: "bg-[#E0E0E0]", source: "HP", sourceBg: "bg-[#EC407A]", hostess: "南 すずな", hostessBg: "bg-[#E1BEE7]", timeType: "RHS", duration: "60分", startTime: "0:06", endTime: "1:06", hotel: "ファインガーデン仙山", location: "南IC", hasD: false, dLocation: "", inDriver: "ホテへ", inDriverBg: "bg-[#FFF9C4]", outDriver: "ホテへ", outDriverBg: "bg-[#FFF9C4]" },
    { status: "開始", statusBg: "bg-[#E0E0E0]", source: "HP", sourceBg: "bg-[#EC407A]", hostess: "南 りの", hostessBg: "bg-[#E1BEE7]", timeType: "N", duration: "60分", startTime: "0:37", endTime: "1:37", hotel: "ラジィン(芦かけ有", location: "", hasD: true, dLocation: "東山安井", inDriver: "須賀", inDriverBg: "bg-[#FFF9C4]", outDriver: "決済", outDriverBg: "bg-white" },
    { status: "開始", statusBg: "bg-[#E0E0E0]", source: "HP", sourceBg: "bg-[#EC407A]", hostess: "南 たれま", hostessBg: "bg-[#E1BEE7]", timeType: "S", duration: "60分", startTime: "0:50", endTime: "1:50", hotel: "マイスクラス(芦掛け", location: "南IC", hasD: false, dLocation: "", inDriver: "", inDriverBg: "bg-white", outDriver: "八階４", outDriverBg: "bg-[#FFF9C4]" },
    { status: "開始", statusBg: "bg-[#E0E0E0]", source: "HP", sourceBg: "bg-[#EC407A]", hostess: "南 アヤナ", hostessBg: "bg-[#E1BEE7]", timeType: "S", duration: "120分", startTime: "0:46", endTime: "2:46", hotel: "グランシー八田屋番", location: "", hasD: true, dLocation: "南IC", inDriver: "", inDriverBg: "bg-white", outDriver: "八階４", outDriverBg: "bg-[#FFF9C4]" },
  ];

  const finishedList = [
    { hostess: "南 うらら", hostessBg: "bg-blue-200", endTime1: "0:55", endTime2: "0:55", endTime2Bg: "bg-blue-500", location: "グランドファイン番号のみ", outDriver: "ホテへル", outDriverBg: "bg-white" },
    { hostess: "南 あやね", hostessBg: "bg-purple-200", endTime1: "0:51", endTime2: "0:52", endTime2Bg: "bg-white", location: "ラフイン(声かけ有り", outDriver: "須賀 5", outDriverBg: "bg-yellow-200" },
    { hostess: "南 ミリア", hostessBg: "bg-blue-200", endTime1: "0:40", endTime2: "0:43", endTime2Bg: "bg-blue-500", location: "グランヴィア京都割きTel", outDriver: "森 下 光", outDriverBg: "bg-yellow-200" },
    { hostess: "南 うらら", hostessBg: "bg-blue-200", endTime1: "0:55", endTime2: "0:55", endTime2Bg: "bg-blue-500", location: "グランドファイン番号のみ", outDriver: "ホテへル", outDriverBg: "bg-white" },
    { hostess: "南 あやね", hostessBg: "bg-purple-200", endTime1: "0:51", endTime2: "0:52", endTime2Bg: "bg-white", location: "ラフイン(声かけ有り", outDriver: "須賀 5", outDriverBg: "bg-yellow-200" },
    { hostess: "南 ミリア", hostessBg: "bg-blue-200", endTime1: "0:40", endTime2: "0:43", endTime2Bg: "bg-blue-500", location: "グランヴィア京都割きTel", outDriver: "森 下 光", outDriverBg: "bg-yellow-200" },
  ];

  return <div className="min-h-screen w-screen flex flex-col bg-[#fff]">

<div className="h-[60px] border-b border-[#323232] flex items-center justify-center gap-2 px-4">
  <button className="border border-[#323232] px-3 py-1 text-[12px] bg-white">日付移動</button>
  <button className="border border-[#323232] px-3 py-1 text-[12px] bg-purple-600 text-white">ドライバ情報</button>
  <button className="border border-[#323232] px-3 py-1 text-[12px] bg-green-400">新規客検索</button>
  <button className="border border-[#323232] px-3 py-1 text-[12px] bg-red-500 text-white">RT止リパネル</button>
  <button className="border border-[#323232] px-3 py-1 text-[12px] bg-orange-400">RTパネル</button>
  <button className="border border-[#323232] px-3 py-1 text-[12px] bg-white">手配表</button>
  <button className="border border-[#323232] px-3 py-1 text-[12px] bg-white">Menu</button>
  <button className="border border-[#323232] px-3 py-1 text-[12px] bg-blue-500 text-white">チャット受付</button>
  <button className="border border-[#323232] px-3 py-1 text-[12px] bg-white">取消リスト</button>
</div>

<div className="h-[calc(100vh-60px)] flex">

<div className="w-[16%] flex flex-col border-r border-[#323232]">
 <div className="flex-[8] min-h-0 border-b border-[#323232] flex flex-col">
   {/* Title with background */}
   <div className="border-b border-[#323232] text-center text-[13px]">
    <div className="bg-[#CEF1F0]  p-1 font-semibold">
     出庫予定ホステス
    </div>
   </div>

   {/* Column headers row */}
   <div className="border-b border-[#323232] flex items-center py-1 text-[10px] bg-gray-50">
     <span className="w-[23%]">ホステス名</span>
     <span className="w-[18%]">迎えドラ</span>
     <span className="w-[11%]">決定</span>
     <span className="w-[13%] text-left">出勤</span>
     <span className="w-[20%]">迎え場所</span>
     <span className="w-[13%]">終了</span>
     <span className="w-[13%]">帰宅</span>
   </div>

   {/* Reservation list */}
   <div className="flex-1 overflow-auto">
     {hostessList.map((hostess, index) => (
       <div key={index} className="flex border-b border-[#323232] text-[10px]">
         <span className={`w-[23%] ${hostess.bgColor} py-1 px-1 flex items-center gap-1`}>
           <span className={`${hostess.badgeColor} text-white px-1 text-[8px]`}>{hostess.badge}</span>
           <span>{hostess.name}</span>
         </span>
         <span className={`w-[14%] py-1 px-1 ${hostess.driverBgColor}`}>{hostess.driver}</span>
         <span className="w-[11%] py-1 px-1 bg-gray-400 text-white text-center">i</span>
         <span className="w-[13%] py-1 px-1 bg-gray-300 text-center">{hostess.departure}</span>
         <span className="w-[24%] py-1 px-1 bg-gray-300 text-center">{hostess.location}</span>
         <span className="w-[13%] py-1 px-1 bg-gray-300 text-center text-red-600">{hostess.endTime}</span>
         <span className="w-[13%] py-1 px-1 bg-gray-300 text-center text-red-600">{hostess.returnTime}</span>
       </div>
     ))}
   </div>
 </div>
  <div className="flex-[2] flex flex-col">
    {/* Title with background */}
    <div className="border-b border-[#323232] text-center text-[13px]">
      <div className="bg-[#D4E157] p-1 font-semibold flex items-center justify-center gap-1">
        <span>▲</span>
        <span>スタッフ予定リスト</span>
      </div>
    </div>

    {/* Staff schedule list */}
    <div className="flex-1 overflow-auto text-[10px]">
      <div className="border-b border-[#323232] p-1 bg-white">
        朝一→ホンマ受話す(翠川C) ドメイン支払 #当座出金予備南
      </div>
      <div className="border-b border-[#323232] p-1 bg-white">
        諸経すぅえび店に受代→工事ム諾在す文諸費者全下
      </div>
      <div className="border-b border-[#323232] p-1 bg-white">
        未、令1回な。ニストの人数出す。営、就時間で事務下
      </div>
      <div className="border-b border-[#323232] p-1 bg-white">
        寮、シト確む林下
      </div>
      <div className="border-b border-[#323232] p-1 bg-[#C8E6C9]">
        哲良、調整9.5H　2000迄。決済
      </div>
      <div className="border-b border-[#323232] p-1 bg-white">
        ※門後自宅乗余済み
      </div>
      <div className="border-b border-[#323232] p-1 bg-white">
        システムの方が宿泊自予定
      </div>
      <div className="border-b border-[#323232] p-1 bg-[#E0E0E0]">
        率一写真連走1名訪問連走4名。南
      </div>
      <div className="border-b border-[#323232] p-1 bg-white">
        ドライバー足り村井は再話干弐、決済
      </div>
      <div className="border-b border-[#323232] p-1 bg-[#C8E6C9]">
        土同、調整16H 1700迄。決済
      </div>
      <div className="border-b border-[#323232] p-1 bg-[#C8E6C9]">
        ササ村、調整9.5H 1700出勤け。決済
      </div>
    </div>
  </div>
</div>

<div className="w-[23%] flex flex-col border-r border-[#323232]">
  <div className="flex-1 border-b border-[#323232] flex flex-col min-h-0">
    {/* Title with background */}
    <div className="border-b border-[#323232] text-center text-[13px]">
      <div className="bg-[#C8E6C9] p-1 font-semibold">
        IN未定予定リスト
      </div>
    </div>

    {/* Column headers */}
    <div className="border-b border-[#323232] flex items-center py-1 text-[10px] bg-gray-50">
      <span className="w-[15%] px-1">開始</span>
      <span className="w-[15%] px-1">場所</span>
      <span className="w-[30%] px-1">ホステス名</span>
      <span className="w-[40%] px-1">時間計</span>
    </div>

    {/* Data rows */}
    <div className="flex-1 overflow-auto">
      <div className="flex border-b border-[#323232] text-[10px] items-center">
        <span className="w-[15%] px-1 py-1 bg-[#E8EAF6] text-right font-bold">2-00 確</span>
        <span className="w-[15%] px-1 py-1">南IC</span>
        <span className="w-[30%] px-1 py-1 bg-[#BBDEFB] flex items-center gap-1">
          <span className="bg-purple-600 text-white px-1 text-[8px]">D</span>
          <span>南々ほ</span>
        </span>
        <span className="w-[40%] px-1 py-1 flex items-center gap-1">
          <span>S</span>
          <span>120分</span>
        </span>
      </div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
      <div className="border-b border-[#323232] h-[30px]"></div>
    </div>
  </div>
  <div className="h-[180px] flex flex-col">
    {/* Title with background */}
    <div className="border-b border-[#323232] text-center text-[11px]">
      <div className="bg-[#E1BEE7] p-1 font-semibold">
        メモ・引継事項 ドラ体題
      </div>
    </div>

    {/* Memo list */}
    <div className="flex-1 overflow-auto text-[10px]">
      <div className="border-b border-[#323232] p-2 bg-white flex items-center justify-between">
        <span>大妻えみさん→15:45位の子約の後早くなってもも仕事取らない事。by 杉本</span>
        <span className="ml-2 border border-[#323232] px-1 text-[12px] grayscale brightness-0 rounded-sm">✏️</span>
      </div>
      <div className="border-b border-[#323232] p-2 bg-gray-200 flex items-center justify-between">
        <span>大妻まい子約討辰する</span>
        <span className="ml-2 border border-[#323232] px-1 text-[12px] grayscale brightness-0 rounded-sm">✏️</span>
      </div>
      <div className="border-b border-[#323232] p-2 bg-white flex items-center justify-between">
        <span>【9月9日ヤマモト 詩】キャンセル料回収予定</span>
        <span className="ml-2 border border-[#323232] px-1 text-[12px] grayscale brightness-0 rounded-sm">✏️</span>
      </div>
      <div className="border-b border-[#323232] p-2 bg-gray-200 flex items-center justify-between">
        <span>ミリア海峡</span>
        <span className="ml-2 border border-[#323232] px-1 text-[12px] grayscale brightness-0 rounded-sm">✏️</span>
      </div>
      <div className="border-b border-[#323232] p-2 bg-gray-200 flex items-center justify-between">
        <span>Firstナチ RC</span>
        <span className="ml-2 border border-[#323232] px-1 text-[12px] grayscale brightness-0 rounded-sm">✏️</span>
      </div>
    </div>
  </div>
</div>

<div className="w-[32%] flex flex-col border-r border-[#323232]">
  {/* Title */}
  <div className="border-b border-[#323232] text-center text-[13px]">
    <div className="bg-[#C8E6C9] p-1 font-semibold">
      OUT矢未生+複合ゼリスト
    </div>
  </div>

  {/* Header row */}
  <div className="border-b border-[#323232] flex items-center text-[11px] bg-gray-50">
    <span className="w-[5%]"></span>
    <span className="w-[3%]"></span>
    <span className="w-[10%]">ホステス名</span>
    <span className="w-[6%]"></span>
    <span className="w-[7%]">時間計</span>
    <span className="w-[6%]">開始</span>
    <span className="w-[5%]">終了</span>
    <span className="w-[17%]"></span>
    <span className="w-[10%]">場所</span>
    <span className="w-[6%]"></span>
    <span className="w-[5%]"></span>
    <span className="w-[7%]">INドラ</span>
    <span className="w-[9%]">OUTドラ</span>
    <span className="w-[2%]"></span>
  </div>

  {/* Data rows */}
  <div className="flex-1 overflow-y-auto">
    {outDispatchList.map((item, index) => (
      <div key={index} className="border-b border-[#323232] flex items-center text-[12px]">
        <span className={`w-[5%] ${item.statusBg} text-center`}>{item.status}</span>
        <span className={`w-[3%] ${item.sourceBg} text-white text-center`}>{item.source}</span>
        <span className={`w-[10%] ${item.hostessBg}`}>{item.hostess}</span>
        <span className="w-[6%] bg-white">{item.timeType}</span>
        <span className="w-[7%] bg-white">{item.duration}</span>
        <span className="w-[6%] bg-white text-center">{item.startTime}</span>
        <span className="w-[5%] bg-white text-center text-red-600 font-bold">{item.endTime}</span>
        <span className="w-[17%] bg-white overflow-hidden text-ellipsis whitespace-nowrap">{item.hotel}</span>
        {item.hasD ? (
          <span className="w-[10%] bg-white flex items-center gap-[2px]">
            <span className="bg-purple-600 text-white px-[2px] text-[8px]">D</span>
            <span className="text-[9px]">{item.dLocation}</span>
          </span>
        ) : (
          <span className="w-[10%] bg-white">{item.location}</span>
        )}
        <span className="w-[6%] bg-white"></span>
        <span className="w-[5%] bg-white text-center"></span>
        <span className={`w-[7%] ${item.inDriverBg} text-center`}>{item.inDriver}</span>
        <span className={`w-[8%] ${item.outDriverBg} text-center`}>{item.outDriver}</span>
        <span className="w-[3%] bg-white flex justify-center">
          <span className="border border-[#323232] px-1 rounded-sm grayscale brightness-0">📋</span>
        </span>
      </div>
    ))}
    {[...Array(30)].map((_, index) => (
      <div key={`empty-${index}`} className="border-b border-[#323232] h-[30px]"></div>
    ))}
  </div>
</div>

<div className="w-[29%] grid" style={{ gridTemplateColumns: '0.75fr 0.75fr 1fr', gridTemplateRows: '140px 2fr 1fr' }}>

  {/* 終了リスト */}
  <div className="border-r border-b border-[#323232] col-span-2 flex flex-col">
    {/* Title */}
    <div className="border-b border-[#323232] text-center text-[13px]">
      <div className="bg-[#FFB3BA] p-1 font-semibold">
        終了リスト
      </div>
    </div>

    {/* Header row */}
    <div className="border-b border-[#323232] flex items-center text-[10px] bg-gray-50 py-1">
      <span className="w-[25%] px-1">ホステス名</span>
      <span className="w-[20%] px-1 text-center">終了</span>
      <span className="w-[35%] px-1">場所</span>
      <span className="w-[20%] px-1 text-center">OUTドラ</span>
    </div>

    {/* Data rows */}
    <div className="flex-1 overflow-y-auto">
      {finishedList.map((item, index) => (
        <div key={index} className="border-b border-[#323232] flex items-center text-[11px]">
          <span className={`w-[25%] px-1 py-1 ${item.hostessBg}`}>{item.hostess}</span>
          <span className="w-[10%] px-1 py-1 bg-white text-center">{item.endTime1}</span>
          <span className={`w-[10%] px-1 py-1 ${item.endTime2Bg} ${item.endTime2Bg === 'bg-blue-500' ? 'text-white' : ''} text-center font-bold`}>{item.endTime2}</span>
          <span className="w-[35%] px-1 py-1 bg-white overflow-hidden whitespace-nowrap text-ellipsis">{item.location}</span>
          <span className={`w-[20%] px-1 py-1 ${item.outDriverBg} text-center`}>{item.outDriver}</span>
        </div>
      ))}
      {[...Array(20)].map((_, index) => (
        <div key={`empty-${index}`} className="border-b border-[#323232] h-[30px]"></div>
      ))}
    </div>
  </div>

  {/* Top right section spanning 2 rows */}
  <div className="border-b border-[#323232] col-span-1 row-span-2 flex flex-col">
    <div className="border-b border-[#323232] flex-[7] p-2">
      <div className="text-[11px] font-semibold mb-2">スタッフ状況</div>
      <div className="text-[10px] space-y-1 overflow-auto h-[calc(100%-24px)]">
        <div className="border-b border-gray-200 py-1">松尾: 稼働中</div>
        <div className="border-b border-gray-200 py-1">主居4: 稼働中</div>
        <div className="border-b border-gray-200 py-1">南和: 待機中</div>
        <div className="border-b border-gray-200 py-1">事務: 待機中</div>
        <div className="border-b border-gray-200 py-1">準備: 休憩中</div>
      </div>
    </div>
    <div className="flex-[3] flex flex-col min-h-0">
      <div className="border-b border-[#323232]">
        <div className="bg-[#E3F2FD] text-center py-1 text-[12px] font-semibold flex items-center justify-center gap-1">
          <span>帰宅ホステス</span>
        </div>
      </div>
      <div className="border-b border-[#323232]">
        <div className="bg-[#FFFFCC] text-center py-1 text-[12px] font-semibold flex items-center justify-center gap-1">
          <span>自宅or客 待機</span>
          <span className="text-[10px]">▼</span>
          <span className="bg-yellow-400 px-1 text-[10px]">🏠</span>
        </div>
      </div>
      <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0">
        <div className="min-w-max">
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>
        </div>
      </div>
    </div>
  </div>

  {/* Middle left section - 予定一覧 */}
  <div className="border-r border-b border-[#323232] col-span-1 row-span-2 flex flex-col">
    {/* Title */}
    <div className="border-b border-[#323232] text-center text-[12px] bg-[#BBDEFB] font-semibold py-1">
      南IC事務所 待機
    </div>

    {/* Data rows */}
    <div className="flex-1 overflow-y-auto">
      <div className="border-b border-[#323232] flex items-center text-[12px]">
        <span className="w-[45%] bg-white">南近 -inar-</span>
        <span className="w-[25%] bg-white text-center">18:07</span>
        <span className="w-[10%] bg-green-500 flex justify-center items-center text-white font-bold">↑</span>
        <span className="w-[10%] bg-white flex justify-center items-center">▼</span>
        <span className="w-[10%] bg-yellow-400 flex justify-center items-center">⇔</span>
      </div>

      <div className="border-b border-[#323232] flex items-center text-[12px]">
        <span className="w-[45%] bg-white">南 すず一</span>
        <span className="w-[25%] bg-white text-center">21:51</span>
        <span className="w-[10%] bg-green-500 flex justify-center items-center text-white font-bold">↑</span>
        <span className="w-[10%] bg-white flex justify-center items-center">▼</span>
        <span className="w-[10%] bg-yellow-400 flex justify-center items-center">⇔</span>
      </div>

      <div className="border-b border-[#323232] flex items-center text-[12px]">
        <span className="w-[45%] bg-white">S ゆりか</span>
        <span className="w-[25%] bg-white text-center">23:08</span>
        <span className="w-[10%] bg-green-500 flex justify-center items-center text-white font-bold">↑</span>
        <span className="w-[10%] bg-white flex justify-center items-center">▼</span>
        <span className="w-[10%] bg-yellow-400 flex justify-center items-center">⇔</span>
      </div>

      <div className="border-b border-[#323232] flex items-center text-[12px]">
        <span className="w-[45%] bg-white">南いず</span>
        <span className="w-[25%] bg-white text-center">23:46</span>
        <span className="w-[10%] bg-green-500 flex justify-center items-center text-white font-bold">↑</span>
        <span className="w-[10%] bg-white flex justify-center items-center">▼</span>
        <span className="w-[10%] bg-yellow-400 flex justify-center items-center">⇔</span>
      </div>

      <div className="border-b border-[#323232] flex items-center text-[12px]">
        <span className="w-[45%] bg-white">南さやか</span>
        <span className="w-[25%] bg-white text-center">0:18</span>
        <span className="w-[10%] bg-green-500 flex justify-center items-center text-white font-bold">↑</span>
        <span className="w-[10%] bg-white flex justify-center items-center">▼</span>
        <span className="w-[10%] bg-yellow-400 flex justify-center items-center">⇔</span>
      </div>

      <div className="border-b border-[#323232] flex items-center text-[12px]">
        <span className="w-[45%] bg-white">L つばさ</span>
        <span className="w-[25%] bg-white text-center">0:27</span>
        <span className="w-[10%] bg-green-500 flex justify-center items-center text-white font-bold">↑</span>
        <span className="w-[10%] bg-white flex justify-center items-center">▼</span>
        <span className="w-[10%] bg-yellow-400 flex justify-center items-center">⇔</span>
      </div>

      {[...Array(20)].map((_, index) => (
        <div key={`empty-${index}`} className="border-b border-[#323232] h-[30px]"></div>
      ))}
    </div>
  </div>

  {/* Middle right section */}
  <div className="border-r border-[#323232] col-span-1 row-span-1 flex flex-col">
    <div className="border-b border-[#323232]">
      <div className="bg-[#FFB3BA] text-center py-1 text-[11px] font-semibold border-b border-[#323232]">
        FGCS 他撮影中
      </div>
      <div className="h-[84px] overflow-x-auto overflow-y-scroll">
        <div className="min-w-max">
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>
        </div>
      </div>
    </div>
    <div className="flex-[3] flex flex-col min-h-0 border-b border-[#323232]">
      <div className="bg-[#B3D9FF] border-b border-[#323232] text-center py-1 text-[12px] font-semibold">
        南IC往来派遣or管直き
      </div>
      <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0">
        <div className="min-w-max">
          {minamiIcDispatchData.map((item, index) => (
            <div key={index} className="flex items-center text-[12px] border-b border-[#323232] ">
              <span className={`${item.nameBg} min-w-[80px]`}>{item.name}</span>
              <span className="min-w-[60px]">{item.time}</span>
              <span className="bg-green-500 text-white px-1">↑</span>
              <span className="">▼</span>
              <span className="bg-yellow-300">⇔</span>
            </div>
          ))}
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>

        </div>
      </div>
    </div>
    <div className="border-b border-[#323232] flex-[2] flex flex-col min-h-0">
      <div className="bg-[#FFE0B2] text-center py-1 text-[11px] font-semibold border-b border-[#323232]">
        未確定
      </div>
      <div className="flex-1 overflow-x-auto overflow-y-auto min-h-0">
        <div className="min-w-max">
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>
          <div className="border-b border-[#323232] text-[12px] h-[28px]"></div>
        </div>
      </div>
    </div>
  </div>

  {/* Bottom section spanning 2 columns */}
  <div className="border-r border-[#323232] col-span-2 row-span-1 flex flex-col">
    <div className="border-b border-[#323232] flex-1 p-2">
      <div className="text-[11px] font-semibold mb-1">緊急連絡</div>
      <div className="text-[9px] overflow-auto h-[calc(100%-20px)]">
        <div className="border-b border-gray-200 py-1">16:30 - 末枝さん延長希望</div>
        <div className="border-b border-gray-200 py-1">17:00 - ドライバー交代必要</div>
      </div>
    </div>
    <div className="flex-1 p-2 bg-[#FFEBEE]">
      <div className="text-[11px] font-semibold mb-1">アラート</div>
      <div className="text-[9px] overflow-auto h-[calc(100%-20px)]">
        <div className="text-red-600 font-bold">未決済 3件</div>
        <div className="text-orange-600">ドライバー不足</div>
      </div>
    </div>
  </div>

</div>

</div>

  </div>;
}   
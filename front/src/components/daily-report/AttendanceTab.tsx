import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AttendingStaff, AttendingHostess } from '@/types/attendance';
import type { AttendingStaffItemProps, AttendingHostessItemProps, AttendanceTabProps } from '@/types/attendance-tab';

/**
 * 出勤スタッフの1行分のコンポーネント
 */
function AttendingStaffItem({ data }: AttendingStaffItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case '出勤':
        return 'bg-green-100 text-green-800';
      case '退社':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="hover:bg-gray-50 border-b border-gray-200">
      {/* 雇用形態 */}
      <td className="px-2 py-2 text-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          data.employmentType === '社員' 
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {data.employmentType}
        </span>
      </td>
      
      {/* スタッフ名 */}
      <td className="px-2 py-2 font-medium text-gray-900">{data.staffName}</td>
      
      {/* ステータス */}
      <td className="px-2 py-2 text-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.status)}`}>
          {data.status}
        </span>
      </td>
      
      {/* 数字1 */}
      <td className="px-2 py-2 text-center font-mono text-gray-600">{data.number1}</td>
      
      {/* 給与 */}
      <td className="px-2 py-2 text-right font-mono text-gray-700">
        ¥{data.salary.toLocaleString()}
      </td>
      
      {/* 回収額 */}
      <td className="px-2 py-2 text-right font-mono text-gray-700">
        ¥{data.collectionAmount.toLocaleString()}
      </td>
      
      {/* 預り金 */}
      <td className="px-2 py-2 text-right font-mono text-gray-700">
        ¥{data.depositAmount.toLocaleString()}
      </td>
      
      {/* 返金 */}
      <td className="px-2 py-2 text-right font-mono text-gray-700">
        ¥{data.refundAmount.toLocaleString()}
      </td>
      
      {/* 高速等 */}
      <td className="px-2 py-2 text-right font-mono text-gray-700">
        ¥{data.expressway.toLocaleString()}
      </td>
      
      {/* 調整額 */}
      <td className={`px-2 py-2 text-right font-mono ${data.adjustmentAmount >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
        {data.adjustmentAmount >= 0 ? '+' : ''}¥{data.adjustmentAmount.toLocaleString()}
      </td>
      
      {/* 差引精算額 */}
      <td className="px-2 py-2 text-right font-mono font-bold text-gray-900">
        ¥{data.netSettlementAmount.toLocaleString()}
      </td>
      
      {/* 数字2 */}
      <td className="px-2 py-2 text-center font-mono text-gray-600">{data.number2}</td>
      
      {/* バスタオル(青・赤・黒) */}
      <td className="px-2 py-2 text-center">
        <div className="flex justify-center gap-1">
          <span className="text-blue-600 font-mono text-xs">{data.bathTowel.blue}</span>
          <span className="text-red-600 font-mono text-xs">{data.bathTowel.red}</span>
          <span className="text-gray-800 font-mono text-xs">{data.bathTowel.black}</span>
        </div>
      </td>
      
      {/* 備品(青・赤・黒) */}
      <td className="px-2 py-2 text-center">
        <div className="flex justify-center gap-1">
          <span className="text-blue-600 font-mono text-xs">{data.equipment.blue}</span>
          <span className="text-red-600 font-mono text-xs">{data.equipment.red}</span>
          <span className="text-gray-800 font-mono text-xs">{data.equipment.black}</span>
        </div>
      </td>
      
      {/* 数字3 */}
      <td className="px-2 py-2 text-center font-mono text-gray-600">{data.number3}</td>
      
      {/* 数字4 */}
      <td className="px-2 py-2 text-center font-mono text-gray-600">{data.number4}</td>
      
      {/* 数字5 */}
      <td className="px-2 py-2 text-center font-mono text-gray-600">{data.number5}</td>
      
      {/* 管理者承認 */}
      <td className="px-2 py-2 text-center">
        <input
          type="checkbox"
          checked={data.managerApproval}
          onChange={() => {}}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-1"
        />
      </td>
    </tr>
  );
}

/**
 * 出勤ホステスの1行分のコンポーネント
 */
function AttendingHostessItem({ data }: AttendingHostessItemProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case '出勤中':
        return 'bg-green-100 text-green-800';
      case '休憩中':
        return 'bg-yellow-100 text-yellow-800';
      case '退勤':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid grid-cols-7 gap-2 text-sm py-2 border-b border-gray-200 hover:bg-gray-50">
      {/* ホステス名 */}
      <div className="font-medium text-gray-900">{data.hostessName}</div>
      
      {/* 出勤時刻 */}
      <div className="text-center font-mono">{data.startTime}</div>
      
      {/* 退勤予定時刻 */}
      <div className="text-center font-mono">{data.endTime || '-'}</div>
      
      {/* ステータス */}
      <div className="text-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(data.status)}`}>
          {data.status}
        </span>
      </div>
      
      {/* 勤務店舗 */}
      <div className="text-center text-gray-700">{data.store}</div>
      
      {/* 今日の売上 */}
      <div className="text-right font-mono text-gray-700">
        ¥{data.todaySales.toLocaleString()}
      </div>
      
      {/* 備考 */}
      <div className="text-sm text-gray-500 truncate">{data.notes || '-'}</div>
    </div>
  );
}

/**
 * タブ切り替え可能な出勤管理コンポーネント
 */
export default function AttendanceTab({ staffList, hostessList }: AttendanceTabProps) {
  const [activeTab, setActiveTab] = useState<'staff' | 'hostess'>('staff');

  return (
    <Card>
      <CardHeader className="bg-indigo-50">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-semibold text-indigo-700">出勤管理</h4>
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'staff' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('staff')}
              className={activeTab === 'staff' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
            >
              出勤スタッフ ({staffList.filter(s => s.status === '出勤').length})
            </Button>
            <Button
              variant={activeTab === 'hostess' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('hostess')}
              className={activeTab === 'hostess' ? 'bg-indigo-600 hover:bg-indigo-700' : ''}
            >
              出勤ホステス ({hostessList.filter(h => h.status === '出勤中').length})
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        {activeTab === 'staff' ? (
          <div className="space-y-2">
            {/* スクロール可能なテーブル領域 */}
            <div className="h-[500px] overflow-y-scroll border border-gray-200 rounded-lg">
              <table className="min-w-full table-fixed">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="w-20 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">雇用形態</th>
                    <th className="w-24 px-2 py-3 text-xs font-semibold text-gray-700 text-left border-b">スタッフ名</th>
                    <th className="w-16 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">ステータス</th>
                    <th className="w-12 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">数字</th>
                    <th className="w-20 px-2 py-3 text-xs font-semibold text-gray-700 text-right border-b">給与</th>
                    <th className="w-20 px-2 py-3 text-xs font-semibold text-gray-700 text-right border-b">回収額</th>
                    <th className="w-18 px-2 py-3 text-xs font-semibold text-gray-700 text-right border-b">預り金</th>
                    <th className="w-16 px-2 py-3 text-xs font-semibold text-gray-700 text-right border-b">返金</th>
                    <th className="w-16 px-2 py-3 text-xs font-semibold text-gray-700 text-right border-b">高速等</th>
                    <th className="w-18 px-2 py-3 text-xs font-semibold text-gray-700 text-right border-b">調整額</th>
                    <th className="w-20 px-2 py-3 text-xs font-semibold text-gray-700 text-right border-b">差引精算額</th>
                    <th className="w-12 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">数字</th>
                    <th className="w-20 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">バスタオル<br/><span className="text-xs text-gray-500">(青/赤/黒)</span></th>
                    <th className="w-20 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">備品<br/><span className="text-xs text-gray-500">(青/赤/黒)</span></th>
                    <th className="w-12 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">数字</th>
                    <th className="w-12 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">数字</th>
                    <th className="w-12 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">数字</th>
                    <th className="w-16 px-2 py-3 text-xs font-semibold text-gray-700 text-center border-b">管理者承認</th>
                  </tr>
                </thead>
                <tbody className="bg-white text-xs">
                  {staffList.map((staff) => (
                    <AttendingStaffItem key={staff.id} data={staff} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {/* ホステス用ヘッダー行 */}
            <div className="grid grid-cols-7 gap-2 text-sm font-semibold text-gray-700 pb-2 border-b-2 border-gray-300">
              <div className="text-left">ホステス名</div>
              <div className="text-center">出勤時刻</div>
              <div className="text-center">退勤予定</div>
              <div className="text-center">ステータス</div>
              <div className="text-center">勤務店舗</div>
              <div className="text-right">今日の売上</div>
              <div className="text-center">備考</div>
            </div>
            
            {/* スクロール可能なデータ領域 */}
            <div className="h-[500px] overflow-y-scroll">
              <div className="space-y-0">
                {hostessList.map((hostess) => (
                  <AttendingHostessItem key={hostess.id} data={hostess} />
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

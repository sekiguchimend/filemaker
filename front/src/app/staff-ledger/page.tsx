'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Plus, Download } from "lucide-react";
import type { StaffLedgerRecord } from '@/types';
import {
  employmentTypeLabels,
  jobTypeLabels,
  roleLabels,
  staffEmploymentStatusLabels,
  accessTypeLabels,
  accessStatusLabels
} from '@/types';
import { staffLedgerSampleData } from '@/data/staffLedgerSampleData';

export default function StaffLedger() {
  const router = useRouter();
  const [staffs] = useState<StaffLedgerRecord[]>(staffLedgerSampleData);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStaffs = staffs.filter(staff =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.sfid.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.accountName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    roleLabels[staff.role].toLowerCase().includes(searchQuery.toLowerCase())
  );


  const formatDateTime = (dateTimeString: string) => {
    // YYYY-MM-DD HH:MM:SS形式をYYYY/MM/DD HH:MM:SS形式に変換
    return dateTimeString.replace(/-/g, '/');
  };

  const exportToCSV = () => {
    // CSVエクスポート機能（実装例）
    const headers = [
      '通し番号', 'SFID', '氏名', '雇用区分', '職務', '役割', '在職', '調整率', '表示順',
      'アカウント名', 'アクセス権', 'アクセス権ステータス', '登録日時', '更新日時'
    ];

    const csvData = filteredStaffs.map((staff, index) => [
      index + 1,
      staff.sfid,
      staff.name,
      employmentTypeLabels[staff.employmentType],
      staff.jobTypes.map(jobType => jobTypeLabels[jobType]).join('・'),
      roleLabels[staff.role],
      staffEmploymentStatusLabels[staff.employmentStatus],
      staff.adjustmentRate,
      staff.displayOrder,
      staff.accountName,
      accessTypeLabels[staff.accessType],
      accessStatusLabels[staff.accessStatus],
      formatDateTime(staff.createdAt),
      formatDateTime(staff.updatedAt)
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `staff_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

      {/* ヘッダー */}
      <div className="px-4 mb-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">スタッフ台帳</h1>

              <div className="flex items-center gap-4">
                {/* 新規追加ボタン */}
                <Button variant="outline" size="sm" className="bg-green-100">
                  <Plus className="w-4 h-4 mr-1" />
                  新規追加
                </Button>

                {/* CSVエクスポート */}
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <Download className="w-4 h-4 mr-1" />
                  CSV出力
                </Button>

                {/* 検索 */}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="氏名・SFID・アカウント名・役職で検索"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="sm">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* メインコンテンツ */}
      <div className="px-4">
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-2 py-2 w-16">通し番号</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">SFID</th>
                    <th className="border border-gray-300 px-2 py-2 w-24">氏名</th>
                    <th className="border border-gray-300 px-2 py-2 w-16">雇用区分</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">職務</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">役割</th>
                    <th className="border border-gray-300 px-2 py-2 w-12">在職</th>
                    <th className="border border-gray-300 px-2 py-2 w-16">調整率</th>
                    <th className="border border-gray-300 px-2 py-2 w-12">表示順</th>
                    <th className="border border-gray-300 px-2 py-2 w-24">アカウント名</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">アクセス権</th>
                    <th className="border border-gray-300 px-2 py-2 w-16">ステータス</th>
                    <th className="border border-gray-300 px-2 py-2 w-32">登録日時</th>
                    <th className="border border-gray-300 px-2 py-2 w-32">更新日時</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaffs.map((staff, index) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-2 py-2 text-center font-semibold">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center font-mono">
                        {staff.sfid}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 font-semibold">
                        {staff.name}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          staff.employmentType === 'employee'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {employmentTypeLabels[staff.employmentType]}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <div className="flex flex-col gap-1">
                          {staff.jobTypes.map(jobType => (
                            <span key={jobType} className={`px-2 py-1 rounded text-xs inline-block ${
                              jobType === 'driver'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}>
                              {jobTypeLabels[jobType]}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          staff.role === 'chairman' || staff.role === 'president'
                            ? 'bg-red-100 text-red-800'
                            : staff.role.includes('manager')
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {roleLabels[staff.role]}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {staff.employmentStatus === 'active' && (
                          <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                            在職
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {staff.adjustmentRate.toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        {staff.displayOrder}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 font-mono text-sm">
                        {staff.accountName}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          staff.accessType === 'admin'
                            ? 'bg-red-100 text-red-800'
                            : staff.accessType === 'manager'
                            ? 'bg-blue-100 text-blue-800'
                            : staff.accessType === 'accounting_manager'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {accessTypeLabels[staff.accessType]}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          staff.accessStatus === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {accessStatusLabels[staff.accessStatus]}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center font-mono text-xs">
                        {formatDateTime(staff.createdAt)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center font-mono text-xs">
                        {formatDateTime(staff.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* フッター - 統計情報 */}
      <div className="p-4 mt-4">
        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <span className="font-semibold">総件数:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {filteredStaffs.length}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">社員:</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {filteredStaffs.filter(s => s.employmentType === 'employee').length}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">アルバイト:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {filteredStaffs.filter(s => s.employmentType === 'part_time').length}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">在職者:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {filteredStaffs.filter(s => s.employmentStatus === 'active').length}件
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold">アクセス権有効:</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
              {filteredStaffs.filter(s => s.accessStatus === 'active').length}件
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
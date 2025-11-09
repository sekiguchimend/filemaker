'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Plus, Download } from "lucide-react";
import type { StaffLedgerRecord } from '@/types';
import { z } from "zod";
import {
  employmentTypeLabels,
  jobTypeLabels,
  roleLabels,
  staffEmploymentStatusLabels,
  accessTypeLabels,
  accessStatusLabels
} from '@/types';

export default function StaffLedger() {
  const router = useRouter();
  const [staffs, setStaffs] = useState<StaffLedgerRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    const schema = z.object({
      id: z.string(),
      sfid: z.string(),
      lastName: z.string(),
      firstName: z.string(),
      lastNameKana: z.string().nullable().optional(),
      firstNameKana: z.string().nullable().optional(),
      employmentDate: z.string(), // YYYY-MM-DD
      retirementDate: z.string().nullable().optional(),
      employmentType: z.enum(['employee', 'part_time']),
      jobTypes: z.array(z.enum(['driver', 'office'])),
      role: z.enum(['chairman','advisor','president','general_manager','manager','admin_manager','office_manager','female_manager','office_staff','pr']),
      employmentStatus: z.enum(['active','']),
      adjustmentRate: z.number(),
      displayOrder: z.number(),
      accountName: z.string(),
      accessType: z.enum(['admin','manager','accounting_manager','staff']),
      accessStatus: z.enum(['active','inactive']),
      createdAt: z.string(),
      updatedAt: z.string()
    });
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/staff-ledger', { cache: 'no-store' });
        if (!res.ok) throw new Error(`failed: ${res.status}`);
        const json = await res.json();
        const parsed = z.array(schema).parse(json);
        setStaffs(parsed);
      } catch (e) {
        setErrorMessage('データ取得に失敗しました');
      }
    };
    fetchData();
  }, []);

  const filteredStaffs = staffs.filter(staff => {
    const fullName = `${staff.lastName}${staff.firstName}`;
    const fullNameKana = `${staff.lastNameKana ?? ''}${staff.firstNameKana ?? ''}`;
    const q = searchQuery.toLowerCase();
    return (
      fullName.toLowerCase().includes(q) ||
      fullNameKana.toLowerCase().includes(q) ||
      staff.sfid.toLowerCase().includes(q) ||
      staff.accountName.toLowerCase().includes(q) ||
      roleLabels[staff.role].toLowerCase().includes(q)
    );
  });


  const formatDateOnly = (dateTimeString: string) => {
    // 'YYYY-MM-DD HH:MM:SS' or ISO → 'YYYY/MM/DD'
    if (!dateTimeString) return '';
    const datePart = dateTimeString.split(/[ T]/)[0] ?? '';
    return datePart.replace(/-/g, '/');
  };

  const exportToCSV = () => {
    // CSVエクスポート機能（実装例）
    const headers = [
      'No', 'SFID', '氏名', '雇用区分', '職務', '役割', '在職', '調整率',
      'アカウント名', 'アクセス権', 'アクセス権ステータス', '登録日時', '更新日時'
    ];

    const csvData = filteredStaffs.map((staff, index) => [
      index + 1,
      staff.sfid,
      `${staff.lastName}${staff.firstName}`,
      employmentTypeLabels[staff.employmentType],
      staff.jobTypes.map(jobType => jobTypeLabels[jobType]).join('・'),
      roleLabels[staff.role],
      staffEmploymentStatusLabels[staff.employmentStatus],
      staff.adjustmentRate,
      staff.accountName,
      accessTypeLabels[staff.accessType],
      accessStatusLabels[staff.accessStatus],
      formatDateOnly(staff.createdAt),
      formatDateOnly(staff.updatedAt)
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

  const openStaffDetailWindow = (id: string) => {
    try {
      const url = `/staff-ledger/${id}`;
      const features = 'noopener,noreferrer,width=1280,height=900,scrollbars=yes,resizable=yes';
      window.open(url, `staffDetail_${id}`, features);
    } catch (error) {
      // UI_001: 新規ウィンドウオープン失敗（個人情報非出力）
      console.error('UI_001: failed to open staff detail window');
    }
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
              {errorMessage && (
                <span className="text-red-600 text-sm">{errorMessage}</span>
              )}

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
                    <th className="border border-gray-300 px-1 py-2 w-8">No</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">SFID</th>
                    <th className="border border-gray-300 px-2 py-2 w-24">氏名</th>
                    <th className="border border-gray-300 px-2 py-2 w-16">雇用区分</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">職務</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">役割</th>
                    <th className="border border-gray-300 px-2 py-2 w-12">在職</th>
                    <th className="border border-gray-300 px-2 py-2 w-16">調整率</th>
                    <th className="border border-gray-300 px-2 py-2 w-24">アカウント名</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">アクセス権</th>
                    <th className="border border-gray-300 px-2 py-2 w-16">ステータス</th>
                    <th className="border border-gray-300 px-2 py-2 w-32">登録日時</th>
                    <th className="border border-gray-300 px-2 py-2 w-32">更新日時</th>
                    <th className="border border-gray-300 px-2 py-2 w-20">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaffs.map((staff, index) => (
                    <tr key={staff.id} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-1 py-2 text-center font-semibold">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center font-mono">
                        {staff.sfid}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 font-semibold">
                        {staff.lastName}{staff.firstName}
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
                        {formatDateOnly(staff.createdAt)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center font-mono text-xs">
                        {formatDateOnly(staff.updatedAt)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openStaffDetailWindow(staff.id)}
                        >
                          編集
                        </Button>
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
'use client';

import React, { useMemo } from 'react';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Award } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { sampleCustomers, sampleCustomerPoints } from "@/data/customerSampleData";

type RowData = {
  id: string;
  customerNumber: string;
  indexNo: number;
  nameKana: string;
  name: string;
  pointBalance: number;
  pointBalanceTemp: number;
  diff: number;
  phoneNumber: string;
  memo?: string;
  ctid?: string;
};

export default function CustomerPoints() {
  const router = useRouter();

  const rows: RowData[] = useMemo(() => {
    const customerById = new Map(sampleCustomers.map(c => [c.id, c]));
    return sampleCustomerPoints.map((p, idx) => {
      const customer = customerById.get(p.customerId);
      const pointBalance = p.currentPoints ?? 0;
      const pointBalanceTemp = pointBalance; // 仮: 現状は同値
      const diff = pointBalanceTemp - pointBalance;
      return {
        id: p.id,
        customerNumber: customer?.customerNumber ?? '-',
        indexNo: idx + 1,
        nameKana: customer?.nameKana ?? p.customerName ?? '-',
        name: customer?.name ?? p.customerName ?? '-',
        pointBalance,
        pointBalanceTemp,
        diff,
        phoneNumber: customer?.phoneNumber ?? '-',
        memo: customer?.notes ?? '',
        ctid: undefined,
      };
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* 戻るボタン */}
      <div className="mb-4">
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
      <Card className="mb-4">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Award className="w-6 h-6" />
            <h1 className="text-2xl font-bold">顧客ポイント</h1>
          </div>
        </CardHeader>
      </Card>

      {/* メイン：横スクロール可能なポイントリスト */}
      <Card>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <Table className="min-w-[1400px] table-fixed text-xs whitespace-nowrap">
              <TableHeader>
                <TableRow className="h-10">
                  <TableHead className="w-[110px] px-2 text-center">操作</TableHead>
                  <TableHead className="w-[140px] px-2">顧客番号</TableHead>
                  <TableHead className="w-[60px] px-2 text-center">No</TableHead>
                  <TableHead className="w-[160px] px-2">氏名ふりがな</TableHead>
                  <TableHead className="w-[140px] px-2">氏名</TableHead>
                  <TableHead className="w-[130px] px-2 text-right">ポイント残高</TableHead>
                  <TableHead className="w-[150px] px-2 text-right">ポイント残高temp</TableHead>
                  <TableHead className="w-[100px] px-2 text-right">差額</TableHead>
                  <TableHead className="w-[150px] px-2">電話番号</TableHead>
                  <TableHead className="w-[220px] px-2">メモ</TableHead>
                  <TableHead className="w-[120px] px-2">CTID</TableHead>
                  <TableHead className="w-[60px] px-2"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} className="h-9">
                    <TableCell className="px-2">
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="h-7 px-3">C</Button>
                        <Button size="sm" variant="outline" className="h-7 px-3">P</Button>
                        <Button size="sm" variant="outline" className="h-7 px-3">売</Button>
                      </div>
                    </TableCell>
                    <TableCell className="px-2 font-mono">{row.customerNumber}</TableCell>
                    <TableCell className="px-2 text-center">{row.indexNo}</TableCell>
                    <TableCell className="px-2">{row.nameKana}</TableCell>
                    <TableCell className="px-2">{row.name}</TableCell>
                    <TableCell className="px-2 text-right font-mono">{row.pointBalance.toLocaleString()}</TableCell>
                    <TableCell className="px-2 text-right font-mono">{row.pointBalanceTemp.toLocaleString()}</TableCell>
                    <TableCell className="px-2 text-right font-mono">{row.diff.toLocaleString()}</TableCell>
                    <TableCell className="px-2">{row.phoneNumber}</TableCell>
                    <TableCell className="px-2 truncate max-w-[220px]" title={row.memo || ''}>{row.memo}</TableCell>
                    <TableCell className="px-2 font-mono">{row.ctid ?? ''}</TableCell>
                    <TableCell className="px-2"></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, Calendar } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { hostessManagerListSampleData } from "@/data/hostessManagerListSampleData";

export default function HostessManagerList() {
  const router = useRouter();

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
            <Calendar className="w-6 h-6" />
            <h1 className="text-2xl font-bold">ホステスマネージャリスト</h1>
          </div>
        </CardHeader>
      </Card>

      {/* メインコンテンツ */}
      <Card>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">No</TableHead>
                  <TableHead>氏名</TableHead>
                  <TableHead className="w-32">基準時間</TableHead>
                  <TableHead className="w-24">人数</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hostessManagerListSampleData.map((row) => (
                  <TableRow key={row.no}>
                    <TableCell>{row.no}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.standardHours}</TableCell>
                    <TableCell>{row.peopleCount}</TableCell>
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


'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, MapPin, Trash2 } from "lucide-react";
import { dispatchAreaTransportFeeSampleData } from "@/data/dispatchAreaTransportFeeSampleData";
import type { DispatchAreaTransportFee } from "@/types/dispatch";

export default function DispatchAreaTransportFee() {
  const router = useRouter();
  const [transportFeeData, setTransportFeeData] = useState<DispatchAreaTransportFee[]>(
    dispatchAreaTransportFeeSampleData
  );

  const handleTransportFeeChange = (id: string, newFee: number) => {
    setTransportFeeData(prev =>
      prev.map(item =>
        item.id === id ? { ...item, transportFee: newFee } : item
      )
    );
  };

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
            <MapPin className="w-6 h-6" />
            <h1 className="text-2xl font-bold">派遣地区別交通費</h1>
          </div>
        </CardHeader>
      </Card>

      {/* メインコンテンツ */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 px-2">No</TableHead>
                <TableHead className="px-2">上三桁</TableHead>
                <TableHead className="px-2">郵便番号</TableHead>
                <TableHead className="px-2">都道府県読み</TableHead>
                <TableHead className="px-2">市区町村読み</TableHead>
                <TableHead className="px-2">町丁読み</TableHead>
                <TableHead className="px-2">都道府県</TableHead>
                <TableHead className="px-2">市区町村</TableHead>
                <TableHead className="px-2">町丁</TableHead>
                <TableHead className="w-28 px-2">交通費</TableHead>
                <TableHead className="w-12 px-2"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transportFeeData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="px-2">{item.no}</TableCell>
                  <TableCell className="px-2">{item.postalCodePrefix}</TableCell>
                  <TableCell className="px-2">{item.postalCode}</TableCell>
                  <TableCell className="font-mono text-sm px-2">{item.prefectureReading}</TableCell>
                  <TableCell className="font-mono text-sm px-2">{item.cityReading}</TableCell>
                  <TableCell className="font-mono text-sm px-2">{item.townReading}</TableCell>
                  <TableCell className="px-2">{item.prefecture}</TableCell>
                  <TableCell className="px-2">{item.city}</TableCell>
                  <TableCell className="px-2">{item.town}</TableCell>
                  <TableCell className="px-2">
                    <Input
                      type="number"
                      value={item.transportFee}
                      onChange={(e) => handleTransportFeeChange(item.id, Number(e.target.value) || 0)}
                      className="w-24 h-9 text-center"
                      min="0"
                    />
                  </TableCell>
                  <TableCell className="px-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-gray-400 hover:!text-red-500 cursor-not-allowed opacity-50"
                      onClick={(e) => e.preventDefault()}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

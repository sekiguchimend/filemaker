'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Hotel, Heart, Building, Camera, CameraOff, Phone, MapPin } from "lucide-react";
import { hotelDivisionSampleData } from '@/data/hotelDivisionSampleData';
import type { HotelDivision } from '@/types/hotel-division';

export default function HotelPage() {
  const router = useRouter();

  const formatPhoneNumber = (phone: string) => {
    // 電話番号をハイフン区切りで表示
    return phone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
  };

  const formatPostalCode = (code: string) => {
    // 郵便番号をハイフン区切りで表示
    return code.replace(/(\d{3})(\d{4})/, '$1-$2');
  };

  const loveHotelCount = hotelDivisionSampleData.filter(item => item.type === 'ラブホテル').length;
  const cityHotelCount = hotelDivisionSampleData.filter(item => item.type === 'シティホテル').length;
  const withImageCount = hotelDivisionSampleData.filter(item => item.hotelImage === 'あり').length;
  const singleRoomAvailableCount = hotelDivisionSampleData.filter(item => item.singleRoomEntry === '可能').length;

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
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Hotel className="w-6 h-6" />
            <div>
              <CardTitle className="text-2xl">ホテル区分管理</CardTitle>
              <p className="text-muted-foreground mt-1">
                ホテルの詳細情報を管理します
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 統計情報 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">ラブホテル</p>
                <p className="text-2xl font-bold">{loveHotelCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">シティホテル</p>
                <p className="text-2xl font-bold">{cityHotelCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">画像あり</p>
                <p className="text-2xl font-bold">{withImageCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Hotel className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">独り入室可</p>
                <p className="text-2xl font-bold">{singleRoomAvailableCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* データテーブル */}
      <Card>
        <CardHeader>
          <CardTitle>ホテル区分一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">No</TableHead>
                  <TableHead>区分</TableHead>
                  <TableHead>頭2文字</TableHead>
                  <TableHead>ホテル名</TableHead>
                  <TableHead>地域区分</TableHead>
                  <TableHead>電話番号</TableHead>
                  <TableHead>独り入室</TableHead>
                  <TableHead>割引</TableHead>
                  <TableHead>郵便番号</TableHead>
                  <TableHead>住所</TableHead>
                  <TableHead>画像</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotelDivisionSampleData.map((item: HotelDivision) => (
                  <TableRow key={item.no}>
                    <TableCell className="font-medium">{item.no}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.type === 'ラブホテル' ? 'destructive' : 'default'}
                        className="flex items-center gap-1"
                      >
                        {item.type === 'ラブホテル' ? (
                          <Heart className="w-3 h-3" />
                        ) : (
                          <Building className="w-3 h-3" />
                        )}
                        {item.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm font-mono text-muted-foreground">
                      {item.firstTwoChars}
                    </TableCell>
                    <TableCell className="font-medium">{item.hotelName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.areaCategory}</Badge>
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm font-mono">
                        {formatPhoneNumber(item.phoneNumber)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.singleRoomEntry === '可能' ? 'secondary' : 'outline'}
                      >
                        {item.singleRoomEntry}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {item.discount || '-'}
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span className="text-sm font-mono">
                        {formatPostalCode(item.postalCode)}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs truncate" title={item.address}>
                      {item.address}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={item.hotelImage === 'あり' ? 'default' : 'outline'}
                        className="flex items-center gap-1"
                      >
                        {item.hotelImage === 'あり' ? (
                          <Camera className="w-3 h-3" />
                        ) : (
                          <CameraOff className="w-3 h-3" />
                        )}
                        {item.hotelImage}
                      </Badge>
                    </TableCell>
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

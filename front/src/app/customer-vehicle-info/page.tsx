'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Car, Settings, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { customerVehicleSampleData } from "@/data/customerVehicleSampleData";
import type { CustomerVehicle } from "@/types/customer-vehicle";
import CustomerVehicleEditModal from "@/components/modals/CustomerVehicleEditModal";

export default function CustomerVehicleInfo() {
  const router = useRouter();
  const [vehicleData, setVehicleData] = useState<CustomerVehicle[]>(customerVehicleSampleData);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<CustomerVehicle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 検索フィルター
  const filteredVehicles = vehicleData.filter(vehicle =>
    vehicle.ctNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.vehicleType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 編集ボタンクリック
  const handleEditClick = (vehicle: CustomerVehicle) => {
    setEditingVehicle(vehicle);
    setIsEditModalOpen(true);
  };

  // 編集保存
  const handleSaveEdit = (updatedVehicle: CustomerVehicle) => {
    setVehicleData(prev =>
      prev.map(vehicle =>
        vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
      )
    );
  };

  // ステータスバッジの色取得
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'suspended':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  // ステータスの日本語表示
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return '有効';
      case 'inactive':
        return '無効';
      case 'suspended':
        return '停止中';
      default:
        return status;
    }
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Car className="w-6 h-6" />
              <h1 className="text-2xl font-bold">顧客車情報</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="顧客番号、顧客名、車種、ナンバーで検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* メインコンテンツ */}
      <Card>
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredVehicles.length}件の顧客車情報
            </p>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">No</TableHead>
                <TableHead>CTNo</TableHead>
                <TableHead>顧客名</TableHead>
                <TableHead>車種</TableHead>
                <TableHead>車色</TableHead>
                <TableHead>地域</TableHead>
                <TableHead>車種番号</TableHead>
                <TableHead>記号</TableHead>
                <TableHead>車番号</TableHead>
                <TableHead>ナンバープレート</TableHead>
                <TableHead>ステータス</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell className="font-medium">{vehicle.serialNumber}</TableCell>
                  <TableCell className="font-mono">{vehicle.ctNo}</TableCell>
                  <TableCell className="font-medium">{vehicle.customerName}</TableCell>
                  <TableCell>{vehicle.vehicleType}</TableCell>
                  <TableCell>{vehicle.vehicleColor}</TableCell>
                  <TableCell>{vehicle.region}</TableCell>
                  <TableCell className="font-mono">{vehicle.classificationNumber}</TableCell>
                  <TableCell className="font-mono text-lg">{vehicle.hiraganaSymbol}</TableCell>
                  <TableCell className="font-mono">{vehicle.vehicleNumber}</TableCell>
                  <TableCell className="font-mono bg-gray-50 font-medium">
                    {vehicle.plateNumber}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(vehicle.status)}>
                      {getStatusLabel(vehicle.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(vehicle)}
                      className="flex items-center gap-1"
                    >
                      <Settings className="w-4 h-4" />
                      設定
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 編集モーダル */}
      <CustomerVehicleEditModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingVehicle(null);
        }}
        vehicle={editingVehicle}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

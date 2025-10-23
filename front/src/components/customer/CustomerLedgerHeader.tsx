'use client';

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Customer, storeMapping } from '@/types';
import type { CustomerLedgerHeaderProps } from '@/types/customer-ledger';

/**
 * 顧客台帳ヘッダーコンポーネント
 * 顧客番号、名前、氏名ふりがな、店舗番号、参照メディアを表示・編集
 */
export default function CustomerLedgerHeader({ 
  customer, 
  onCustomerChange, 
  readOnly = false 
}: CustomerLedgerHeaderProps) {
  
  const handleFieldChange = (field: keyof Customer, value: string) => {
    if (onCustomerChange && !readOnly) {
      onCustomerChange({ [field]: value });
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* 顧客番号 */}
          <div className="space-y-2">
            <Label htmlFor="customerNumber" className="text-sm font-medium text-gray-700">
              顧客番号
            </Label>
            <Input
              id="customerNumber"
              value={customer?.customerNumber || ''}
              onChange={(e) => handleFieldChange('customerNumber', e.target.value)}
              placeholder="C-00000"
              readOnly={readOnly}
              className={readOnly ? "bg-gray-50" : ""}
            />
          </div>

          {/* 名前 */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              名前
            </Label>
            <Input
              id="name"
              value={customer?.name || ''}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="顧客名を入力"
              readOnly={readOnly}
              className={readOnly ? "bg-gray-50" : ""}
            />
          </div>

          {/* 氏名ふりがな */}
          <div className="space-y-2">
            <Label htmlFor="nameKana" className="text-sm font-medium text-gray-700">
              氏名ふりがな
            </Label>
            <Input
              id="nameKana"
              value={customer?.nameKana || ''}
              onChange={(e) => handleFieldChange('nameKana', e.target.value)}
              placeholder="こきゃくめい"
              readOnly={readOnly}
              className={readOnly ? "bg-gray-50" : ""}
            />
          </div>

          {/* 店舗番号 */}
          <div className="space-y-2">
            <Label htmlFor="storeNumber" className="text-sm font-medium text-gray-700">
              店舗番号
            </Label>
            <Input
              id="storeNumber"
              value={customer?.storeNumber || ''}
              onChange={(e) => handleFieldChange('storeNumber', e.target.value)}
              placeholder="001"
              readOnly={readOnly}
              className={readOnly ? "bg-gray-50" : ""}
            />
            {/* 店舗名表示 */}
            {customer?.storeNumber && storeMapping[customer.storeNumber] && (
              <div className="text-xs text-gray-500 font-medium">
                {storeMapping[customer.storeNumber]}
              </div>
            )}
          </div>

          {/* 参照メディア */}
          <div className="space-y-2">
            <Label htmlFor="referenceMedia" className="text-sm font-medium text-gray-700">
              参照メディア
            </Label>
            <Input
              id="referenceMedia"
              value={customer?.referenceMedia || ''}
              onChange={(e) => handleFieldChange('referenceMedia', e.target.value)}
              placeholder=""
              readOnly={readOnly}
              className={readOnly ? "bg-gray-50" : ""}
            />
          </div>

        </div>
      </CardContent>
    </Card>
  );
}

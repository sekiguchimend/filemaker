'use client';

import React, { useMemo, useState } from 'react';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowLeft, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function IncomeSlip() {
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
            <DollarSign className="w-6 h-6" />
            <h1 className="text-2xl font-bold">入金伝票</h1>
          </div>
        </CardHeader>
      </Card>

      {/* メインコンテンツ（左右2カラム） */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 左カラム：入力エリア */}
            <div className="space-y-4">
              <div className="rounded-md border bg-white p-4">
                <div className="grid grid-cols-12 gap-3 items-center">
                  {/* 右上：記帳/会計確認/会計区分 */}
                  <div className="col-span-12">
                    <div className="flex flex-wrap md:flex-nowrap justify-end gap-2 gap-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-muted-foreground whitespace-nowrap">記帳</span>
                        <Input className="w-24" />
                        <Input className="w-32" />
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-muted-foreground whitespace-nowrap">会計確認</span>
                        <Input className="w-20" />
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <span className="text-muted-foreground whitespace-nowrap">会計区分</span>
                        <Input className="w-16" />
                      </div>
                    </div>
                  </div>

                  {/* SPID */}
                  <div className="col-span-3 text-sm text-muted-foreground">SPID</div>
                  <div className="col-span-3"><Input placeholder="番号" /></div>
                  <div className="col-span-6"><Input placeholder="コード" /></div>

                  {/* 伝票日付 */}
                  <div className="col-span-3 text-sm text-muted-foreground">伝票日付</div>
                  <div className="col-span-9"><Input type="date" /></div>

                  {/* 科目 + 金額 */}
                  <div className="col-span-3 text-sm text-muted-foreground">科目</div>
                  <div className="col-span-6">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">収益／現金</SelectItem>
                        <SelectItem value="card">収益／カード</SelectItem>
                        <SelectItem value="other">その他売上</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3">
                    <Input inputMode="decimal" placeholder="金額" className="text-right" />
                  </div>

                  {/* 入金者 */}
                  <div className="col-span-3 text-sm text-muted-foreground">入金者</div>
                  <div className="col-span-9"><Input /></div>

                  {/* 入金ホステス */}
                  <div className="col-span-3 text-sm text-muted-foreground">入金ホステス</div>
                  <div className="col-span-9"><Input /></div>

                  {/* 入金元 */}
                  <div className="col-span-3 text-sm text-muted-foreground">入金元</div>
                  <div className="col-span-9"><Input /></div>

                  {/* ふりがな */}
                  <div className="col-span-3 text-sm text-muted-foreground">ふりがな</div>
                  <div className="col-span-9"><Input /></div>

                  {/* 電話 */}
                  <div className="col-span-3 text-sm text-muted-foreground">電話</div>
                  <div className="col-span-9"><Input /></div>

                  {/* 内容 */}
                  <div className="col-span-3 text-sm text-muted-foreground">内容</div>
                  <div className="col-span-9"><Textarea rows={2} /></div>

                  {/* 備考 */}
                  <div className="col-span-3 text-sm text-muted-foreground">備考</div>
                  <div className="col-span-9"><Textarea rows={2} /></div>

                  {/* アクション */}
                  <div className="col-span-12 flex items-center justify-between pt-2">
                    <Button size="sm">入金</Button>
                    <Button size="sm" variant="destructive" className="w-24">転記</Button>
                  </div>
                </div>
              </div>
            </div>

            {/* 右カラム：明細 */}
            <div className="space-y-4">
              <div className="rounded-md border bg-white p-4">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  {/* 日付 */}
                  <div className="md:col-span-2">
                    <Input type="date" />
                  </div>
                  {/* 売上区分 */}
                  <div className="md:col-span-3">
                    <Select defaultValue="cash">
                      <SelectTrigger>
                        <SelectValue placeholder="売上区分を選択" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">現金売上</SelectItem>
                        <SelectItem value="card">カード売上</SelectItem>
                        <SelectItem value="other">その他</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[140px]">科目</TableHead>
                        <TableHead>取引相手</TableHead>
                        <TableHead>内容</TableHead>
                        <TableHead className="text-right w-[140px]">金額</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {/* サンプル行 */}
                      <TableRow>
                        <TableCell>現金</TableCell>
                        <TableCell>山田商店</TableCell>
                        <TableCell>売上入金</TableCell>
                        <TableCell className="text-right">12,000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>カード</TableCell>
                        <TableCell>ABCカード</TableCell>
                        <TableCell>手数料控除後入金</TableCell>
                        <TableCell className="text-right">45,800</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 下部カード：借方金額／貸方金額 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 借方金額 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">借方金額</h3>
          </CardHeader>
          <CardContent className="p-4">
            <Table className="w-full text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>伝票No</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* 貸方金額 */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">貸方金額</h3>
          </CardHeader>
          <CardContent className="p-4">
            <Table className="w-full text-sm">
              <TableHeader>
                <TableRow>
                  <TableHead>伝票No</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>-</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>-</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

# テーブル定義改善提案書

## 概要

`notion-table.md`のテーブル定義を確認し、改善点をまとめました。データベース設計の一貫性、保守性、パフォーマンス向上を目的としています。

---

## 1. データ型の誤り修正

### 問題点
- `VERCHAR` → 正しくは `VARCHAR`
- `VARCHER` → 正しくは `VARCHAR`
- `BOOL` → PostgreSQLでは `BOOLEAN` が推奨
- `DOUBLE` → PostgreSQLでは `DOUBLE PRECISION` または `NUMERIC` が推奨

### 修正箇所
- **shopテーブル**: すべての `VERCHAR` → `VARCHAR`
- **hotelテーブル**: すべての `VERCHAR` → `VARCHAR`
- **hostessテーブル**: `VERCHAR` → `VARCHAR`
- **present_hostessテーブル**: `VERCHAR` → `VARCHAR`
- **reservationテーブル**: `VARCHER` → `VARCHAR`, `BOOL` → `BOOLEAN`
- **gm_divisionテーブル**: `VERCHAR` → `VARCHAR`, `BOOL` → `BOOLEAN`
- **groupテーブル**: `DOUBLE` → `NUMERIC(5,2)` または `DOUBLE PRECISION`

---

## 2. 必須項目（NOT NULL制約）の明確化

### 問題点
重要なカラムにNOT NULL制約が明示されていない。

### 改善提案

#### shopテーブル
```sql
-- 必須項目として追加すべきもの
store_name VARCHAR(255) NOT NULL
SPID INT UNIQUE NOT NULL  -- 一意性制約も追加
phone_number VARCHAR(20) NOT NULL  -- 10文字では不足の可能性
```

#### hostessテーブル
```sql
-- 必須項目として追加すべきもの
cast_name VARCHAR(255) NOT NULL  -- 源氏名は必須
belong_shop UUID NOT NULL  -- 所属店舗は必須
```

#### reservationテーブル
```sql
-- 必須項目として追加すべきもの
hostess UUID NOT NULL
customer UUID NOT NULL
start_time TIME NOT NULL
end_time TIME NOT NULL
```

---

## 3. 主キー（PK）の不足

### 問題点
- `present_hostess`テーブルに主キーがない
- `reservation`テーブルに主キーがない
- `gm_division`テーブルに主キーがない

### 改善提案

#### present_hostessテーブル
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
-- または複合主キー
PRIMARY KEY (hostess, attend_time)
```

#### reservationテーブル
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
-- 予約は複数回発生する可能性があるため、UUID推奨
```

#### gm_divisionテーブル
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
-- または
gm_division VARCHAR(255) PRIMARY KEY
```

---

## 4. タイムスタンプカラムの追加

### 問題点
- `shop`, `group`, `hostess`, `hotel`, `present_hostess`, `reservation`, `gm_division`テーブルに`created_at`と`updated_at`がない

### 改善提案
すべてのテーブルに以下を追加：
```sql
created_at TIMESTAMPTZ NOT NULL DEFAULT now()
updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
```

既存の`staff`テーブルと同様のパターンに統一。

---

## 5. 外部キー制約の明示

### 問題点
FKと記載されているが、参照先テーブルやカスケード動作が不明確。

### 改善提案

#### shopテーブル
```sql
group_no INT REFERENCES group(number) ON UPDATE CASCADE ON DELETE SET NULL
```

#### hostessテーブル
```sql
manager UUID REFERENCES staff(id) ON UPDATE CASCADE ON DELETE SET NULL
belong_shop UUID REFERENCES shop(id) ON UPDATE CASCADE ON DELETE RESTRICT
```

#### present_hostessテーブル
```sql
hostess UUID NOT NULL REFERENCES hostess(id) ON UPDATE CASCADE ON DELETE CASCADE
driver UUID REFERENCES staff(id) ON UPDATE CASCADE ON DELETE SET NULL
```

#### reservationテーブル
```sql
hostess UUID NOT NULL REFERENCES hostess(id) ON UPDATE CASCADE ON DELETE RESTRICT
customer UUID NOT NULL REFERENCES customer(id) ON UPDATE CASCADE ON DELETE RESTRICT
in_driver UUID REFERENCES staff(id) ON UPDATE CASCADE ON DELETE SET NULL
out_driver UUID REFERENCES staff(id) ON UPDATE CASCADE ON DELETE SET NULL
course VARCHAR(10) REFERENCES course(code) ON UPDATE CASCADE ON DELETE RESTRICT
```

---

## 6. データ型の不適切な選択

### 問題点

#### phone_numberがINT型
- **shopテーブル**: `phone_number VERCHAR(10)` → `VARCHAR(20)` に変更（ハイフン含む）
- **hostessテーブル**: `phone_number INT` → `VARCHAR(20)` に変更
- **hotelテーブル**: `phone_number INT` → `VARCHAR(20)` に変更

#### 郵便番号・住所の扱い
- **hotelテーブル**: `address_number INT` → `VARCHAR(7)` に変更（郵便番号）
- **hotelテーブル**: `address_street INT` → `VARCHAR(255)` に変更（番地は文字列）

#### 金額・割合の型
- **shopテーブル**: 料金系は`INT`で問題ないが、割合は`NUMERIC(5,2)`を検討
- **groupテーブル**: `expenses_ratio DOUBLE` → `NUMERIC(5,2)` に変更（精度向上）

---

## 7. 正規化の観点

### 問題点

#### groupテーブルの`belongs_shop UUID[]`
配列型を使用しているが、正規化の観点から中間テーブルの作成を推奨。

### 改善提案

#### group_shop（中間テーブル）の作成
```sql
CREATE TABLE group_shop (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_number INT NOT NULL REFERENCES group(number) ON UPDATE CASCADE ON DELETE CASCADE,
  shop_id UUID NOT NULL REFERENCES shop(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(group_number, shop_id)
);
```

これにより、グループと店舗の多対多の関係を適切に管理できます。

---

## 8. インデックスの追加

### 推奨インデックス

#### shopテーブル
```sql
CREATE INDEX idx_shop_spid ON shop(SPID);
CREATE INDEX idx_shop_group_no ON shop(group_no);
CREATE INDEX idx_shop_store_name ON shop(store_name);
```

#### hostessテーブル
```sql
CREATE INDEX idx_hostess_belong_shop ON hostess(belong_shop);
CREATE INDEX idx_hostess_manager ON hostess(manager);
CREATE INDEX idx_hostess_cast_name ON hostess(cast_name);
```

#### present_hostessテーブル
```sql
CREATE INDEX idx_present_hostess_hostess ON present_hostess(hostess);
CREATE INDEX idx_present_hostess_driver ON present_hostess(driver);
CREATE INDEX idx_present_hostess_attend_time ON present_hostess(attend_time);
```

#### reservationテーブル
```sql
CREATE INDEX idx_reservation_hostess ON reservation(hostess);
CREATE INDEX idx_reservation_customer ON reservation(customer);
CREATE INDEX idx_reservation_start_time ON reservation(start_time);
CREATE INDEX idx_reservation_date ON reservation(DATE(start_time));
```

---

## 9. 命名規則の統一

### 問題点
- カラム名の命名規則が統一されていない
- スネークケースとキャメルケースが混在

### 改善提案
すべてのカラム名を**スネークケース**に統一：

#### shopテーブル
- `SPID` → `spid` または `shop_id`（要件定義書のIDと区別するため）
- `store_name` → そのまま（OK）
- `cource_fee_style` → `course_fee_style`（タイポ修正）

#### hostessテーブル
- `cast_name` → `stage_name`（既存コードとの整合性）
- `belong_shop` → `shop_id`（命名規則統一）
- `email_address` → `email`（簡潔に）

#### reservationテーブル
- `is_reciept` → `is_receipt`（タイポ修正）
- `is_tel` → `is_arrival_call`（意味を明確に）

#### hotelテーブル
- `dividion` → `division`（タイポ修正）
- `address_in_Kyoto` → `address_in_kyoto`（スネークケース統一）
- `is_able_lonely` → `is_available_solo`（意味を明確に）

---

## 10. ENUM型の定義

### 問題点
ENUM型が使用されているが、値の定義が不明確。

### 改善提案

#### shopテーブル
```sql
-- extension_style ENUM
CREATE TYPE extension_style_type AS ENUM ('fixed_rate', 'hostess_specific');

-- business_style ENUM
CREATE TYPE business_style_type AS ENUM ('delivery_health', 'hotel_health');
```

#### hotelテーブル
```sql
-- division ENUM
CREATE TYPE hotel_division_type AS ENUM ('luxury', 'business', 'budget', 'boutique', 'resort');

-- area_division ENUM
CREATE TYPE area_division_type AS ENUM ('north', 'south', 'east', 'west', 'center');
```

---

## 12. その他の改善点

### 12.1 タイポ修正

- `cource` → `course`（shopテーブル、courceテーブル名）
- `reciept` → `receipt`（reservationテーブル）
- `dividion` → `division`（hotelテーブル）
- `sord_order` → `sort_order`（gm_divisionテーブル）
- `金額出勤時間` → `金曜出勤時間`（staffテーブルの説明）

### 12.2 説明不足のカラム

#### hotelテーブル
以下のカラムの説明を追加：
- `no`: ホテル番号
- `division`: ホテル区分
- `address_number`: 郵便番号
- `address_in_Kyoto`: 京都府内の住所
- `address_city`: 市区町村
- `address_town`: 町丁目
- `address_street`: 番地
- `area_division`: エリア区分
- `is_able_lonely`: 一人利用可能か
- `price_break`: 休憩料金
- `price_stay`: 宿泊料金

### 12.3 カラムの追加検討

#### shopテーブル
```sql
status VARCHAR(50)  -- active | inactive | closed
address JSONB  -- 住所情報を構造化
contact_info JSONB  -- 連絡先情報を構造化
```

#### hostessテーブル
```sql
hostess_number VARCHAR(50) UNIQUE  -- ホステス番号（H-001など）
first_name VARCHAR(255)  -- 名前
last_name VARCHAR(255)  -- 苗字
first_name_kana VARCHAR(255)  -- 名前カナ
last_name_kana VARCHAR(255)  -- 苗字カナ
birth_date DATE  -- 生年月日
status VARCHAR(50)  -- active | inactive | suspended | retired
category VARCHAR(50)  -- VIP | Lady | Girls | SUP | 新人
registration_date DATE  -- 登録日
last_work_date DATE  -- 最終勤務日
```

#### reservationテーブル
```sql
id UUID PRIMARY KEY  -- 予約の一意なID
reservation_date DATE NOT NULL  -- 予約日
reservation_number VARCHAR(50) UNIQUE  -- 予約番号
status VARCHAR(50)  -- pending | confirmed | completed | cancelled
total_amount NUMERIC(10,2)  -- 合計金額
created_at TIMESTAMPTZ NOT NULL  -- 作成日時
updated_at TIMESTAMPTZ NOT NULL  -- 更新日時
```

---

## 13. テーブル間の関係性の明確化

### 改善提案

#### リレーションシップ図の作成
```
shop (1) ──< (N) hostess
shop (1) ──< (N) reservation
hostess (1) ──< (N) reservation
hostess (1) ──< (N) present_hostess
staff (1) ──< (N) hostess (manager)
staff (1) ──< (N) present_hostess (driver)
staff (1) ──< (N) reservation (in_driver, out_driver)
group (1) ──< (N) shop
group (N) ──< (N) shop (中間テーブル推奨)
course (1) ──< (N) reservation
customer (1) ──< (N) reservation
```

---

## 14. セキュリティ・パフォーマンス考慮事項

### 14.1 機密情報の扱い

#### shopテーブル
```sql
web_management_pw VARCHAR(255)  -- パスワードは暗号化必須
-- または別テーブルに分離して管理
```

### 14.2 パーティショニング検討

#### reservationテーブル
日付ベースのパーティショニングを検討：
```sql
-- 月次パーティショニング
PARTITION BY RANGE (reservation_date)
```

### 14.3 アーカイブ戦略

古いデータのアーカイブ用テーブルの作成を検討：
- `reservation_archive`
- `present_hostess_archive`

---

## 15. 実装優先順位

### Phase 1: 緊急修正（必須）
1. データ型の誤り修正（VERCHAR → VARCHAR等）
2. 主キーの追加（present_hostess, reservation, gm_division）
3. タイムスタンプカラムの追加
4. 外部キー制約の明示

### Phase 2: 重要改善
1. NOT NULL制約の追加
2. インデックスの追加
3. タイポ修正

### Phase 3: 設計改善
1. 正規化（group_shop中間テーブル）
2. ENUM型の定義
3. 命名規則の統一
4. カラムの追加検討

---

## まとめ

主な改善点：
1. ✅ **データ型の誤り修正** - VERCHAR → VARCHAR等
2. ✅ **主キーの追加** - 3テーブルに不足
3. ✅ **タイムスタンプカラム** - 7テーブルに不足
4. ✅ **外部キー制約の明示** - 参照先とカスケード動作の明確化
5. ✅ **インデックスの追加** - パフォーマンス向上
6. ✅ **正規化** - group_shop中間テーブルの作成
7. ✅ **命名規則の統一** - スネークケースに統一
8. ✅ **タイポ修正** - 複数箇所

これらの改善により、データベース設計の一貫性、保守性、パフォーマンスが向上します。


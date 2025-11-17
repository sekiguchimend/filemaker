# ホステステーブル設計書

## 概要

ホステス関連のデータ型が複数のファイルで乱立している問題を解決するため、統一されたhostessテーブル設計を提案します。各ページで必要なデータは、この統一テーブルから必要なフィールドを取得して参照します。

## 設計方針

1. **正規化**: 基本情報と集計情報を分離し、データの整合性を保つ
2. **拡張性**: JSONBカラムを活用して柔軟なデータ構造を保持
3. **パフォーマンス**: 頻繁にアクセスされるフィールドにインデックスを設定
4. **一貫性**: 既存のstaffテーブルの設計パターンに準拠

## テーブル構成

### 1. hostess（ホステス基本情報テーブル）

ホステスの基本情報を管理するメインテーブルです。

#### カラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | uuid | PK | 主キー |
| hostess_number | varchar(50) | UNIQUE, NOT NULL | ホステス番号（例: H-001） |
| first_name | varchar(255) | NOT NULL | 名前 |
| last_name | varchar(255) | NOT NULL | 苗字 |
| first_name_kana | varchar(255) | | 名前（カナ） |
| last_name_kana | varchar(255) | | 苗字（カナ） |
| stage_name | varchar(255) | NOT NULL | 源氏名 |
| birth_date | date | | 生年月日 |
| phone_number | varchar(20) | | 電話番号 |
| email | varchar(255) | | メールアドレス |
| emergency_contact | jsonb | DEFAULT '{}' | 緊急連絡先情報 |
| address | jsonb | DEFAULT '{}' | 住所情報 |
| status | varchar(50) | NOT NULL, DEFAULT 'active' | ステータス |
| category | varchar(50) | | カテゴリー |
| work_type | varchar(50) | | 勤務形態 |
| is_newcomer | boolean | DEFAULT false | 新人フラグ |
| registration_date | date | NOT NULL, DEFAULT current_date | 登録日 |
| last_work_date | date | | 最終勤務日 |
| preferences | jsonb | DEFAULT '{}' | 勤務希望情報 |
| ng_areas | text[] | DEFAULT '{}' | NG地域リスト |
| special_notes | text | | 特記事項 |
| total_work_days | integer | DEFAULT 0 | 総勤務日数（キャッシュ） |
| total_earnings | numeric(12, 2) | DEFAULT 0 | 総収入（キャッシュ） |
| average_rating | numeric(3, 2) | DEFAULT 0 | 平均評価（0.00-5.00） |
| hostess_manager_id | uuid | FK | ホステスマネージャーID |
| assigned_staff_id | uuid | FK | 担当スタッフID（staff.id） |
| store_id | uuid | FK | 主担当店舗ID |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 作成日時 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 更新日時 |

#### JSONBカラムの詳細構造

**emergency_contact**
```json
{
  "name": "string",
  "phoneNumber": "string",
  "relationship": "string"
}
```

**address**
```json
{
  "zipCode": "string",
  "prefecture": "string",
  "city": "string",
  "street": "string",
  "building": "string (optional)"
}
```

**preferences**
```json
{
  "workStartTime": "string (optional)",
  "workEndTime": "string (optional)",
  "preferredAreas": ["string"],
  "availableDays": ["string"]
}
```

#### ステータス値

- `active`: 在籍中
- `inactive`: 休業中
- `suspended`: 停止中
- `retired`: 退職

#### カテゴリー値

- `内子系`
- `内妻系`
- `VIP`
- `Lady`
- `Girls`
- `SUP`
- `新人`

#### 勤務形態値

- `full_time`: 正社員
- `part_time`: パート
- `contract`: 契約
- `dispatch`: 派遣
- `temp`: 臨時

#### インデックス

- `idx_hostess_hostess_number`: hostess_number
- `idx_hostess_status`: status
- `idx_hostess_category`: category
- `idx_hostess_stage_name`: stage_name
- `idx_hostess_store_id`: store_id
- `idx_hostess_assigned_staff_id`: assigned_staff_id
- `idx_hostess_hostess_manager_id`: hostess_manager_id

---

### 2. hostess_schedule（ホステススケジュールテーブル）

ホステスの週間スケジュールを管理するテーブルです。

#### カラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | uuid | PK | 主キー |
| hostess_id | uuid | FK, NOT NULL | ホステスID（hostess.id） |
| week_start_date | date | NOT NULL | 週開始日（YYYY-MM-DD） |
| week_end_date | date | NOT NULL | 週終了日（YYYY-MM-DD） |
| weekly_schedule | jsonb | NOT NULL, DEFAULT '{}' | 週間スケジュール |
| weekly_stats | jsonb | DEFAULT '{}' | 週間統計 |
| status | varchar(50) | NOT NULL, DEFAULT 'draft' | ステータス |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 作成日時 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 更新日時 |

#### 制約

- `UNIQUE(hostess_id, week_start_date)`: 同一ホステスの同一週の重複を防止

#### JSONBカラムの詳細構造

**weekly_schedule**
```json
{
  "monday": {
    "isWorkDay": boolean,
    "startTime": "string (optional)",
    "endTime": "string (optional)",
    "breakTime": number (optional),
    "workHours": number (optional),
    "notes": "string (optional)"
  },
  "tuesday": { ... },
  "wednesday": { ... },
  "thursday": { ... },
  "friday": { ... },
  "saturday": { ... },
  "sunday": { ... }
}
```

**weekly_stats**
```json
{
  "totalWorkDays": number,
  "totalWorkHours": number,
  "averageDailyHours": number,
  "expectedEarnings": number
}
```

#### ステータス値

- `draft`: 下書き
- `confirmed`: 確定
- `published`: 公開済み

#### インデックス

- `idx_hostess_schedule_hostess_id`: hostess_id
- `idx_hostess_schedule_week_start_date`: week_start_date
- `idx_hostess_schedule_status`: status

---

### 3. hostess_attendance（ホステス出勤テーブル）

ホステスの日次出勤情報を管理するテーブルです。

#### カラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | uuid | PK | 主キー |
| hostess_id | uuid | FK, NOT NULL | ホステスID（hostess.id） |
| attendance_date | date | NOT NULL | 出勤日 |
| start_time | time | | 出勤時刻 |
| end_time | time | | 退勤時刻 |
| work_hours | numeric(4, 2) | | 実働時間（時間単位） |
| status | varchar(50) | NOT NULL, DEFAULT 'present' | ステータス |
| store_id | uuid | FK | 勤務店舗ID |
| location | varchar(255) | | 場所（例: VIPルーム、待機室） |
| earnings | numeric(10, 2) | DEFAULT 0 | その日の収入 |
| customer_count | integer | DEFAULT 0 | 客数 |
| notes | text | | 備考 |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 作成日時 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 更新日時 |

#### 制約

- `UNIQUE(hostess_id, attendance_date)`: 同一ホステスの同一日の重複を防止

#### ステータス値

- `present`: 出勤
- `absent`: 欠勤
- `late`: 遅刻
- `early_leave`: 早退

#### インデックス

- `idx_hostess_attendance_hostess_id`: hostess_id
- `idx_hostess_attendance_attendance_date`: attendance_date
- `idx_hostess_attendance_store_id`: store_id
- `idx_hostess_attendance_status`: status

---

### 4. hostess_ranking（ホステスランキングテーブル）

ホステスの月次ランキング情報を管理するテーブルです。集計データを保持します。

#### カラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | uuid | PK | 主キー |
| hostess_id | uuid | FK, NOT NULL | ホステスID（hostess.id） |
| ranking_month | date | NOT NULL | ランキング対象月（月初日） |
| rank | integer | | 順位 |
| previous_rank | integer | | 前回順位 |
| rank_change | varchar(50) | | 順位変動 |
| store_id | uuid | FK | 店舗ID |
| store_name | varchar(255) | | 店舗名 |
| monthly_earnings | numeric(12, 2) | DEFAULT 0 | 月間収入 |
| total_customers | integer | DEFAULT 0 | 総客数 |
| average_service_time | numeric(6, 2) | DEFAULT 0 | 平均サービス時間（分） |
| customer_satisfaction_score | numeric(3, 2) | DEFAULT 0 | 顧客満足度スコア（0.00-5.00） |
| work_days_in_month | integer | DEFAULT 0 | 月間勤務日数 |
| earnings_growth_rate | numeric(5, 2) | DEFAULT 0 | 収入成長率（%） |
| regular_nomination_count | integer | DEFAULT 0 | 通常指名数 |
| panel_nomination_count | integer | DEFAULT 0 | パネル指名数 |
| free_nomination_count | integer | DEFAULT 0 | フリー指名数 |
| nomination_revenue | numeric(12, 2) | DEFAULT 0 | 指名売上 |
| total_service_time | numeric(8, 2) | DEFAULT 0 | 総サービス時間（分） |
| average_customer_spending | numeric(10, 2) | DEFAULT 0 | 平均客単価 |
| repeat_customer_rate | numeric(5, 2) | DEFAULT 0 | リピート率（%） |
| new_customer_count | integer | DEFAULT 0 | 新規客数 |
| extension_rate | numeric(5, 2) | DEFAULT 0 | 延長率（%） |
| special_achievements | text[] | | 特別な実績リスト |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 作成日時 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 更新日時 |

#### 制約

- `UNIQUE(hostess_id, ranking_month)`: 同一ホステスの同一月の重複を防止

#### 順位変動値

- `up`: 順位上昇
- `down`: 順位下降
- `same`: 順位変動なし
- `new`: 新規ランクイン

#### インデックス

- `idx_hostess_ranking_hostess_id`: hostess_id
- `idx_hostess_ranking_ranking_month`: ranking_month
- `idx_hostess_ranking_rank`: rank
- `idx_hostess_ranking_store_id`: store_id

---

### 5. hostess_manager（ホステスマネージャーテーブル）

ホステスマネージャーの基本情報を管理するテーブルです。

#### カラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | uuid | PK | 主キー |
| manager_number | varchar(50) | UNIQUE, NOT NULL | マネージャー番号（例: M-001） |
| first_name | varchar(255) | NOT NULL | 名前 |
| last_name | varchar(255) | NOT NULL | 苗字 |
| first_name_kana | varchar(255) | | 名前（カナ） |
| last_name_kana | varchar(255) | | 苗字（カナ） |
| phone_number | varchar(20) | | 電話番号 |
| email | varchar(255) | | メールアドレス |
| position | varchar(50) | NOT NULL, DEFAULT 'assistant' | 役職 |
| hire_date | date | NOT NULL, DEFAULT current_date | 雇用日 |
| status | varchar(50) | NOT NULL, DEFAULT 'active' | ステータス |
| monthly_performance | jsonb | DEFAULT '{}' | 月間実績（キャッシュ用） |
| notes | text | | 備考 |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 作成日時 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 更新日時 |

#### JSONBカラムの詳細構造

**monthly_performance**
```json
{
  "totalRevenue": number,
  "averageHostessEarnings": number,
  "newRecruits": number,
  "retentionRate": number
}
```

#### 役職値

- `manager`: マネージャー
- `sub_manager`: サブマネージャー
- `leader`: リーダー
- `assistant`: アシスタント

#### ステータス値

- `active`: 在籍中
- `inactive`: 非在籍
- `on_leave`: 休職中

#### インデックス

- `idx_hostess_manager_manager_number`: manager_number
- `idx_hostess_manager_status`: status
- `idx_hostess_manager_position`: position

---

### 6. hostess_manager_assignment（ホステス-マネージャー関連テーブル）

ホステスとマネージャーの関連を管理するテーブルです。履歴管理も可能です。

#### カラム定義

| カラム名 | 型 | 制約 | 説明 |
|---------|-----|------|------|
| id | uuid | PK | 主キー |
| hostess_id | uuid | FK, NOT NULL | ホステスID（hostess.id） |
| manager_id | uuid | FK, NOT NULL | マネージャーID（hostess_manager.id） |
| assigned_date | date | NOT NULL, DEFAULT current_date | 割り当て日 |
| unassigned_date | date | | 割り当て解除日 |
| is_active | boolean | NOT NULL, DEFAULT true | 現在有効かどうか |
| created_at | timestamptz | NOT NULL, DEFAULT now() | 作成日時 |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | 更新日時 |

#### インデックス

- `idx_hostess_manager_assignment_hostess_id`: hostess_id
- `idx_hostess_manager_assignment_manager_id`: manager_id
- `idx_hostess_manager_assignment_is_active`: is_active

---

## 既存型定義との対応関係

### HostessLedger → hostess

```typescript
// 既存の型定義
interface HostessLedger {
  id: string;
  hostessNumber: string;
  name: string;
  nameKana: string;
  stageName: string;
  // ... その他
}

// テーブルからの取得
// SELECT id, hostess_number, 
//        first_name || ' ' || last_name as name,
//        first_name_kana || ' ' || last_name_kana as name_kana,
//        stage_name, ...
// FROM hostess
```

### HostessRanking → hostess + hostess_ranking

```typescript
// 既存の型定義
interface HostessRanking {
  id: string;
  hostessId: string;
  hostessName: string;
  stageName: string;
  category: string;
  // ... ランキング情報
}

// テーブルからの取得
// SELECT 
//   hr.id,
//   hr.hostess_id,
//   h.first_name || ' ' || h.last_name as hostess_name,
//   h.stage_name,
//   h.category,
//   hr.rank,
//   hr.monthly_earnings,
//   ...
// FROM hostess_ranking hr
// JOIN hostess h ON hr.hostess_id = h.id
```

### HostessScheduleData → hostess + hostess_schedule

```typescript
// 既存の型定義
interface HostessScheduleData {
  id: string;
  hostessId: string;
  name: string;
  weeklySchedule: { ... };
  // ...
}

// テーブルからの取得
// SELECT 
//   hs.id,
//   hs.hostess_id,
//   h.stage_name as name,
//   hs.weekly_schedule,
//   ...
// FROM hostess_schedule hs
// JOIN hostess h ON hs.hostess_id = h.id
```

### TimeBasedHostessAttendance → hostess + hostess_attendance

```typescript
// 既存の型定義
interface TimeBasedHostessAttendance {
  id: string;
  date: string;
  hostessId: string;
  hostessName: string;
  // ...
}

// テーブルからの取得
// SELECT 
//   ha.id,
//   ha.attendance_date as date,
//   ha.hostess_id,
//   h.stage_name as hostess_name,
//   ha.start_time,
//   ha.end_time,
//   ...
// FROM hostess_attendance ha
// JOIN hostess h ON ha.hostess_id = h.id
```

---

## データ取得パターン

### 1. ホステス台帳ページ

```sql
SELECT 
  id,
  hostess_number,
  first_name || ' ' || last_name as name,
  first_name_kana || ' ' || last_name_kana as name_kana,
  stage_name,
  birth_date,
  age, -- 計算フィールド（生年月日から算出）
  phone_number,
  emergency_contact,
  address,
  registration_date,
  last_work_date,
  status,
  category,
  total_work_days,
  total_earnings,
  average_rating,
  special_notes,
  ng_areas,
  preferences
FROM hostess
WHERE status = 'active'
ORDER BY hostess_number;
```

### 2. ホステスランキングページ

```sql
SELECT 
  hr.id,
  hr.rank,
  hr.hostess_id,
  h.first_name || ' ' || h.last_name as hostess_name,
  h.stage_name,
  h.category,
  hr.store_id,
  hr.store_name,
  hr.monthly_earnings,
  hr.total_customers,
  hr.average_service_time,
  hr.customer_satisfaction_score,
  hr.work_days_in_month,
  hr.earnings_growth_rate,
  hr.special_achievements,
  hr.previous_rank,
  hr.rank_change,
  hr.regular_nomination_count,
  hr.panel_nomination_count,
  hr.free_nomination_count,
  hr.nomination_revenue,
  hr.total_service_time,
  hr.average_customer_spending,
  hr.repeat_customer_rate,
  hr.new_customer_count,
  hr.extension_rate
FROM hostess_ranking hr
JOIN hostess h ON hr.hostess_id = h.id
WHERE hr.ranking_month = DATE_TRUNC('month', CURRENT_DATE)
ORDER BY hr.rank;
```

### 3. ホステススケジュールページ

```sql
SELECT 
  hs.id,
  hs.hostess_id,
  h.stage_name as name,
  h.work_type,
  h.is_newcomer,
  hs.weekly_schedule,
  hs.weekly_stats,
  hs.week_start_date,
  hs.week_end_date,
  hs.status,
  hm.first_name || ' ' || hm.last_name as hostess_manager,
  s.first_name || ' ' || s.last_name as assigned_staff
FROM hostess_schedule hs
JOIN hostess h ON hs.hostess_id = h.id
LEFT JOIN hostess_manager hm ON h.hostess_manager_id = hm.id
LEFT JOIN staff s ON h.assigned_staff_id = s.id
WHERE hs.week_start_date >= CURRENT_DATE
ORDER BY hs.week_start_date, h.stage_name;
```

### 4. 時間別ホステス出勤ページ

```sql
SELECT 
  ha.id,
  ha.attendance_date as date,
  ha.hostess_id,
  h.stage_name as hostess_name,
  h.category,
  ha.start_time,
  ha.end_time,
  ha.status,
  ha.location,
  ha.store_id,
  s.store_name
FROM hostess_attendance ha
JOIN hostess h ON ha.hostess_id = h.id
LEFT JOIN store s ON ha.store_id = s.id
WHERE ha.attendance_date = CURRENT_DATE
ORDER BY ha.start_time, h.stage_name;
```

### 5. 週間ホステス出勤ページ

```sql
SELECT 
  ha.hostess_id,
  h.stage_name as hostess_name,
  h.category,
  jsonb_object_agg(
    ha.attendance_date::text,
    jsonb_build_object(
      'startTime', ha.start_time,
      'endTime', ha.end_time,
      'workHours', ha.work_hours,
      'status', ha.status,
      'earnings', ha.earnings,
      'customerCount', ha.customer_count,
      'notes', ha.notes
    )
  ) as daily_attendance,
  jsonb_build_object(
    'totalHours', SUM(ha.work_hours),
    'totalDays', COUNT(CASE WHEN ha.status = 'present' THEN 1 END),
    'totalEarnings', SUM(ha.earnings),
    'totalCustomers', SUM(ha.customer_count),
    'averageHoursPerDay', AVG(ha.work_hours)
  ) as weekly_totals,
  COUNT(CASE WHEN ha.status = 'present' THEN 1 END)::float / 
    NULLIF(COUNT(*), 0) * 100 as attendance_rate
FROM hostess_attendance ha
JOIN hostess h ON ha.hostess_id = h.id
WHERE ha.attendance_date >= DATE_TRUNC('week', CURRENT_DATE)
  AND ha.attendance_date < DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '1 week'
GROUP BY ha.hostess_id, h.stage_name, h.category;
```

---

## 移行計画

### Phase 1: テーブル作成
1. マイグレーションファイルの作成
2. テーブル・インデックス・制約の作成
3. 外部キー制約の設定（既存テーブルとの関連）

### Phase 2: データ移行
1. 既存のサンプルデータをテーブル形式に変換
2. データのインポート
3. データ整合性の確認

### Phase 3: 型定義の統一
1. 既存の型定義ファイルを整理
2. テーブル構造に基づいた新しい型定義の作成
3. 各ページでの型定義の更新

### Phase 4: サービス層の更新
1. 既存のサービス層をテーブルベースに更新
2. クエリビルダーまたはORMの導入検討
3. APIエンドポイントの更新

### Phase 5: フロントエンドの更新
1. 各ページコンポーネントの更新
2. データ取得ロジックの更新
3. 型安全性の確保

---

## 注意事項

1. **JSONBカラムの使用**: 柔軟性を保つためJSONBを使用していますが、頻繁に検索するフィールドは通常のカラムとして分離することを検討してください。

2. **集計データのキャッシュ**: `hostess`テーブルの`total_work_days`、`total_earnings`などは集計結果のキャッシュです。実際の集計は`hostess_attendance`テーブルから行う必要があります。

3. **外部キー制約**: `staff`テーブルや`store`テーブルが存在する場合、外部キー制約を設定してください。

4. **パフォーマンス**: 大量のデータがある場合は、パーティショニングやマテリアライズドビューの検討が必要です。

5. **データ整合性**: `hostess_ranking`テーブルのデータは、`hostess_attendance`テーブルから集計して生成する必要があります。バッチ処理やトリガー関数の実装を検討してください。

---

## 参考

- 既存の`staff`テーブル設計パターンに準拠
- PostgreSQL公式ドキュメント: https://www.postgresql.org/docs/
- Supabase公式ドキュメント: https://supabase.com/docs


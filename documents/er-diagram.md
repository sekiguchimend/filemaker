# データベース ER図

## テーブル関係図

```mermaid
erDiagram
    shop ||--o{ group : "belongs_shop"
    shop ||--o{ hostess : "shop_id"
    
    staff ||--o| staff_car : "vehicle"
    staff ||--o{ hostess : "manager"
    staff ||--o{ present_hostess : "driver"
    staff ||--o{ reservation : "in_driver"
    staff ||--o{ reservation : "out_driver"
    
    hostess ||--o{ present_hostess : "hostess"
    hostess ||--o{ reservation : "hostess"
    
    customer ||--o{ reservation : "customer"
    
    shop {
        UUID id PK
        INT SPID
        INT department_no
        VARCHAR accounting_category
        VARCHAR store_name
        VARCHAR store_name_furigana
        VARCHAR store_name_short
        VARCHAR phone_number
        VARCHAR url
        VARCHAR mail
        BOOLEAN is_web
        VARCHAR web_management_id
        VARCHAR web_management_pw
        VARCHAR web_management_url
        VARCHAR hostess_page_url
        VARCHAR hostess_list_url
        VARCHAR hostess_attendance_management_url
        VARCHAR hostess_management_url
        VARCHAR send_hsprofile
        VARCHAR send_hsattend
        VARCHAR send_hsjob
        VARCHAR send_ctpoint
        VARCHAR send_hsstart
        VARCHAR send_hsranking
        BOOLEAN course_fee_style
        BOOLEAN nomination_fee_style
        BOOLEAN gm_category
        INT nomination_fee
        INT extension_fee
        INT extension_per_minutes
        INT standard_transportation_expenses
        INT cancel_fee
        BOOLEAN is_membership_card
        INT customer_point_initial_former
        INT customer_point_initial_latter
        BOOLEAN is_nomination_plusback
        BOOLEAN membership_number_management
        INT change_fee
        INT card_commission
        NUMERIC standard_hostess_recieve_rate
        ENUM extension_style
        NUMERIC extension_hostess_recieve_rate
        INT panel_nomination_fee
        INT star_price
        INT group_no FK
        ENUM business_style
        VARCHAR former_start
        VARCHAR former_end
        VARCHAR latter_start
        VARCHAR latter_end
        BOOLEAN is_hs_send_room_no
        BOOLEAN is_hs_send_end
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    
    staff {
        UUID id PK
        INT sfid
        VARCHAR first_name
        VARCHAR last_name
        VARCHAR first_name_furigana
        VARCHAR last_name_furigana
        VARCHAR area_division
        VARCHAR group
        BOOLEAN status
        INT bath_towel
        INT equipment
        TIMESTAMPTZ joining_date
        TIMESTAMPTZ resignation_date
        VARCHAR position
        VARCHAR employment_type
        VARCHAR job_description
        VARCHAR mobile_email_address
        VARCHAR pc_email_address
        VARCHAR phone_number
        UUID vehicle FK
        VARCHAR remarks
        TIME mon_start
        TIME mon_end
        TIME tue_start
        TIME tue_end
        TIME wed_start
        TIME wed_end
        TIME thu_start
        TIME thu_end
        TIME fri_start
        TIME fri_end
        TIME sat_start
        TIME sat_end
        TIME sun_start
        TIME sun_end
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    
    staff_car {
        UUID id PK
        VARCHAR car_type
        VARCHAR color
        INT capacity
        VARCHAR area
        VARCHAR character
        INT number
        BOOLEAN is_etc
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    
    group {
        INT number PK
        VARCHAR name
        INT membership_number
        VARCHAR initial
        INT digits
        NUMERIC expenses_ratio
        BOOLEAN is_discount_use
        INT discount_interval
        INT discount_price
        UUID belongs_shop FK
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    
    hostess {
        UUID id PK
        UUID manager FK
        VARCHAR phone_number
        VARCHAR email
        VARCHAR stage_name
        UUID shop_id FK
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    
    hotel {
        UUID id PK
        INT no
        ENUM division
        VARCHAR name_short
        VARCHAR name_furigana
        VARCHAR name_correct
        VARCHAR caution
        VARCHAR url
        VARCHAR phone_number
        VARCHAR address_number
        VARCHAR address
        VARCHAR address_in_kyoto
        VARCHAR address_city
        VARCHAR address_town
        VARCHAR address_street
        ENUM area_division
        BOOLEAN is_available_solo
        INT price_break
        INT price_stay
        VARCHAR google_maps
        VARCHAR lobby_image
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    
    present_hostess {
        UUID hostess PK_FK
        TIME attend_time PK
        UUID driver FK
        VARCHAR location
        TIME end_time
        TIME home_time
        INT count
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    
    reservation {
        UUID id PK
        UUID hostess FK
        UUID customer FK
        VARCHAR course
        UUID in_driver FK
        UUID out_driver FK
        VARCHAR location
        VARCHAR pickup_location
        DATE reservation_date
        TIME start_time
        TIME end_time
        BOOLEAN is_receipt
        BOOLEAN is_waiting
        BOOLEAN is_arrival_call
        BOOLEAN is_card
        BOOLEAN is_option
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    
    gm_division {
        UUID id PK
        VARCHAR gm_division
        BOOLEAN hostess_type
        VARCHAR web_name
        INT hp_number
        INT sort_order
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
    
    customer {
        UUID id PK
        VARCHAR name
        VARCHAR phone_number
        TIMESTAMPTZ created_at
        TIMESTAMPTZ updated_at
    }
```

## テーブル関係の説明

### 1対多の関係

1. **shop → group**
   - 1つの店舗は複数のグループを持つことができます
   - `group.belongs_shop` → `shop.id`

2. **shop → hostess**
   - 1つの店舗は複数のホステスを所属させることができます
   - `hostess.shop_id` → `shop.id`

3. **staff → staff_car**
   - 1人のスタッフは1台の車を持つことができます（1対1）
   - `staff.vehicle` → `staff_car.id`

4. **staff → hostess**
   - 1人のスタッフ（マネージャー）は複数のホステスを管理できます
   - `hostess.manager` → `staff.id`

5. **staff → present_hostess**
   - 1人のスタッフ（ドライバー）は複数の出勤予定ホステスを迎えることができます
   - `present_hostess.driver` → `staff.id`

6. **staff → reservation**
   - 1人のスタッフ（ドライバー）は複数の予約を担当できます
   - `reservation.in_driver` → `staff.id`
   - `reservation.out_driver` → `staff.id`

7. **hostess → present_hostess**
   - 1人のホステスは複数の出勤予定を持つことができます
   - `present_hostess.hostess` → `hostess.id` (複合主キーの一部)

8. **hostess → reservation**
   - 1人のホステスは複数の予約を持つことができます
   - `reservation.hostess` → `hostess.id`

9. **customer → reservation**
   - 1人の顧客は複数の予約を持つことができます
   - `reservation.customer` → `customer.id`

### 複合主キー

- **present_hostess**
  - 主キー: `(hostess, attend_time)`
  - 同じホステスでも出勤時間が異なれば別レコードとして管理

### パーティショニング

- **reservation**
  - 日付ベースのパーティショニング推奨（月次パーティショニング）
  - `PARTITION BY RANGE (reservation_date)`

### 独立テーブル

- **hotel**: 他のテーブルとの直接的な外部キー関係なし
- **gm_division**: 他のテーブルとの直接的な外部キー関係なし

## テーブル一覧

| テーブル名 | 説明 | 状態 |
|-----------|------|------|
| shop | 店舗テーブル | 定義済み |
| staff | スタッフテーブル | マイグレーション済み |
| staff_car | スタッフ車テーブル | マイグレーション済み |
| group | グループテーブル | 定義済み |
| hostess | ホステステーブル | 未完成 |
| hotel | ホテルテーブル | 定義済み |
| present_hostess | 出勤予定ホステステーブル | 定義済み |
| reservation | 予約リスト | 定義済み |
| gm_division | GM区分テーブル | 定義済み |
| course | コーステーブル | 未定 |
| customer | 顧客テーブル | 参照されているが定義なし |

## 注意事項

1. **customerテーブル**: `reservation`テーブルで参照されているが、`notion-table.md`には定義がありません。追加が必要です。

2. **hostessテーブル**: 「未完成」と記載されており、必要なカラムが不足している可能性があります。

3. **courseテーブル**: 「未定」と記載されており、設計が必要です。

4. **shop.group_no**: `group.number`を参照していますが、外部キー制約の記載がありません。


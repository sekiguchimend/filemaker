# 状態管理ベストプラクティス

このドキュメントでは、Dispatch Business Management System における状態管理のベストプラクティスを説明します。

## 目次

1. [アーキテクチャ概要](#アーキテクチャ概要)
2. [サーバー状態管理（React Query）](#サーバー状態管理react-query)
3. [ローカル状態管理](#ローカル状態管理)
4. [カスタムフックパターン](#カスタムフックパターン)
5. [サービスレイヤー](#サービスレイヤー)
6. [実装例](#実装例)
7. [推奨事項と禁止事項](#推奨事項と禁止事項)

---

## アーキテクチャ概要

このプロジェクトでは、状態管理を以下の3つの層に分けて管理しています：

```
┌─────────────────────────────────────┐
│   UI層（コンポーネント）              │
│   - useState（ローカルUI状態）       │
│   - カスタムフック（ビジネスロジック）│
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   データフェッチング層（React Query） │
│   - useQuery（データ取得）           │
│   - useMutation（データ更新）        │
│   - キャッシュ管理                   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   サービス層（API連携）               │
│   - サービスインターフェース          │
│   - API呼び出し                      │
└─────────────────────────────────────┘
```

---

## サーバー状態管理（React Query）

### 基本原則

**サーバーから取得するデータは必ず React Query を使用する**

- ✅ キャッシュ管理が自動化される
- ✅ ローディング・エラー状態が自動で管理される
- ✅ データの再取得・無効化が簡単
- ✅ 重複リクエストの自動最適化

### React Query Provider の設定

```typescript:front/src/providers/react-query-provider.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // デフォルト1分間キャッシュ
          },
        },
      }),
  )

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
```

### クエリキーの命名規則

**クエリキーは定数として定義し、階層構造で管理する**

```typescript
// ✅ 良い例：定数として定義
const QUERY_KEYS = {
  STORE_BASIC_INFO: 'store-basic-info',
  BASIC_TAGS: 'basic-tags',
  GM_DIVISIONS: 'gm-divisions',
  COURSE_FEES: 'course-fees',
} as const;

// ✅ 良い例：階層構造で使用
queryKey: [QUERY_KEYS.STORE_BASIC_INFO, 'by-name', storeName]
queryKey: [QUERY_KEYS.COURSE_FEES, 'by-store', storeId]

// ❌ 悪い例：文字列リテラルを直接使用
queryKey: ['store-basic-info']
queryKey: ['course-fees']
```

### データ取得フックの実装パターン

```typescript
// ✅ 良い例：単一責任の原則に従う
export function useStoreBasicInfo() {
  return useQuery({
    queryKey: [QUERY_KEYS.STORE_BASIC_INFO],
    queryFn: () => storeLedgerService.getStoreBasicInfo(),
    staleTime: 5 * 60 * 1000, // 5分間キャッシュ
  });
}

export function useStoreBasicInfoByName(storeName: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.STORE_BASIC_INFO, 'by-name', storeName],
    queryFn: () => storeLedgerService.getStoreBasicInfoByName(storeName),
    enabled: !!storeName, // storeNameが存在する場合のみ実行
    staleTime: 5 * 60 * 1000,
  });
}
```

### ミューテーションの実装パターン

```typescript
// ✅ 良い例：キャッシュ無効化を含む
export function useCreateCourseFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseFee: Omit<CourseFee, 'id'>) => 
      storeLedgerService.createCourseFee(courseFee),
    onSuccess: () => {
      // 関連するクエリのキャッシュを無効化
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COURSE_FEES]
      });
    },
  });
}
```

---

## ローカル状態管理

### useState の使用指針

**以下の場合に useState を使用する：**

1. **UI状態**（モーダルの開閉、タブの選択、フォーム入力など）
2. **コンポーネント固有の一時的な状態**
3. **サーバーと同期しない状態**

```typescript
// ✅ 良い例：UI状態
const [isModalOpen, setIsModalOpen] = useState(false);
const [activeTab, setActiveTab] = useState<StoreLedgerTab>('basic');
const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

// ✅ 良い例：フォーム入力状態
const [preferenceForm, setPreferenceForm] = useState<PreferenceForm>({
  rank: 'A',
  favoriteType: '',
  speakingStyle: '',
  dislikedType: ''
});

// ❌ 悪い例：サーバーから取得するデータをuseStateで管理
const [storeList, setStoreList] = useState<Store[]>([]); // これはReact Queryを使うべき
```

### 複雑なローカル状態の管理

**複数の関連する状態がある場合は、カスタムフックに集約する**

```typescript
// ✅ 良い例：関連する状態をまとめる
export function useStoreLedger(initialStore?: string) {
  const [selectedStore, setSelectedStore] = useState<string>(initialStore || '');
  const [activeTab, setActiveTab] = useState<StoreLedgerTab>('basic');
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [editForms, setEditForms] = useState<Record<string, CourseFee>>({});
  
  // React Queryと組み合わせて使用
  const { data: selectedStoreInfo } = useStoreBasicInfoByName(selectedStore);
  
  return {
    selectedStore,
    setSelectedStore,
    activeTab,
    setActiveTab,
    // ...
  };
}
```

---

## カスタムフックパターン

### 基本原則

1. **単一責任の原則**：1つのフックは1つの責務を持つ
2. **再利用性**：複数のコンポーネントで使用できるように設計
3. **型安全性**：TypeScriptの型を適切に使用

### フックの種類

#### 1. データ取得フック（React Query ラッパー）

```typescript
// ✅ 良い例：単一のデータ取得に特化
export function useStoreBasicInfo() {
  return useQuery({
    queryKey: [QUERY_KEYS.STORE_BASIC_INFO],
    queryFn: () => storeLedgerService.getStoreBasicInfo(),
    staleTime: 5 * 60 * 1000,
  });
}
```

#### 2. 複合フック（複数の状態とロジックを統合）

```typescript
// ✅ 良い例：関連する状態と操作をまとめる
export function useStoreLedger(initialStore?: string) {
  // ローカル状態
  const [selectedStore, setSelectedStore] = useState<string>(initialStore || '');
  
  // React Queryでデータ取得
  const { data: selectedStoreInfo } = useStoreBasicInfoByName(selectedStore);
  
  // ミューテーション
  const createCourseFee = useCreateCourseFee();
  
  // ビジネスロジック
  const handleAddCourseFee = async () => {
    // ...
  };
  
  return {
    // 状態
    selectedStore,
    setSelectedStore,
    // データ
    selectedStoreInfo,
    // 操作
    handleAddCourseFee,
  };
}
```

#### 3. UI状態管理フック

```typescript
// ✅ 良い例：UI固有の状態管理
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

---

## サービスレイヤー

### 基本原則

**APIとの連携ロジックはサービス層に分離する**

- ✅ コンポーネントから直接APIを呼び出さない
- ✅ サービスインターフェースを定義して実装を抽象化
- ✅ テストとモックが容易になる

### サービスインターフェースの定義

```typescript
// ✅ 良い例：インターフェースを定義
export interface StoreLedgerService {
  getStoreBasicInfo(): Promise<StoreBasicInfo[]>;
  getStoreBasicInfoByName(storeName: string): Promise<StoreBasicInfo | null>;
  createCourseFee(courseFee: Omit<CourseFee, 'id'>): Promise<CourseFee>;
  updateCourseFee(id: string, updates: Partial<CourseFee>): Promise<CourseFee>;
  deleteCourseFee(id: string): Promise<boolean>;
}
```

### サービス実装

```typescript
// ✅ 良い例：実装クラス
class SampleStoreLedgerService implements StoreLedgerService {
  async getStoreBasicInfo(): Promise<StoreBasicInfo[]> {
    // 実際のAPIでは fetch() を使用
    return Promise.resolve([...storeBasicInfoSampleData]);
  }
  
  async createCourseFee(courseFee: Omit<CourseFee, 'id'>): Promise<CourseFee> {
    const newCourseFee: CourseFee = {
      ...courseFee,
      id: `cf_new_${Date.now()}`
    };
    // 実際のAPIでは POST リクエスト
    courseFeeSampleData.push(newCourseFee);
    return Promise.resolve(newCourseFee);
  }
}

// サービスインスタンスをエクスポート
export const storeLedgerService: StoreLedgerService = new SampleStoreLedgerService();
```

---

## 実装例

### 完全な実装例：店舗台帳管理

```typescript
// 1. サービス層（services/store-ledger-service.ts）
export interface StoreLedgerService {
  getStoreBasicInfo(): Promise<StoreBasicInfo[]>;
  createCourseFee(courseFee: Omit<CourseFee, 'id'>): Promise<CourseFee>;
}

export const storeLedgerService: StoreLedgerService = new SampleStoreLedgerService();

// 2. カスタムフック（hooks/use-store-ledger.tsx）
const QUERY_KEYS = {
  STORE_BASIC_INFO: 'store-basic-info',
  COURSE_FEES: 'course-fees',
} as const;

export function useStoreBasicInfo() {
  return useQuery({
    queryKey: [QUERY_KEYS.STORE_BASIC_INFO],
    queryFn: () => storeLedgerService.getStoreBasicInfo(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateCourseFee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseFee: Omit<CourseFee, 'id'>) => 
      storeLedgerService.createCourseFee(courseFee),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.COURSE_FEES]
      });
    },
  });
}

export function useStoreLedger(initialStore?: string) {
  const [selectedStore, setSelectedStore] = useState<string>(initialStore || '');
  const { data: storeList } = useStoreBasicInfo();
  const createCourseFee = useCreateCourseFee();
  
  const handleAddCourseFee = async () => {
    try {
      await createCourseFee.mutateAsync({
        // ...
      });
    } catch (error) {
      // エラーハンドリング
    }
  };
  
  return {
    selectedStore,
    setSelectedStore,
    storeList,
    handleAddCourseFee,
  };
}

// 3. コンポーネント（app/store-ledger/page.tsx）
export default function StoreLedger() {
  const {
    selectedStore,
    setSelectedStore,
    storeList,
    handleAddCourseFee,
  } = useStoreLedger();
  
  return (
    <div>
      {/* UI実装 */}
    </div>
  );
}
```

---

## 推奨事項と禁止事項

### ✅ 推奨事項

1. **サーバー状態は React Query で管理**
   - データ取得：`useQuery`
   - データ更新：`useMutation`
   - キャッシュ無効化：`queryClient.invalidateQueries`

2. **クエリキーは定数として定義**
   ```typescript
   const QUERY_KEYS = {
     STORE_BASIC_INFO: 'store-basic-info',
   } as const;
   ```

3. **サービス層でAPIロジックを分離**
   - コンポーネントから直接APIを呼び出さない
   - インターフェースを定義して実装を抽象化

4. **カスタムフックでロジックを集約**
   - 複数のコンポーネントで使用するロジックはフックに抽出
   - 単一責任の原則に従う

5. **型安全性を確保**
   - `any` 型は原則禁止
   - 適切な型定義を使用

6. **エラーハンドリングを実装**
   ```typescript
   try {
     await mutation.mutateAsync(data);
   } catch (error) {
     // エラーハンドリング
   }
   ```

### ❌ 禁止事項

1. **サーバー状態を useState で管理しない**
   ```typescript
   // ❌ 悪い例
   const [storeList, setStoreList] = useState<Store[]>([]);
   useEffect(() => {
     fetch('/api/stores').then(res => res.json()).then(setStoreList);
   }, []);
   
   // ✅ 良い例
   const { data: storeList } = useStoreBasicInfo();
   ```

2. **クエリキーを文字列リテラルで直接使用しない**
   ```typescript
   // ❌ 悪い例
   queryKey: ['store-basic-info']
   
   // ✅ 良い例
   queryKey: [QUERY_KEYS.STORE_BASIC_INFO]
   ```

3. **コンポーネント内で直接APIを呼び出さない**
   ```typescript
   // ❌ 悪い例
   const fetchData = async () => {
     const response = await fetch('/api/stores');
     const data = await response.json();
     setStoreList(data);
   };
   
   // ✅ 良い例
   const { data: storeList } = useStoreBasicInfo();
   ```

4. **ミューテーション後にキャッシュを無効化しない**
   ```typescript
   // ❌ 悪い例
   const mutation = useMutation({
     mutationFn: createCourseFee,
     // onSuccessがない
   });
   
   // ✅ 良い例
   const mutation = useMutation({
     mutationFn: createCourseFee,
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COURSE_FEES] });
     },
   });
   ```

5. **型定義を省略しない**
   ```typescript
   // ❌ 悪い例
   const [data, setData] = useState(null);
   
   // ✅ 良い例
   const [data, setData] = useState<StoreBasicInfo | null>(null);
   ```

---

## まとめ

このプロジェクトでは、以下の原則に従って状態管理を行います：

1. **サーバー状態** → React Query（TanStack Query）
2. **ローカルUI状態** → useState
3. **ビジネスロジック** → カスタムフック
4. **API連携** → サービスレイヤー

このアーキテクチャにより、以下のメリットが得られます：

- ✅ コードの再利用性が向上
- ✅ テストが容易になる
- ✅ 型安全性が確保される
- ✅ パフォーマンスが最適化される
- ✅ メンテナンスが容易になる

---

## 参考資料

- [React Query 公式ドキュメント](https://tanstack.com/query/latest)
- [React Hooks 公式ドキュメント](https://react.dev/reference/react)
- [TypeScript 公式ドキュメント](https://www.typescriptlang.org/docs/)


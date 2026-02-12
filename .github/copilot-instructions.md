## サイトの概要

Next.js と Tailwind CSS を使用した、「AIプログラミング体験」を生徒に提供するためのWebサイト。

## Launguage

日本語を使用してください。

## 実装

実装後にエラーが残っている場合は、原因を調査して修正してください。

## デザイン

デザインは HeroUI または Tailwind CSS を使用してください。
cssファイルを勝手に生成したり編集したりしないでください。

可能な限り、UIコンポーネントはHeroUIを使用してください。
https://www.heroui.com/

## UI Components

指示がない限り、UI Componentsファイルは生成せず、基本的には対象のpage.tsxファイルでUIを実現してください。
components/ フォルダに勝手にファイルを生成したりしないでください。

## Admin

/admin0b9w489v83D3A 以下は管理者ページです。
/admin0b9w489v83D3A 以下でページを作成する場合は、必ずAdminAuthを用いた管理者認証を実装してください。

## Firebase Auth

認証関連は、hosting/repository/FirebaseAuthRepository.ts を利用・実装してください。

## Firestore

データベース関連は、hosting/repository/FireStoreRepository.ts を利用・実装してください。
Admin用のデータベース操作は hosting/repository/FireStoreAdminRepository.ts を利用・実装してください。

## Model

データモデルは hosting/model/ フォルダに作成してください。
作成するEntityには、id, createdAt, updatedAtフィールドを必ず含めてください。
Firestoreからの変換処理は hosting/util/ フォルダにConverterクラスを作成して実装してください。

## Enum

列挙型は hosting/enum/ フォルダに作成してください。

## toast

Toastは @heroui/toast を使用してください。
認証の成功・失敗や、データの保存成功・失敗などのユーザーへの通知にはToastを使用してください。

また、toastは以下のようなstatusはエラーになるので注意してください。
NG: `addToast({ title: "ログインに成功しました", status: "success" });`
OK: `addToast({ title: "ログインに成功しました", color: "success" });`

## Loading

ローディング表示には HeroUI の Spinner コンポーネントを使用してください。
API通信中はローディング表示するようにしてください。
ローディング中は、ユーザーがコンテンツに触れられないように黒透明背景を設置してください。

例:

```tsx
{isLoading && (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
    <Spinner
      color="primary"
      label="simple"
      size="lg"
    />
  </div>
)}
```
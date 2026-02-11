## Launguage

日本語を使用してください。

## デザイン

デザインは HeroUI または Tailwind CSS を使用してください。
cssファイルを勝手に生成したり編集したりしないでください。

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
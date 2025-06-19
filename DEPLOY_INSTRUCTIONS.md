# 🚀 手動デプロイ手順

## 📦 デプロイ用ファイル

`cognito-tutorial-deploy.zip` (87KB) がデプロイ用のファイルです。

## 🛠️ AWS Amplify 手動デプロイ手順

### 1. AWS Amplifyコンソールにアクセス
1. AWS マネジメントコンソールにログイン
2. AWS Amplify サービスに移動
3. 「新しいアプリケーション」→「アプリケーションをデプロイ」を選択

### 2. デプロイタイプの選択
1. 「Build settings」で「Manual deployment」を選択
2. または既存のアプリがある場合は「Manual deployment」タブを選択

### 3. zipファイルのアップロード
1. `cognito-tutorial-deploy.zip` をドラッグ&ドロップ
2. アプリケーション名を入力（例：`cognito-oidc-tutorial`）
3. 環境名を入力（例：`main`）
4. 「保存してデプロイ」をクリック

### 4. デプロイ後の設定

#### 4.1 Amplify URLの確認
デプロイが完了したら、以下のような形式のURLが生成されます：
```
https://main.d1234567890abcd.amplifyapp.com
```

#### 4.2 Cognitoの設定更新
1. AWS Cognitoコンソールに移動
2. 作成したユーザープールを選択
3. 「アプリケーションの統合」→「アプリケーションクライアント」を選択
4. **コールバックURL**を更新：
   ```
   https://main.d1234567890abcd.amplifyapp.com/
   ```
5. **ログアウトURL**を更新：
   ```
   https://main.d1234567890abcd.amplifyapp.com/
   ```

#### 4.3 環境変数の設定（オプション）
Amplifyコンソールで環境変数を設定する場合：
1. アプリケーション設定 → 環境変数
2. 以下を追加：
   ```
   VITE_COGNITO_USER_POOL_ID = ap-northeast-1_xxxxxxxxx
   VITE_COGNITO_USER_POOL_CLIENT_ID = xxxxxxxxxxxxxxxxxxxxxxxxxx
   VITE_COGNITO_DOMAIN = oidc-tutorial-auth.auth.ap-northeast-1.amazoncognito.com
   ```

### 5. テストユーザーの作成

```bash
aws cognito-idp admin-create-user \
  --user-pool-id YOUR_USER_POOL_ID \
  --username testuser \
  --user-attributes Name=email,Value=test@example.com \
  --temporary-password TempPass123! \
  --message-action SUPPRESS

# パスワードを永続化
aws cognito-idp admin-set-user-password \
  --user-pool-id YOUR_USER_POOL_ID \
  --username testuser \
  --password NewPassword123! \
  --permanent
```

### 6. 動作確認
1. デプロイされたAmplify URLにアクセス
2. 「ログイン」ボタンをクリック
3. Cognitoのログイン画面でテストユーザーでログイン
4. 認証成功後、限定コンテンツが表示されることを確認

## 🔧 トラブルシューティング

### よくある問題

1. **「設定が未完了」エラー**
   - Terraformが正しく適用されているか確認
   - コールバックURLがAmplify URLと一致しているか確認

2. **ログイン後にエラー**
   - CognitoコンソールでリダイレクトURL設定を確認
   - ブラウザのデベロッパーツールでエラーを確認

3. **認証ループ**
   - コールバックURLの末尾に `/` があることを確認
   - OAuth設定でCORS設定を確認

## 📝 注意事項

- デプロイ後は、必ずCognitoのコールバックURLを更新してください
- 環境変数を設定する場合は、デプロイ後に再ビルドが必要です
- テスト用のユーザーアカウントは本番環境では削除してください

## 🔄 再デプロイ

ソースコードを変更した場合：
1. `bun run build` でビルド
2. `cd dist && zip -r ../cognito-tutorial-deploy.zip . && cd ..` でzipファイル更新
3. Amplifyコンソールで新しいzipファイルをアップロード 

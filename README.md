# まち時間 Pharmacy

薬局の待ち時間に、受付状況・周辺案内・お薬クイズ・検査値ガイドを見られる静的ブラウザアプリです。

GitHub Pages ではリポジトリの **Settings → Pages → Deploy from a branch → main / (root)** を選ぶと公開できます。

## 受付番号について

このGitHub版は、患者さんが番号を端末内で再確認できる画面です。薬局全体でリアルタイムに番号を共有するには、Supabase などのデータベースを接続してください。`app.js` の `ticketStatuses` は移行時の仮データです。

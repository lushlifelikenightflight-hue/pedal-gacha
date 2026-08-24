# PEDAL FORGE

公開版: https://lushlifelikenightflight-hue.github.io/pedal-gacha/

選んだ因子から、実在しそうなオリジナルエフェクターを錬成するブラウザ3D工房です。

## できること

- 楽器、機能系統、音の核、外装色、気分から一台を錬成
- 各項目の「おまかせ」は既定値ではなく最大自由度として抽選
- 12種のDesign Archetypeに加え、実機写真から抽出した8種のHardware Culture、7種の命名形式、各色5パレット、複数の書体・操作配置を組み合わせ
- 直近8台と筐体・操作配置・配色・命名が似すぎる場合は自動再抽選
- OWNER MARK未入力時は`ANON`を印刷せず、シリーズ表記も個体ごとに省略または変更
- 音の抽出、回路安定化、筐体鋳造、操作部品配置、刻印という工程演出
- 錬成炉から形成され、斜め上のスポットライトで完成品をお披露目
- CLASSIC STOMP、BIG BOX、TREADLE STOMP、DIGITAL MULTI、MINI BOUTIQUE、LAB UTILITY、GRAPHIC BOX、DIY CUSTOMの8系統
- ミニ筐体、大型箱、踏面一体型、画面・ナビゲーション付き、8ノブのDI／プリアンプ型など、機能と連動する専用造形
- エフェクト種別とHardware Cultureから筐体、1〜8ノブ、機能グループ、表示器、スイッチ数を決める実機準拠テンプレート
- ワッシャー、六角ナット、ブッシング、奥まった穴を持つ1/4インチ標準ジャック
- INPUT／OUTPUT／9V DCを明記した上部または左右の接続構成
- 実寸比を拡大し、十分な高さ、根元ワッシャー、側壁、トップキャップ、指標線を備えた回転ノブ
- SWISS、INDUSTRIAL、BRUTALIST、SCIENTIFIC、RISOGRAPH、PSYCHEDELIC、MINIMAL SYMBOL、ILLUSTRATIONの8アートディレクション
- NONE、TYPOGRAPHY、LOGO HEAVY、SMALL CHARACTER、SYMBOL、FULL GRAPHIC、TECHNICAL LABELを系統ごとに抽選
- FACTORY NEWからDIY MODIFIEDまで、傷・交換部品・個体感を表すコンディション因子
- 製品名、ノブラベル、OWNER MARK、ブランド表示を背景アートと別レイヤーで合成
- Design DNAとデザイン整合スコア、接続構成、内部生成値を錬成仕様に表示
- 3Dモデルをドラッグ／スワイプで回転、ホイール／ピンチで拡大縮小
- 全幅の錬成条件セクションと、その下に最低80dvhを確保した独立3D展示室
- 錬成工程中も同じWebGLキャンバスを維持し、完成時にモデルだけが消えるコンテキスト再生成を防止
- 同じSEEDから同じ個体を再錬成
- ブラウザ内アーカイブ、PNG、PDF錬成仕様書

すべてブラウザ内で動作します。外部API、ログイン、サーバーデータベースは不要です。

## 開発

```bash
npm install
npm run dev
```

## 検証

```bash
npm run typecheck
npm run build
```

## 技術構成

- React + TypeScript + Vite
- Three.js / React Three Fiber
- GSAP
- jsPDF
- LocalStorage

## 初期版の範囲

このバージョンは外観と仕様を錬成する「まず遊べる版」です。Web Audioによる実音処理、オンライン同期、外部AIによる自由生成は将来拡張として分離しています。

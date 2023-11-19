# Simple Database Server for Google App Script
## 概要
このプロジェクトをGoogleAppScriptのWebアプリケーションとしてデプロイすることで、サーバーレスなデータストアを構築できます。

たとえば、静的なホームページサーバを運用する場合に、
このシステムに動的なデータを保管しておけば、動的なコンテンツを提供することができます。

## 定義
Google Spread Sheet（以下、Spread Sheet）
Google App Script（以下、GAS）

## 始め方
1. Google Spread Sheet および GAS を作成
2. GAS に main.js のソースコードをコピー
3. init() を実行して初期化
4. 必要な設定を行う [設定項目はこちら](#設定)
5. Webアプリケーションとしてデプロイ

## 設定
|変数|概要|
|---|---|
|SpreadSheetID|Spread Sheet の ID <br>データベースやシステムの設定のためのシートを保管します|
|DatabaseSheetName|Spread Sheet の Sheet 名 - リソースデータベース|
|AccessKeyStoreSheetName|Spread Sheet の Sheet 名 - アクセスキーデータベース<br>Default: `accesskeys`|

### リソースへのアクセスを制限する
リソースにアクセスするために、簡易的なアクセスキーを設定することができます。デフォルトでは全員がリソースにアクセスできるのでご注意ください。
アクセスキーの設定は、デフォルトでは `accesskeys` シートで行います。
[AccessKeyStoreSheetName](#設定)を変更している場合、この値のシート名になります。

#### 制限の設定方法
1. Spread Sheet > `accesskeys` ([AccessKeyStoreSheetNameに設定した値](#設定)) を開きます。
2. ２行目に設定されている `default` : `everyone` を削除します。
    * アクセスキーを１つも設定しなかった場合、だれもそのリソースにアクセスすることができなくなります。

#### 制限の撤廃方法
1. Spread Sheet > `accesskeys` ([AccessKeyStoreSheetNameに設定した値](#設定)) を開きます。
2. 次の行を追加します。(`keyname`, `keyvalue`) = (`default`, `everyone`)<br>
    * `keyname` の値は任意です。

## リソースへのアクセス方法
リソースへのアクセスは、HTTP/GETリクエストで行います。
GASでデプロイしたときに生成されるWebアプリケーションのURLに、必要に応じてURLパラメータを付加することができます。[利用できるURLパラメータ](#)

以下は JavaScript でリソースにアクセスする例です。
```javascript
    const url = "https://script.google.com/macros/s/~~~~~/exec";
    fetch(url + "?accesskey=hogehoge")
        .then(response => response.json())
        .then(data => console.log(data));
```

### パラメータ
+ `accesskey`
    (String Optional)
    アクセスキーを指定します
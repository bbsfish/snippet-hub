# My DBMS for Google App Script
## 概要
Google Spread Sheet と Google App Script で DBMS のような仕組みを構築できます。
Google Spread Sheet を データベースとして使う場合に、Google App Script から簡単に操作可能できるようにするコードセットです。

## 始め方
1. Google Spread Sheet を作成し、新規シートを作成します。
    これがデータベースファイルとなります。
    シートの A列 と B列 はそれぞれ、`id` と `update` ととして、システムが使うため、コンテンツデータを入れられません。
    |   | A | B | C | D | E |
    |---|---|---|---|---|---|
    | 1 |///|///|   |   |   |
    | 2 |///|///|   |   |   |
    | 3 |///|///|   |   |   |
    ...
2. シートの１行目はカラム名を記述することができます。
    Required以降のカラムには、自由に値を入れることができます。
    |セル|カラム名||||
    |---|---|---|---|---|
    |A1|ID|システムが特定するためのUUIDが入ります|
    |B1|更新日|Date-Time|Required|最終更新日時|
    |C1|KEY|String|Example|カラムの例です, このように、以降を続けます|

 [A] ID (String), [B] 更新日 (Date-Time), [C] {任意} (String) ...
    3. 基本的にはIDをキーとして、値を保管する形で利用する. (例) ID: {Val1, Val2..} のように
    ＊変数説明＊
    MyDbms.sname = 編集対象のスプレッドシートID(String)
    MyDbms.sname = 対象となるシート名(String)
`main.js` の `MyDbms` というクラスを、あなたのGASプロジェクト内にコピーするだけです

## 使い方
このコードセットは、たったひとつのclassです。
クラスをコンストラクトするだけで使えます。
以下は、<`ID`, `更新日`, `Key`, `Value`>というテーブルを利用する場合のサンプルです。

```javascript
    const Md = new MyDbms("your-spread-sheet-id", "your-sheet-name");

    Md.insert(["exp", 500], "id-100");
    
    const row = Md.select("id-100");
    console.log("row of id-100: ", row);
```

## METHODS
+ `select`
    + `ID` を指定して行データを取得します。
        該当する行が複数ある場合は、最初のひとつのみ返し、見つからない場合は `null` を返します。
    + Arguments
        1. `id` String Required データの固有IDを指定
        2. `strict` Boolean Optional 厳格モード。シートからデータを読みだしなおすことを強制するためには`true`を指定します。デフォルト値は`false`。
    + Return
        + `Array(String)` | `null`
+ `selects`
    + `ID` を指定して、該当する行データをすべて取得します。
        見つからない場合は `null` を返します。
    + Arguments
        1. `id` String Required データの固有IDを指定
        2. `strict` Boolean Optional 厳格モード。シートからデータを読みだしなおすことを強制するためには`true`を指定します。デフォルト値は`false`。
    + Return
        + `Array( Array(String) )` | `null`
+ `update`
    + `ID` を指定して、該当する行データを更新します。更新した時は`true`を返し、それ以外は`false`を返します。
    + Arguments
        1. `id` String Required データの固有IDを指定
        2. `new_row_array` Array(String) Required 更新する行データの内容を指定します。指定するには、`ID`, `更新日` 以外の値を配列にして渡します。
    + Return
        + `Boolean`
+ `remove`
    + `ID` を指定して、該当する行データを削除します。削除した時は`true`を返し、それ以外は`false`を返します。

+ `insert`
    + 行データを追加します。`ID`, `更新日` 以外の値を配列にして渡すことで挿入されます。`ID`は自動生成されますが、指定して挿入することもできます。
    + Arguments
        1. `new_row_array` Array(String) Required 追加する行データ。`ID`, `更新日` 以外の値を配列にして渡す。
        2. `id` String Optional 挿入する行データのIDを指定します。
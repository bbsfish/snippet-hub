/*
    データベース管理スクリプト
    ＊使い方＊
    1. スプレッドシートを作成（これがDBファイルとなる）。
    2. シートの１行目にカラム名を入力。設定ルールは以下：
    [A] ID (String), [B] 更新日 (Date-Time), [C] {任意} (String) ...
    3. 基本的にはIDをキーとして、値を保管する形で利用する. (例) ID: {Val1, Val2..} のように
    ＊変数説明＊
    MyDbms.sname = 編集対象のスプレッドシートID(String)
    MyDbms.sname = 対象となるシート名(String)
*/

class MyDbms {
    constructor(book_id = "", sheet_name = "") {
        this.ssid = book_id;
        this.sname = sheet_name;
        this.cmx = -1;
        this.data = null;
        this.ssBook = null;
        this.ssSheet = null;
    };

    // Return = SpreadsheetApp Object ;
    init() {
        if (this.ssBook == null) {
            this.ssBook = SpreadsheetApp.openById(this.ssid);
            this.ssSheet = this.ssBook.getSheetByName(this.sname);
        }
        if (this.cmx == -1) {
            this.cmx = this.ssSheet.getLastColumn();
        }
        return this.ssSheet;
    };

    // Return = null | [[]] ;
    read() {
        const sheet = this.init();
        const lastRow = sheet.getLastRow();
        if (lastRow <= 1) return null;
        return sheet.getRange(2, 1, lastRow - 1, this.cmx).getValues(); // [A] ~ last
    };

    // Return = null | [[]] ;; Args = strict: boolean (false*: 読み速度優先, true: 正確さ優先)
    stack(strict = false) {
        if (strict || this.data == null) {
            // データロード  正確モード||データロード未実施
            this.data = this.read();
        }
        return this.data;
    };

    // Return = null | [] ;; Args = id: String (検索ID), strict: boolean (false*: 読み速度優先, true: 正確さ優先)
    select(id = "", strict = false) {
        let datas = null;
        if (strict) {
            // 正確モード
            const sheet = this.init();
            const lastRow = sheet.getLastRow();
            if (lastRow <= 1) return null;
            datas = sheet.getRange(2, 1, lastRow - 1, this.cmx).getValues(); // [A] ~ last
        } else {
            // 高速モード
            datas = this.stack(); // [A] ~ last, 全取得[[]]
        }
        if (!datas) return null;
        for (let d of datas) { if (d[0] == id) return d; }
    }

    // Return = null | [[]] ;; Args = id: String (検索ID), strict: boolean (false*: 読み速度優先, true: 正確さ優先)
    selects(id = "", strict = false) {
        let datas = null;
        if (strict) {
            // 正確モード
            const sheet = this.init();
            const lastRow = sheet.getLastRow();
            if (lastRow <= 1) return null;
            datas = sheet.getRange(2, 1, lastRow - 1, this.cmx).getValues(); // [A] ~ last
        } else {
            // 高速モード
            datas = this.stack();
        }
        if (!datas) return null;
        if (id == "*") { return datas; }
        else { return datas.filter((v) => { return v[0] == id }); }
    }

    // Return = boolean ;; Args = id: String (検索ID), new_row_array: Array (更新したいデータ内容)
    update(id = "", new_row_array = []) {
        const sheet = this.init();
        if (new_row_array.length < this.cmx - 2) return false;
        let dd = new Date();
        let appendQuery = [id, dd].concat(new_row_array);
        const lastRow = sheet.getLastRow();
        if (lastRow <= 1) return false;
        const datas = sheet.getRange(2, 1, lastRow - 1, this.cmx - 2).getValues();
        const dataIndex = datas.findIndex((v) => { return v[0] == id });
        if (dataIndex < 0) return false;  // データがマッチしない場合は除外
        sheet.getRange(dataIndex + 2, 1, 1, this.cmx).setValues([appendQuery]); // データ更新 [A] ~ last
        return true;
    }

    // Return = boolean ;; Args = id: String (対象行のID)
    remove(id = "") {
        const sheet = this.init();
        const lastRow = sheet.getLastRow();
        if (lastRow <= 1) return false;
        const datas = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
        const dataIndex = datas.findIndex((value) => value == id)
        if (dataIndex < 0) return false; // データがマッチしない場合は除外
        sheet.deleteRow(dataIndex + 2);
        return true;
    }

    // Return = null | String(挿入id) ;; Args = id: String (検索ID), new_row_array: Array (挿入したいデータ内容)
    insert(new_row_array = [], new_id = "") {
        const sheet = this.init();
        if (new_row_array.length > this.cmx - 2) return null;
        let dd = new Date();
        let id = (new_id != "") ? new_id : Utilities.getUuid();
        let appendQuery = [id, dd].concat(new_row_array);
        sheet.appendRow(appendQuery);
        return id;
    }
}
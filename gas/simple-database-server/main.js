const SpreadSheetID = "your-spreadsheet-book-id";
const DatabaseSheetName = "your-spreadsheet-sheet-name";
const AccessKeyStoreSheetName = "accesskeys"; // Sheet name of accesskey list (default: "accesskeys")

const Logger = BetterLog.useSpreadsheet(SpreadSheetID); 


const init = function () {

    const Ss = SpreadsheetApp.openById(SpreadSheetID);

    if (Ss.getSheetByName(AccessKeyStoreSheetName)) {
        console.error(`Sheet name "${AccessKeyStoreSheetName}" already exists. Please delete the sheet or set a different accesskey sheet name.`);
        return;
    }

    const newSheet = Ss.insertSheet();
    newSheet.setName(AccessKeyStoreSheetName);

    newSheet.getRange("A1:B1").setValues([["keyname", "keyvalue"]]);
    newSheet.getRange("A2:B2").setValues([["default", "everyone"]]);
}

function doGet(e) {
    const parameters = e.parameter;
    
    const verify = function () {
      const inputkey = (parameters.hasOwnProperty("accesskey")) ? parameters.accesskey : "everyone";
      const KeyStoreSQL = SpreadSheetsSQL.open(SpreadSheetID, AccessKeyStoreSheetName);
      const result = KeyStoreSQL.select(["keyname", "keyvalue"]).filter("keyvalue = " + inputkey).result();

      return (result.length > 0);
    }

    let payload;

    if (verify()) {
      const SsSheet = SpreadsheetApp.openById(SpreadSheetID).getSheetByName(DatabaseSheetName);
      const columns = SsSheet.getRange(1, SsSheet.getLastColumn()).getValues();

      const DatabaseSQL = SpreadSheetsSQL.open(SpreadSheetID, DatabaseSheetName);
      const data = DatabaseSQL.select(columns[0]).result();

      payload = data;
    } else {
      Logger.log("Authentication denied");

      payload = {
        error: 401,
        message: "Authentication denied"
      }
    }


    return doOutput(payload);
}

function doOutput(object) {
    ContentService.createTextOutput();

    const output = ContentService.createTextOutput();
    output.setMimeType(ContentService.MimeType.JSON);

    const payload = JSON.stringify(object);
    output.setContent(payload);

    return output
}

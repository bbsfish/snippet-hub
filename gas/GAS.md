# clasp
npm module for gas application development

[Document - GitHub](https://github.com/google/clasp)


## how to install clasp
1. Config - Enable Google Apps Script API
https://script.google.com/home/usersettings

2. install packages
    ```bash:
    npm init --save
    npm install @google/clasp
    npm install @types/google-apps-script
    ```

3. Google account authentication
    ```bash:
    npx clasp login
    ```
    Browser starts.

    allow access from clasp.

    Use `npx` to use locally installed clasp


## make application
1. Create script
    ```bash:
    clasp create
    ```
    Select optional script type


## useful gas libraly note for me
|Libraly Name|Script ID|Document|
|---|---|---|
|BetterLog|1DSyxam1ceq72bMHsE6aOVeOl94X78WCwiYPytKi7chlg4x5GqiNXSw0l|[GitHub](https://github.com/peterherrmann/BetterLog)|
|spreadsheets-sql|17p1ghyOkbWOhdE4bdBFhOXL079I-yt5xd0LAi00Zs5N-bUzpQtN7iT1a|[GitHub](https://github.com/roana0229/spreadsheets-sql)|
|LineBotSDK|1EvYoqrPLkKgsV8FDgSjnHjW1jLp3asOSfDGEtLFO86pPSIm9PbuCQU7b|[GitHub](https://qiita.com/kobanyan/items/1a590cda9deb85e86296)|
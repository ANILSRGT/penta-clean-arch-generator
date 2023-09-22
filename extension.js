// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is execute

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log("Penta Clean Arch is now active!");
  let disposable = vscode.commands.registerCommand("penta-clean-arch-generator--flutter-dart-.cleanArch", res =>
    cleanArchGenerate(res.fsPath)
  );

  disposable = vscode.commands.registerCommand("penta-clean-arch-generator--flutter-dart-.cleanArchWithFeature", res =>
    cleanArchGenerate(res.fsPath, true)
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {
  console.log("Penta Clean Arch is now inactive!");
}

async function cleanArchGenerate(path, isFeature = false) {
  const featureName = await vscode.window.showInputBox({
    prompt: "Enter the name of the feature",
    placeHolder: "Feature name",
  });

  if (!featureName) {
    vscode.window.showErrorMessage("You must enter a name");
    return;
  }

  createCleanArchFolders(path, featureName, isFeature);

  vscode.window.showInformationMessage("Generated Clean Arch Files.");
}

function createCleanArchFolders(folderPath, featureName, isFeature) {
  folderPath = isFeature ? path.join(folderPath, featureName) : folderPath;

  const domainPath = path.join(folderPath, "domain");
  const dataPath = path.join(folderPath, "data");
  const presentationPath = path.join(folderPath, "presentation");

  const domainEntityPath = path.join(domainPath, "entities");
  const domainUsecasePath = path.join(domainPath, "usecases");
  const domainRepositoryPath = path.join(domainPath, "repositories");

  const dataDatasourcePath = path.join(dataPath, "datasources");
  const dataModelPath = path.join(dataPath, "models");
  const dataRepositoryPath = path.join(dataPath, "repositories");

  const dataDatasourceRemotePath = path.join(dataDatasourcePath, "remote");
  const dataDatasourceLocalPath = path.join(dataDatasourcePath, "local");

  const presentationPagePath = path.join(presentationPath, "pages");
  const presentationWidgetPath = path.join(presentationPath, "widgets");

  const paths = [];

  if (isFeature) paths.push(folderPath);
  paths.push(domainPath);
  paths.push(dataPath);
  paths.push(presentationPath);
  paths.push(domainEntityPath);
  paths.push(domainUsecasePath);
  paths.push(domainRepositoryPath);
  paths.push(dataDatasourcePath);
  paths.push(dataModelPath);
  paths.push(dataRepositoryPath);
  paths.push(dataDatasourceRemotePath);
  paths.push(dataDatasourceLocalPath);
  if (!isFeature) paths.push(presentationPagePath);
  paths.push(presentationWidgetPath);

  paths.push(path.join(domainEntityPath, `${featureName}_entity.dart`));
  paths.push(path.join(domainRepositoryPath, `${featureName}_repository.dart`));
  paths.push(path.join(dataDatasourceRemotePath, `${featureName}_remote_datasource.dart`));
  paths.push(path.join(dataDatasourceLocalPath, `${featureName}_local_datasource.dart`));
  paths.push(path.join(dataModelPath, `${featureName}_model.dart`));
  paths.push(path.join(dataRepositoryPath, `${featureName}_repository_impl.dart`));
  if (isFeature) paths.push(path.join(presentationPath, `${featureName}_view.dart`));

  paths.forEach(element => {
    if (!fs.existsSync(element)) {
      if (element.includes(".dart")) {
        fs.writeFileSync(element, "");
      } else {
        fs.mkdirSync(element, { recursive: true });
      }
    }
  });
}

module.exports = {
  activate,
  deactivate,
};

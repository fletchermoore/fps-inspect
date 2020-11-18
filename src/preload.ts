"use strict";
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
var dialog = require('electron').remote.dialog;

interface Window {
    selectFile(): [string] | undefined;
    decomposeMp4(path: string): any;
}


window.addEventListener('DOMContentLoaded', function () {
    var replaceText = function (selector : string, text : string) {
        var element = document.getElementById(selector);
        if (element)
            element.innerText = text;
    };
    for (var _i = 0, _a = ['chrome', 'node', 'electron']; _i < _a.length; _i++) {
        var type = _a[_i];
        replaceText(type + "-version", process.versions[type as keyof NodeJS.ProcessVersions]);
    }
});

window.selectFile = function () {
    return dialog.showOpenDialogSync({ properties: ['openFile', 'multiSelections'] });
};

window.decomposeMp4 = function (path : string) {

}

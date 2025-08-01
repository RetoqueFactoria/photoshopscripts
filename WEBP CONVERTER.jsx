/*
Batch Save As WebP scriptUI GUI v1-9.jsx
Stephen Marsh
https://community.adobe.com/t5/photoshop-ecosystem-discussions/export-many-files-at-once-in-webp-format-photoshop/td-p/13604411/page/4#U14859793
v1.0 - 14th March 2023: Initial release.
v1.1 - 11th January 2024: Added a "fit image" step defaulting to 1920px to proportionally resize the longest edge of each image to the specified value.
v1.2 - 10th February 2024: Added an explicit step to change to RGB mode.
v1.3 - 12th September 2024: User "filduarte" Added ScriptUI and user input for max image size, resolution and quality.
v1.4 - 13th September 2024: Inspired by "filduarte", added various GUI control options. All files saved as 8bpc sRGB, overwriting existing WebP files of the same name without warning.
v1.5 - 21st September 2024: Changed the dropdown to use label names rather than compression values as names. Removed the Save a Copy checkbox.
v1.6 - 11th October 2024: Added dropdown menus to optionally run an action on each file before saving as WebP. Cosmetic GUI layout changes to reduce the vertical depth of the window.
v1.7 - 5th November 2024: Moved the folder selection buttons to the left of the path display fields.
v1.8 - 11th April 2025: Added a dropdown to select to either convert to sRGB space or keep the current RGB space before saving.
v1.9 - 31st July 2025: Bugfix in the convert to sRGB space option. Progress bar execution corrected and code updated.
*/

#target photoshop

// Ensure that version 2022 or later is being used
var versionNumber = app.version.split(".");
var versionCheck = parseInt(versionNumber[0]);

if (versionCheck < 23) {
    alert("You must use Photoshop 2022 or later to save using native WebP format...");

} else {
    // Create the ScriptUI dialog window
    var theDialogWin = new Window("dialog", "WebP Batch Processor (v1.9)");

    theDialogWin.orientation = "column";
    theDialogWin.alignChildren = "left";

    // Input Folder Section
    var inputFolderPanel = theDialogWin.add("panel", undefined, "Input Folder");
    inputFolderPanel.orientation = "column";
    inputFolderPanel.alignChildren = ["fill", "top"]; // Align all children to fill the width
    inputFolderPanel.alignment = ["fill", "top"]; // Make the panel itself fill the width

    inputFolderPanel.add("statictext", undefined, "Select the source image folder to process:");
    var inputFolderRow = inputFolderPanel.add("group"); // Create a row for input field and button
    inputFolderRow.orientation = "row";
    inputFolderRow.alignment = ["fill", "top"]; // Make the row fill the width

    var inputFolderButton = inputFolderRow.add("button", undefined, "Browse...");
    inputFolderButton.alignment = ["left", "top"]; // Align button to the right

    var inputFolderText = inputFolderRow.add("edittext", undefined, "");
    inputFolderText.characters = 30;
    inputFolderText.alignment = ["fill", "top"]; // Make the input field fill available width

    // Process Subfolders Checkbox
    var recursiveCheckbox = inputFolderPanel.add("checkbox", undefined, "Include all subfolders");
    recursiveCheckbox.value = false; // Default to not recursive

    // Output Folder Section
    var outputFolderPanel = theDialogWin.add("panel", undefined, "Output Folder");
    outputFolderPanel.orientation = "column";
    outputFolderPanel.alignChildren = ["fill", "top"]; // Align all children to fill the width
    outputFolderPanel.alignment = ["fill", "top"]; // Make the panel itself fill the width

    outputFolderPanel.add("statictext", undefined, "Select the location to save the WebP files:");
    var outputFolderRow = outputFolderPanel.add("group"); // Create a row for output field and button
    outputFolderRow.orientation = "row";
    outputFolderRow.alignment = ["fill", "top"]; // Make the row fill the width

    var outputFolderButton = outputFolderRow.add("button", undefined, "Browse...");
    outputFolderButton.alignment = ["left", "top"]; // Align button to the right

    var outputFolderText = outputFolderRow.add("edittext", undefined, "");
    outputFolderText.characters = 30;
    outputFolderText.alignment = ["fill", "top"]; // Make the input field fill available width

    // Mirror Directory Structure Checkbox
    var mirrorStructureCheckbox = outputFolderPanel.add("checkbox", undefined, "Retain the source subfolder structure");
    mirrorStructureCheckbox.value = false; // Default to not mirroring
    mirrorStructureCheckbox.enabled = false; // Disable by default

    // Enable/Disable "Mirror Structure" based on the recursive option
    recursiveCheckbox.onClick = function () {
        mirrorStructureCheckbox.enabled = recursiveCheckbox.value;
    };

    // Create a panel for the compression settings
    var compressionPanel = theDialogWin.add("panel", undefined, "Compression Settings");
    compressionPanel.orientation = "column";
    compressionPanel.alignChildren = ["left", "top"]; // Align controls to the top left
    compressionPanel.margins = 15; // Add padding around the content
    compressionPanel.alignment = ["fill", "top"]; // Make the panel full window width

    // Create a main group to hold all controls in a single row
    var mainGroup = compressionPanel.add("group");
    mainGroup.orientation = "row"; // Arrange controls in a row
    mainGroup.alignChildren = ["left", "center"]; // Center align children vertically
    mainGroup.alignment = ["fill", "top"]; // Make the group fill the panel's width
    mainGroup.spacing = 10; // Add space between controls

    // Compression Type Dropdown (compressionLossy | compressionLossless)
    mainGroup.add("statictext", undefined, "Compression Type:");
    var compTypeDropdown = mainGroup.add("dropdownlist", undefined, ["Lossy", "Lossless"]);
    compTypeDropdown.selection = 0; // Default to Lossy

    // Compression Quality Label
    mainGroup.add("statictext", undefined, "Compression Quality:");

    // Compression Quality Slider and Text
    var qualityGroup = mainGroup.add("group"); // Create a group for the slider and text
    qualityGroup.orientation = "row"; // Arrange slider and text in a row
    qualityGroup.alignChildren = ["left", "center"]; // Center align children vertically
    qualityGroup.spacing = 10; // Add space between the slider and the text

    var compValueSlider = qualityGroup.add("slider", undefined, 50, 0, 100);
    compValueSlider.size = [281, 20];
    var compValueText = qualityGroup.add("edittext", undefined, "50");
    compValueText.characters = 4;

    // Update text while dragging slider
    compValueSlider.onChanging = function () {
        compValueText.text = Math.round(this.value).toString();
    };

    // Update text when slider changes via keyboard or release
    compValueSlider.onChange = function () {
        compValueText.text = Math.round(this.value).toString();
    };

    // Update slider when text changes
    compValueText.onChange = function () {
        var inputValue = parseInt(this.text, 10);
        if (!isNaN(inputValue) && inputValue >= 0 && inputValue <= 100) {
            compValueSlider.value = inputValue;
        } else {
            this.text = Math.round(compValueSlider.value).toString();
        }
    };

    // Function to toggle the slider based on compression type
    function updateCompressionControls() {
        var enableControls = compTypeDropdown.selection.text !== "Lossless";
        compValueSlider.enabled = enableControls;
        compValueText.enabled = enableControls;
    }

    updateCompressionControls();

    compTypeDropdown.onChange = updateCompressionControls;

    // Initialize control states
    updateCompressionControls();

    // Disable compression quality slider when "Lossless" is selected
    compTypeDropdown.onChange = function () {
        updateCompressionControls();
    };

    // Create a panel for all checkboxes
    var checkboxPanel = theDialogWin.add("panel", undefined, "Options");
    checkboxPanel.orientation = "column";
    checkboxPanel.alignChildren = ["left", "top"];
    checkboxPanel.margins = 15;
    checkboxPanel.alignment = ["fill", "top"]; // Make panel full width

    // Create a group for the three columns within the panel
    var checkboxGroup = checkboxPanel.add("group");
    checkboxGroup.orientation = "row";
    checkboxGroup.alignChildren = ["left", "top"];
    checkboxGroup.alignment = ["left", "top"]; // Make the group full width
    checkboxGroup.spacing = 20; // Add spacing between the columns

    // Left column
    var leftColumn = checkboxGroup.add("group");
    leftColumn.orientation = "column";
    leftColumn.alignChildren = ["left", "top"]; // Ensure elements fill the width

    // Fit Image Checkbox and Input
    var fitImageGroup = leftColumn.add("group");
    fitImageGroup.orientation = "row";
    fitImageGroup.alignChildren = ["left", "center"];
    fitImageGroup.alignment = ["fill", "top"]; // Make the group full width
    var fitImageCheckbox = fitImageGroup.add("checkbox", undefined, "Fit Longest Edge (px):");
    fitImageCheckbox.value = false;
    var fitImageInput = fitImageGroup.add("editnumber", undefined, "1920");
    fitImageInput.helpTip = "Proportionally resize the longest edge of the image to the specified value";
    fitImageInput.characters = 5;
    fitImageInput.enabled = fitImageCheckbox.value;
    fitImageCheckbox.onClick = function () {
        fitImageInput.enabled = fitImageCheckbox.value;
    };

    // XMP Checkbox
    var xmpDataCheckbox = leftColumn.add("checkbox", undefined, "Include XMP Data");
    xmpDataCheckbox.value = false;

    // Middle column
    var middleColumn = checkboxGroup.add("group");
    middleColumn.orientation = "column";
    middleColumn.alignChildren = ["fill", "top"]; // Ensure elements fill the width

    // PPI Checkbox and Input
    var ppiGroup = middleColumn.add("group");
    ppiGroup.orientation = "row";
    ppiGroup.alignChildren = ["left", "center"];
    ppiGroup.alignment = ["left", "top"]; // Make the group full width
    var ppiCheckbox = ppiGroup.add("checkbox", undefined, "PPI Value:");
    ppiCheckbox.value = false;
    var ppiInput = ppiGroup.add("editnumber", undefined, "300");
    ppiInput.characters = 5;
    ppiInput.enabled = ppiCheckbox.value;
    ppiCheckbox.onClick = function () {
        ppiInput.enabled = ppiCheckbox.value;
    };

    // Include EXIF Data Checkbox in the center column
    var exifDataCheckbox = middleColumn.add("checkbox", undefined, "Include EXIF Data");
    exifDataCheckbox.value = false;

    // Right column
    var rightColumn = checkboxGroup.add("group");
    rightColumn.orientation = "column";
    rightColumn.alignChildren = ["fill", "top"]; // Ensure elements fill the width

    // Photoshop Data Checkbox
    var psDataCheckbox = rightColumn.add("checkbox", undefined, "Include Photoshop Data");
    psDataCheckbox.value = false;

    // RGB Conversion Dropdown
    var rgbGroup = checkboxPanel.add("group");
    rgbGroup.orientation = "row";
    rgbGroup.alignChildren = ["left", "center"];
    rgbGroup.spacing = 10;
    rgbGroup.add("statictext", undefined, "RGB Profile Conversion:");
    var rgbConversionDropdown = rgbGroup.add("dropdownlist", undefined, ["Convert to sRGB space", "Keep Current RGB space"]);
    rgbConversionDropdown.selection = 0; // Default to Convert to sRGB

    // Create a panel to contain the action dropdowns
    var actionPanel = theDialogWin.add("panel", undefined, "Run Action");
    actionPanel.orientation = "column";
    actionPanel.alignChildren = ["fill", "top"]; // Align children to fill width
    actionPanel.margins = 15; // Add padding around the content
    actionPanel.alignment = ["fill", "top"]; // Ensure the panel stretches full width

    // Set the width for the dropdown action menus
    var dropdownWidth = 350; // Set dropdown width

    // Create a group for the action controls
    var actionGroup = actionPanel.add("group");
    actionGroup.orientation = "row"; // Set group to row orientation
    actionGroup.alignChildren = ["left", "top"]; // Align children to the left and top
    actionGroup.alignment = ["fill", "top"]; // Ensure the group stretches full width

    // Create a group for the Action Set label and dropdown
    var actionSetColumn = actionGroup.add("group");
    actionSetColumn.orientation = "column"; // Set column orientation for Action Set
    actionSetColumn.alignChildren = ["left", "top"]; // Align children to the left
    actionSetColumn.alignment = ["fill", "top"]; // Ensure this column stretches full width

    // Add Action Set label and dropdown in the Action Set column
    //actionSetColumn.add('statictext', undefined, 'Action Set:').alignment = ['left', 'center'];
    var actionSetDropdown = actionSetColumn.add('dropdownlist', undefined, []);
    actionSetDropdown.preferredSize.width = dropdownWidth; // Set width

    // Create a group for the Action label and dropdown
    var actionLabelColumn = actionGroup.add("group");
    actionLabelColumn.orientation = "column"; // Set column orientation for Action
    actionLabelColumn.alignChildren = ["left", "top"]; // Align children to the left
    actionLabelColumn.alignment = ["fill", "top"]; // Ensure this column stretches full width

    // Add Action label and dropdown in the Action column
    //actionLabelColumn.add('statictext', undefined, 'Action:').alignment = ['left', 'center'];
    var actionDropdown = actionLabelColumn.add('dropdownlist', undefined, []);
    actionDropdown.preferredSize.width = dropdownWidth; // Set width

    // Force the dropdowns to resize to match the specified width
    actionSetDropdown.onResizing = actionSetDropdown.onResize = function () {
        this.size.width = dropdownWidth; // Ensure dropdown maintains the specified width
    };

    actionDropdown.onResizing = actionDropdown.onResize = function () {
        this.size.width = dropdownWidth; // Ensure dropdown maintains the specified width
    };

    // Populate the action set dropdown
    actionSetDropdown.add('item', ''); // Add a blank/null option as the default
    var actionSets = getActionSets();
    for (var i = 0; i < actionSets.length; i++) {
        actionSetDropdown.add('item', actionSets[i]);
    }

    // Automatically select the blank option for both action set and action dropdowns
    actionSetDropdown.selection = actionSetDropdown.items[0];
    actionDropdown.add('item', ''); // Add a blank/null option as the default

    // When the action set is changed, update the action dropdown
    actionSetDropdown.onChange = function () {
        actionDropdown.removeAll();

        if (actionSetDropdown.selection && actionSetDropdown.selection.text != '') {
            // Populate actions for the selected action set
            var actions = getActions(actionSetDropdown.selection.text);
            for (var i = 0; i < actions.length; i++) {
                actionDropdown.add('item', actions[i]);
            }
            // Automatically select the first action if the set isn't null
            if (actions.length > 0) {
                actionDropdown.selection = actionDropdown.items[0]; // Select the first action
            }
        } else {
            // If the action set is null, add a blank option for action dropdown
            actionDropdown.add('item', '');
            actionDropdown.selection = actionDropdown.items[0]; // Select the null action
        }
    };

    // OK and Cancel Buttons
    var buttonGroup = theDialogWin.add("group");
    buttonGroup.alignment = "right";
    var cancelButton = buttonGroup.add("button", undefined, "Cancel");
    var okButton = buttonGroup.add("button", undefined, "OK");

    // Input Folder Browse Button functionality
    inputFolderButton.onClick = function () {
        var inputFolder = Folder.selectDialog("Select the input folder:");
        if (inputFolder) {
            inputFolderText.text = inputFolder.fsName;
            // Set output folder to match input folder if not already set
            if (!outputFolderText.text) {
                outputFolderText.text = inputFolder.fsName;
            }
        }
    };

    // Output Folder Browse Button functionality
    outputFolderButton.onClick = function () {
        var outputFolder = Folder.selectDialog("Select the output folder:");
        if (outputFolder) {
            outputFolderText.text = outputFolder.fsName;
        }
    };

    // Cancel Button functionality
    cancelButton.onClick = function () {
        theDialogWin.close();
    };

    // OK Button functionality
    okButton.onClick = function () {
        theDialogWin.close();
        app.refresh();
        // Restore the Photoshop panels
        app.togglePalettes();
        if (inputFolderText.text === "" || outputFolderText.text === "") {
            alert("Ensure that you select both input and output folders and other options before pressing OK!");
            // Restore the Photoshop panels
            app.togglePalettes();
            return;
        }

        // Assign selected folders to variables
        var inputFolder = new Folder(inputFolderText.text);
        var outputFolder = new Folder(outputFolderText.text);

        // Map dropdown selection to original compression type values
        var compType = compTypeDropdown.selection.text === "Lossless" ? "compressionLossless" : "compressionLossy";
        var compValue = Math.round(compValueSlider.value);
        var xmpData = xmpDataCheckbox.value;
        var exifData = exifDataCheckbox.value;
        var psData = psDataCheckbox.value;
        var rgbConversion = rgbConversionDropdown.selection.text; // Get RGB conversion choice

        // Gather fitImage and PPI parameters
        var fitValue = fitImageCheckbox.value ? parseInt(fitImageInput.text) : null;
        var ppi = ppiCheckbox.value ? parseInt(ppiInput.text) : null;

        // Process files with the recursive and mirror structure flags
        processFiles(inputFolder, outputFolder, compType, compValue, xmpData, exifData, psData, fitValue, ppi, recursiveCheckbox.value, mirrorStructureCheckbox.value, rgbConversion);
        theDialogWin.close();
    };

    theDialogWin.show();
}


// Main processing function with optional recursion and mirroring structure
function processFiles(inputFolder, outputFolder, compType, compValue, xmpData, exifData, psData, fitValue, ppi, recursive, mirrorStructure, rgbConversion) {
    var fileList = getFilesRecursive(inputFolder, recursive);
    var fileList = getFilesRecursive(inputFolder, recursive);
    fileList.sort();
    var savedDisplayDialogs = app.displayDialogs;
    app.displayDialogs = DialogModes.NO;

    var inputFileCounter = 0;
    var fileCounter = 0;

    // Create the progress bar
    var progressBar = new Window("palette", "Processing Files");
    progressBar.preferredSize = [350, 100];
    // Status text
    var statusText = progressBar.add("statictext", undefined, "Preparing...");
    statusText.alignment = "fill";
    // Progress bar
    var progress = progressBar.add("progressbar", undefined, 0, fileList.length);
    progress.preferredSize.width = 300;
    progressBar.show();
    app.refresh();

    for (var i = 0; i < fileList.length; i++) {

        // Open the files for processing
        open(fileList[i]);

        // Create mirrored subfolder structure in output folder if requested
        var relativePath = fileList[i].parent.fsName.replace(inputFolder.fsName, "");
        var targetFolder = outputFolder;
        if (mirrorStructure && relativePath !== "") {
            targetFolder = new Folder(outputFolder + "/" + relativePath);
            if (!targetFolder.exists) {
                targetFolder.create();
            }
        }

        // File processing options
        if (activeDocument.mode == DocumentMode.BITMAP) {
            // Bitmap mode input
            activeDocument.changeMode(ChangeMode.GRAYSCALE);
            activeDocument.changeMode(ChangeMode.RGB);
            //if (rgbConversion === "Convert to sRGB space") {
            if (rgbConversionDropdown.selection.index === 0) {
                activeDocument.convertProfile("sRGB IEC61966-2.1", Intent.RELATIVECOLORIMETRIC, true, false);
            }
            activeDocument.bitsPerChannel = BitsPerChannelType.EIGHT;
        } else if (activeDocument.mode == DocumentMode.INDEXEDCOLOR || activeDocument.mode == DocumentMode.CMYK || activeDocument.mode == DocumentMode.LAB) {
            // Indexed Color, CMYK or Lab mode input
            activeDocument.changeMode(ChangeMode.RGB);
            //if (rgbConversion === "Convert to sRGB space") {
            if (rgbConversionDropdown.selection.index === 0) {
                activeDocument.convertProfile("sRGB IEC61966-2.1", Intent.RELATIVECOLORIMETRIC, true, false);
            }
            activeDocument.bitsPerChannel = BitsPerChannelType.EIGHT;
        } else {
            // Grayscale and RGB mode input
            activeDocument.changeMode(ChangeMode.RGB);
            //if (rgbConversion === "Convert to sRGB space") {
            if (rgbConversionDropdown.selection.index === 0) {
                activeDocument.convertProfile("sRGB IEC61966-2.1", Intent.RELATIVECOLORIMETRIC, true, false);
            }
            activeDocument.bitsPerChannel = BitsPerChannelType.EIGHT;
        }

        // Run the selected action on each processed file
        if (actionSetDropdown.selection && actionSetDropdown.selection.text != '' &&
            actionDropdown.selection && actionDropdown.selection.text != '') {
            runAction(actionSetDropdown.selection.text, actionDropdown.selection.text);
        }

        // Fit image to specified value and/or change PPI if enabled
        if (fitValue !== null || ppi !== null) {
            fitImage(fitValue, ppi);
        }

        // Save as a copy and close
        saveWebP(compType, compValue, xmpData, exifData, psData, targetFolder);
        activeDocument.close(SaveOptions.DONOTSAVECHANGES);

        // Increment the counters
        inputFileCounter++;
        fileCounter++;

        // Close progress palette after processing
        app.bringToFront();
        progressBar.close();
    }

    // End of script notifications
    app.displayDialogs = savedDisplayDialogs;
    app.beep();
    alert('Script completed!' + '\r' + inputFileCounter + ' source files saved as ' + fileCounter + ' WebP files!');

    // Restore the Photoshop panels
    app.togglePalettes();
}


///// Helper Functions /////

function getFilesRecursive(folder, recursive) {
    var fileList = [];
    var allFiles = folder.getFiles();
    for (var i = 0; i < allFiles.length; i++) {
        var file = allFiles[i];
        if (file instanceof Folder && recursive) {
            fileList = fileList.concat(getFilesRecursive(file, recursive));
        } else if (file instanceof File && /\.(avif|webp|tif|tiff|jpg|jpeg|psd|psb|png|tga)$/i.test(file.name)) {
            fileList.push(file);
        }
    }
    return fileList;
}

function fitImage(fitValue, ppi) {
    // NEARESTNEIGHBOR | BILINEAR | BICUBIC | BICUBICSMOOTHER | BICUBICSHARPER | BICUBICAUTOMATIC
    if (fitValue !== null && ppi !== null) {
        // Both fit value and PPI are specified
        if (activeDocument.height.value > activeDocument.width.value) {
            activeDocument.resizeImage(null, UnitValue(fitValue, "px"), ppi, ResampleMethod.BICUBIC);
        } else {
            activeDocument.resizeImage(UnitValue(fitValue, "px"), null, ppi, ResampleMethod.BICUBIC);
        }
    } else if (fitValue !== null) {
        // Only fit value is specified
        if (activeDocument.height.value > activeDocument.width.value) {
            activeDocument.resizeImage(null, UnitValue(fitValue, "px"), activeDocument.resolution, ResampleMethod.BICUBIC);
        } else {
            activeDocument.resizeImage(UnitValue(fitValue, "px"), null, activeDocument.resolution, ResampleMethod.BICUBIC);
        }
    } else if (ppi !== null) {
        // Only PPI is specified
        activeDocument.resizeImage(undefined, undefined, ppi, ResampleMethod.NONE);
    }
}

function saveWebP(compType, compValue, xmpData, exifData, psData, outputFolder) {
    // https://community.adobe.com/t5/photoshop-ecosystem-discussions/saving-webp-image-by-script/td-p/13642577
    function s2t(s) {
        return app.stringIDToTypeID(s);
    }
    var WebPDocName = activeDocument.name.replace(/\.[^\.]+$/, ''); // Remove file extension
    var WebPSavePath = outputFolder + "/" + WebPDocName + ".webp"; // Save path
    var WebPFile = new File(WebPSavePath);
    var descriptor = new ActionDescriptor();
    var descriptor2 = new ActionDescriptor();
    descriptor2.putEnumerated(s2t("compression"), s2t("WebPCompression"), s2t(compType));
    if (compType === "compressionLossy") {
        descriptor2.putInteger(s2t("quality"), compValue);
    }
    descriptor2.putBoolean(s2t("includeXMPData"), xmpData);
    descriptor2.putBoolean(s2t("includeEXIFData"), exifData);
    descriptor2.putBoolean(s2t("includePsExtras"), psData);
    descriptor.putObject(s2t("as"), s2t("WebPFormat"), descriptor2);
    descriptor.putPath(s2t("in"), WebPFile);
    descriptor.putBoolean(s2t("copy"), true); // asCopy
    descriptor.putBoolean(s2t("lowerCase"), true);
    executeAction(s2t("save"), descriptor, DialogModes.NO);
}

function getActionSets() {
    var actionSets = [];
    var i = 1;
    while (true) {
        try {
            var ref = new ActionReference();
            ref.putIndex(charIDToTypeID('ASet'), i);
            var desc = executeActionGet(ref);
            var name = desc.getString(charIDToTypeID('Nm  '));
            actionSets.push(name);
            i++;
        } catch (e) {
            break;
        }
    }
    return actionSets;
}

function getActions(actionSet) {
    var actions = [];
    var i = 1;
    while (true) {
        try {
            var ref = new ActionReference();
            ref.putIndex(charIDToTypeID('Actn'), i);
            ref.putName(charIDToTypeID('ASet'), actionSet);
            var desc = executeActionGet(ref);
            var actionName = desc.getString(charIDToTypeID('Nm  '));
            actions.push(actionName);
            i++;
        } catch (e) {
            break;
        }
    }
    return actions;
}

function runAction(actionSet, actionName) {
    var actionRef = new ActionReference();
    actionRef.putName(charIDToTypeID('Actn'), actionName);
    actionRef.putName(charIDToTypeID('ASet'), actionSet);
    var desc = new ActionDescriptor();
    desc.putReference(charIDToTypeID('null'), actionRef);
    executeAction(charIDToTypeID('Ply '), desc, DialogModes.NO);
}
#target photoshop
#script "Jeffrey's Calendar Builder"
#strict on
app.bringToFront();


//
// Photoshop Calendar-Making Script (CS2, CS3?)
// Copyright 2007 - 2010 Jeffrey Friedl       
// jfriedl@yahoo.com
//
// See
//
//      Copyright
//
// for the latest version, version history, instructions, etc.
//
//
// Traducción: Juan Manuel Díaz
// Sitio Web: http://www.retoquefactoria.com
// Contacto: contacto@retoquefactoria.com

var VERSION = '8'; // Nov 22, 2010
var MakeRelease = false;  // Set to true only by Jeffrey while preparing a new release

//
// CHANGES 7 -> 8
//   Wasn't calculating a month correctly if daylight savings time in the computer's time/region
//   ends on the last day of the month.
//
// CHANGES 6 -> 7
//   Added Lithuanian support.
//   Fixed the auto-save stuff in the dialog to look disabled when it is disabled.
// 
// CHANGES 5 -> 6
//   Added ability to put "{1998}" in a holiday line and have it be replaced by the difference from that year
//   to the calendar year. Thus, an entry like
//           5/16  Our Anniversary ({1998})
//   shows up on the 2007 calendar as
//           Our Anniversary (9)
//
//   Fixed default year computation: in the 2nd half of the year, default to next year
//   Added 4R paper size.
//   Broke out single-number "margins" to individual top/bottom/right/left margins.
//   This is sort of fake in that there's no benefit to having both left and right instead
//   of a generic "width"
//
//
// CHANGES 4 -> 5
//   Changes suggested by Ignus (Copyright#comment-12768)
//   Fixed Latvian translations.  Recognize more than one <BR> on a holiday line.
//
//
// CHANGES 3 -> 4
//   Made the various font sizes and inter-text distances scale somewhat properly
//   for the new A3/A5 sizes I added before.
//
//
// CHANGES 3b1 -> 3
//   Added A3, A5 paper sizes
//   Fixed "February becomes March" date problem
//   Weeks can now start on any day of the week, not just Sunday and Monday
//
//
// CHANGES 2 -> 3b1
// ----------------------------------------------------------------------------
//   changed <YYYY> to <YY> in the autosave filename pattern
//   new date format, reading annotation file, etc.
//   added annotation to config dialog
//   doc button
//   added help tips
//   bail if they [x] on the startup dialog
//   addes rasterize
//   added language selection
//   added week numbers
//   added <CONTEXT>  ...   </CONTEXT> (recommend indentation)
//   added [key=value] prefixes to a line
//   added standalone [key=value] prefixes for from-here-on-down settings
//   added INCLUDE "filename"
//   added IMPORT  "filename"
//   keys and values:
//      FontName    -- font name, as known to javascript
//      FontSize    -- 100%  130%   200%  90%
//      FontColor   -- a triplet of raw 0-255 values, or 0% - 100% percents
//      FontOpacity -- e.g. "100%", "50%", etc.
//      can add <BR> in text to force a line break
//


//
// This script instructs Adobe Photoshop CS2 to create a document representing
// a calendar for a single month, or a calendar for an entire year as 12 separate
// documents.
//
// If you execute it while Photoshop is open to a document with one layer,
// that layer's contents is used as the calendar image.
//
// Two ways to execute this script:
//
//    1) Click on it in Finder/Explorer
//
//  or
//
//    2) Place into Photoshop CS2's Presets/Scripts folder, e.g.
//         C:\Program Files\Adobe\Adobe Photoshop CS2\Presets/Scripts\
//       then (re)start Photoshop and select it via:
//          File > Scripts > Jeffrey's Calendar Builder
//


//
// Basic configuration can be done without modifying this script.
// When ShowConfigDialog is true, a popup gives the user a chance to select
// the date, paper size, orientation, etc. In such a case, any configuration changes
// made in this section of code modify the defaults for that dialog.
//
// However, if ShowConfigDialog is false, config changes in this part of the
// code are actually reflected in the calendar.
//
var ShowConfigDialog = true;

//
// Configure here what calendar you want. It defaults to January of the
// current year when in the first half of the year, and January of next
// year when in the latter half of the year.
//
var TargetMonth =  1; // choose zero for all 12 months
var TargetYear  =  (new Date()).getMonth() < 6 ? (new Date()).getFullYear() : (new Date()).getFullYear() + 1;

//
// Language to use on the calendar (month and day names).
//
var Language = 'English';

//
// If 'Rasterize' is true, all the date numbers on the calendar are rasterized into
// a single layer, as are the days of the week, and the week numbers. When set to false,
// each item is left as its own text layer.
//
// This does not effect the month-name text layer, nor the year-number text layer.
//
var RasterizeTextLayers = true;

//
// Configure the target print size/resolution -- these may be overruled
// later if ShowConfigDialog is true.
//
SetPrintDPI(300);          // Set the DPI you'll print at
SetOrientation("L");       // Can choose "L" or "P" (Portrait or Landscape)
SetPaperSize("A4");        // Can choose "A3", "A4", "A5", or "Letter"
SetPrinterMargins_MM(5,5); // Many printers can't print borderless

//
// I like my calendar's weeks to begin on Sunday, but you can have yours begin
// on Monday by setting this to 1
//
var firstDayOfWeek = 0; // 0 == Sunday, 1 == Monday, ...., 6 == Saturday

//
// How many weeks should be shown for the month?
// Choose "AUTO", 5, or 6:
//   If "AUTO", only the number required are shown.
//   If "5", some cells might have two dates in them
//   If "6", the last row could be empty
// (Actually, for some Februaries, the last row could be empty even with "5")
//
var GridRows = "AUTO"; // One of "AUTO", 5, or 6 make sense


//
// If zero, don't show week numbers. If less than zero, show in a left column.
// If greater than zero, show in a right column.
//
var showWeekNumber = 0;

var WeekNumStyleISO8601 = true;


//
// That's the end of the basic configuration.
// (there's plenty more in the code below)
//
// You can invoke this script by doubleclicking on the script
//
// Once invoked, it takes quite a bit of time -- about a minute on my machine --
// to construct one month's document. While it's running, you won't be able to
// interact with Photoshop: you'll see some dialogs flicker, but that's about it.
//
// Once it's done and control is returned to you, you'll see a layer
// named "Paste Your Photo Here".  Paste a photo you like there, and resize it
// so that it fills the document.
//
// Areas to then play with: the styles of the various layers (especially the
// fill and opacity percents), and the nature of the "Picture Mask" mask.
//

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////


//
// Setting this to true reduces the work the script does by eliding most
// of the date numbers and weekday names. This can be useful for
// debugging/testing
//
var QuickTest = false;



//
// Must set these defaults before dialog
//
var AnnotationFilePattern = "~/CalendarDataYYYY.txt";
var IncludeAnnotations = MakeRelease ? true : false;
var DoAutoSave = false;
var AutoSaveOverwrite = true;
var AutoSaveDir = new Folder ("~");
var AutoSavePattern =  'Calendar_YYYY_MM';

var ConfigFile = "~/.CalendarBuilderOptions";

// make the text safe to appear within a JavaScript single-quoted string
function fixup(text)
{
    text = text.replace(/\\/g, "\\\\");
    text = text.replace(/\\'/g, "\\'");  //"
    return text;
}

function SaveCurrentConfig(dialog)
{
    var F = new File(ConfigFile);
    if (! F.open("w")) {
        if (ReportErrors)
            alert("couldn't create configuration file \"" + ConfigFile + "\"");
        return false; // no such file
    }
    F.write("//    User configuraiton file for Jeffrey's Calendar Building Script\n");
    F.write("//    Copyright\n\n\n");

    F.write("// written " + (new Date) + "\n");
    F.write("v = '" + VERSION + "';\n");
    F.write("dialog.setLanguage('" + dialog.StyleAndPrint.Style.Language.et.selection.text + "');\n\n");

    F.write("dialog.Date.Month.et.selection                              =  " +       dialog.Date.Month.et.selection                              + " ;\n");
    F.write("dialog.Date.Year.et.text                                    = '" + fixup(dialog.Date.Year.et.text)                                   + "';\n");
    F.write("dialog.StyleAndPrint.Style.Weekstart.et.selection           =  " +       dialog.StyleAndPrint.Style.Weekstart.et.selection           + " ;\n");
    F.write("dialog.StyleAndPrint.Style.WeekNum.ShowWeekNum.et.selection =  " +       dialog.StyleAndPrint.Style.WeekNum.ShowWeekNum.et.selection + " ;\n");
    F.write("dialog.StyleAndPrint.Style.WeekNum.Style.ISO8601.value      =  " +       dialog.StyleAndPrint.Style.WeekNum.Style.ISO8601.value      + " ;\n");
    F.write("dialog.StyleAndPrint.Style.WeekNum.Style.Default.value      =  " +       dialog.StyleAndPrint.Style.WeekNum.Style.Default.value      + " ;\n");
    F.write("dialog.StyleAndPrint.Style.Orientation.et.selection         =  " +       dialog.StyleAndPrint.Style.Orientation.et.selection         + " ;\n");
    F.write("dialog.StyleAndPrint.Paper.Sheetsize.et.selection           =  " +       dialog.StyleAndPrint.Paper.Sheetsize.et.selection           + " ;\n");
    F.write("dialog.StyleAndPrint.Paper.WidthMargin.et.text              = '" + fixup(dialog.StyleAndPrint.Paper.WidthMargin.et.text)             + "';\n");
    F.write("dialog.StyleAndPrint.Paper.HeightMargin.et.text             = '" + fixup(dialog.StyleAndPrint.Paper.HeightMargin.et.text)            + "';\n");
    F.write("dialog.StyleAndPrint.Paper.DPI.et.text                      =  " +       dialog.StyleAndPrint.Paper.DPI.et.text                      + " ;\n");
    F.write("dialog.Misc.RasterizeTextLayers.cb.value                    =  " +       dialog.Misc.RasterizeTextLayers.cb.value                    + " ;\n");
    F.write("dialog.AutoSave.CheckBoxes.YesOrNo.cb.value                 =  " +       dialog.AutoSave.CheckBoxes.YesOrNo.cb.value                 + " ;\n");
    F.write("dialog.AutoSave.CheckBoxes.Overwrite.cb.value               =  " +       dialog.AutoSave.CheckBoxes.Overwrite.cb.value               + " ;\n");
    F.write("dialog.AutoSave.Dir.Base.text                               = '" + fixup(dialog.AutoSave.Dir.Base.text)                              + "';\n");
    F.write("dialog.AutoSave.FilePat.et.text                             = '" + fixup(dialog.AutoSave.FilePat.et.text)                            + "';\n");
    F.write("dialog.Annotations.cb.value                                 =  " +       dialog.Annotations.cb.value                                 + " ;\n");
    F.write("dialog.Annotations.File.text                                = '" + fixup(dialog.Annotations.File.text)                               + "';\n");
    F.write("dialog.AutoSave.CheckBoxes.YesOrNo.cb.onClick();\n");
    F.write("dialog.Annotations.cb.onClick();\n");
    F.close();
}

function ReadConfig(dialog)
{
    var F = new File(ConfigFile);
    if (! F.open("r"))
        return;

    var config = F.read();

    // Grandfather in config files created prior to the Margins being split from one number to four numbers (top/bottom/right/left)
    if (config.match(/dialog\.StyleAndPrint\.Paper\.Margin\.et\.text/))
    {
        config = config.replace(/dialog\.StyleAndPrint\.Paper\.Margin\.et\.text/, 'dialog.StyleAndPrint.Paper.WidthMargin.et.text = dialog.StyleAndPrint.Paper.HeightMargin.et.text');
    }

    var v;
    try {
        eval(config);
    } catch(er) {
        alert("Warning: the configuration file \"" + F.fsName + "\" seems corrupt. Please delete it, or save another configuration....");
    }
}


var abort = false;
if (ShowConfigDialog && !ConfigViaDialog())
    abort = true;

var MasterDayNames;
var MonthNames;

// Most of this has been derived from:  http://www.domesticat.net/misc/monthsdays.php
if (Language == 'Spanish') {
    MasterDayNames = new Array("domingo","lunes","martes","mi\u00e9rcoles","jueves","viernes","s\u00e1bado");
    MonthNames = new Array("enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre");

} else if (Language == 'Spanish') {
    MasterDayNames = new Array("domingo","lunes","martes","mi\u00e9rcoles","jueves","viernes","s\u00e1bado");
    MonthNames = new Array("enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre");


} else {
    // Default is Spanish
    MasterDayNames = new Array("domingo","lunes","martes","mi\u00e9rcoles","jueves","viernes","s\u00e1bado");
    MonthNames = new Array("enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre");

}

//
// getWeekNumber() taken from:  http://www.dynarch.com/projects/calendar/
//
/** Returns the number of the week in year, as defined in ISO 8601. */
Date.prototype.getWeekNumber_ISO8601 = function() {
    var d = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0);
    var DoW = d.getDay();
    d.setDate(d.getDate() - (DoW + 6) % 7 + 3); // Nearest Thu
    var ms = d.valueOf(); // GMT
    d.setMonth(0);
    d.setDate(4); // Thu in Week 1
    return Math.round((ms - d.valueOf()) / (7 * 864e5)) + 1;
};


//
// Week with Jan 1 is "Week 1".
// I wrote this myself, so only Lord knows it if's correct.
//
Date.prototype.getWeekNumber_STD = function() {
    var d = new Date(this.getFullYear(), 0, 2, 0, 0, 0); // Jan 1

    // I shouldn't use a loop here, but I'm too lazy to keep the numbers straight
    while (d.getDay() != firstDayOfWeek)
        d.setDate(d.getDate() + 1);

    // 'd' points to the start of week 2. If 'this' is before that,
    // return "Week 1"
    if (d.getTime() > this.getTime())
        return 1;

    // Count the days that we're beyond the start of week 2
    var dayDelta = (this.getTime() - d.getTime()) / 86400000;

    // Convert to weeks, and return
    return 2 + Math.floor(dayDelta/7);
};

Date.prototype.getWeekNumber = function() {
    return WeekNumStyleISO8601 ? this.getWeekNumber_ISO8601() : this.getWeekNumber_STD();
};

var DPI; // the DPI at which we'll print

var doc; // the document we're building
var RowsThisMonth; // how many weeks to show in the calendar
var GridTop_MM; // distance from top of page to top of grid

var GridBoxToBoxHorizOffset_MM; // distance from one grid box to the next (including one margin)
var GridBoxToBoxVertOffset_MM;  // distance from one grid box to the next (including one margin)

var RawPageWidth_MM;  // without printer margins
var RawPageHeight_MM; // without printer margins

var PrinterMarginWidth_MM;    // area of paper that can't be printed on
var PrinterMarginHeight_MM;   // area of paper that can't be printed on

var PageWidth_MM;     // the area we'll print on
var PageHeight_MM;    // the area we'll print on

var Orientation; // "L" for Landscape, "P" for Portrait
var PaperScale;

var AnnotationLayerSet;
var AnnotationData;

if (IncludeAnnotations)
{
    if (! ReadAnnotationData())
        abort = true;
}


//
// The following are all initialized at the start of BuildCalendar()
//
var AnnotationTextBottomMargin_MM;
var AnnotationTextFont;
var AnnotationTextFontColor;
var AnnotationTextFontHeight_MM;
var Columns;
var DayNameFont;
var DayNameFontColor;
var DayNameFontHeight_MM;
var DayNameHeight_MM;
var GridBottomMargin_MM;
var GridBoxNames;
var GridColor;
var GridHorizLineWidth_MM;
var GridSideMargin_MM  ;
var GridTopMargin_MM;
var GridVertLineWidth_MM ;
var MonthNameFont;
var MonthNameFontColor;
var MonthNameFontHeight_MM;
var MonthNameTopMargin_MM;
var NumbersFont;
var NumbersFontColor;
var NumbersFontHeight_MM;
var NumbersPaddingX_MM;
var NumbersPaddingY_MM;
var WeekNumberFont;
var WeekNumberFontColor;
var WeekNumberFontHeight_MM;
var WeekNumberPaddingX_MM;
var WeekNumberPaddingY_MM;
var YearNameFont;
var YearNameFontColor;
var YearNameFontHeight_MM;
var YearNameFontTracking;
var YearNameFontVertScale;
var YearNameTopMargin_MM;

try
{
    if (! abort)
    {
        if (MakeRelease)
        {
            // This is what I use to make the prepackaged bundles
            QuickTest = false;
            TargetYear = 2011;
            
            showWeekNumber = false;
            RasterizeTextLayers = true;

            DoAutoSave = true;
            AutoSaveDir = new Folder("~/autobuilds");
            AutoSaveOverwrite = true;
            IncludeAnnotations = true;

            ReadAnnotationData();
            TargetMonth = 0; SetPaperSize('Letter');  SetOrientation('L');  firstDayOfWeek = 0;  AutoSavePattern = 'US-L-Sun-Calendar_YYYY_MM'; BuildCalendar();

            ReadAnnotationData();
            TargetMonth = 0; SetPaperSize('Letter');  SetOrientation('P');  firstDayOfWeek = 0;  AutoSavePattern = 'US-P-Sun-Calendar_YYYY_MM'; BuildCalendar();

            IncludeAnnotations = false;

            TargetMonth = 0; SetPaperSize('A4');      SetOrientation('L');  firstDayOfWeek = 0;  AutoSavePattern = 'A4-L-Sun-Calendar_YYYY_MM'; BuildCalendar();
            TargetMonth = 0; SetPaperSize('A4');      SetOrientation('P');  firstDayOfWeek = 0;  AutoSavePattern = 'A4-P-Sun-Calendar_YYYY_MM'; BuildCalendar();

            TargetMonth = 0; SetPaperSize('A4');      SetOrientation('L');  firstDayOfWeek = 1;   AutoSavePattern = 'A4-L-Mon-Calendar_YYYY_MM'; BuildCalendar();
            TargetMonth = 0; SetPaperSize('A4');      SetOrientation('P');  firstDayOfWeek = 1;   AutoSavePattern = 'A4-P-Mon-Calendar_YYYY_MM'; BuildCalendar();
        }
        else
        {
            BuildCalendar();
        }
    }
}
catch (error)
{
    alert(error);
}
// Execution ends here -- only functions follow.



///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function ConfigViaDialog()
{
    // var f = new File("/i/resource.txt"); f.open("r"); var dialogSpec = f.read();
    var dialogSpec = "dialog                                                 \
{                                                                            \
    text: \"Jeffrey's Generador de Calendarios (Version "+VERSION+")\",              \
    frameLocation: [150,100],                                                \
    alignChildren:'fill',                                                    \
    spacing: 2,                                                              \
                                                                             \
    TitleBox: Group {                                                        \
       orientation: 'column',                                                \
       margins: [0,5,0,10],                                                  \
       spacing: 1,                                                           \
       alignment: 'center',                                                  \
       p: Panel {                                                            \
         margins: [ 30, 8, 30, 8 ],                                          \
         n: StaticText { text: \"Traducido por RETOQUE FACTORIA \" },\
       },                                                                    \
       n: Button { text: 'http://regex.info/blog/photo-tech/calendar/' },\
    },                                                                       \
                                                                             \
    Date: Panel {                                                            \
          text: 'DEFINIR MES',                                              \
          orientation:'row',                                                 \
          alignChildren:'left',                                              \
                                                                             \
          Year: Group {                                                      \
             st: StaticText { text:'ANIO:' },                                \
             et: EditText   { text:'2007', maxvalue: '9999', minvalue: '1800' },\
          },                                                                 \
          Month: Group {                                                     \
             st: StaticText   { text: 'MES:' },                            \
             et: DropDownList { properties: {items: ['- Todos -', 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']}  }\
          },                                                                 \
    },                                                                       \
                                                                             \
    StyleAndPrint: Group {                                                   \
        orientation: 'row',                                                  \
        alignChildren: 'top',                                                \
                                                                             \
                                                                             \
        Style: Panel {                                                       \
            text: 'ESTILO DEL CALENDARIO',                                          \
            alignChildren:'left',                                            \
            Language: Group {                                                \
               st: StaticText   { text: 'Idioma:' },                       \
               et: DropDownList { properties: { items: [                     \
                                                                             \
                  'Spanish', 'English']} },                                               \
                                                                             \
            },                                                               \
                                                                             \
            Weekstart: Group {                                               \
               st: StaticText   { text: 'Comienzo de Semana:' },                 \
               et: DropDownList { properties: { items: ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']}  },\
            },                                                               \
                                                                             \
            WeekNum: Group {                                                 \
              alignChildren:'left',                                          \
                                                                             \
              ShowWeekNum: Group {                                           \
                 st: StaticText   { text: 'Mostrar Numeros de Semana:' },            \
                 et: DropDownList { properties: { items: ['Izquierda', 'No', 'Derecha']}  },\
              },                                                             \
                                                                             \
              Style: Group {                                                 \
                  orientation: 'column',                                     \
                  alignChildren:'left',                                      \
                  margins: 0,                                                \
                  spacing: 0,                                                \
                  helpTip: \"With ISO 8601, 'Week 1' is the week with the first Thursday of the year. When selecting this item, it's best to set weeks to start on a Monday, as that is the ISO8601 standard as well. Select 'Jan 1' to have 'Week 1' be the week with January first.\",\
                  enabled: false,                                            \
                  ISO8601: RadioButton { text: 'ISO 8601'},                  \
                  Default: RadioButton { text: 'Jan 1' },                    \
              },                                                             \
            },                                                               \
                                                                             \
            Orientation: Group {                                             \
               helpTip: 'Esto es para la Imagen, no para el Papel',              \
               st: StaticText   { text: 'Orientacion:' },              \
               et: DropDownList { properties: { items: ['Apaisada', 'Vertical']}  },\
            },                                                               \
        },                                                                   \
                                                                             \
        Paper: Panel {                                                       \
              text: 'DIMENSIONES',                                     \
              alignChildren:'left',                                          \
              Sheetsize: Group {                                             \
                 st: StaticText   { text: 'Papel:' },                   \
                 et: DropDownList { properties: { items: ['Letter', 'A3', 'A4', 'A5', '4R']}  },\
              },                                                             \
              WidthMargin: Group {                                           \
                 s_: StaticText  { text: 'Ancho Demasia:' },             \
                 et: EditText    { text: 'MMMM'  },                          \
                 st: StaticText  { text: 'mm' },                             \
              },                                                             \
                                                                             \
              HeightMargin: Group {                                          \
                 s_: StaticText  { text: 'Alto Demasia:' },            \
                 et: EditText    { text: 'MMMM'  },                          \
                 st: StaticText  { text: 'mm' },                             \
              },                                                             \
              DPI: Group {                                                   \
                 st: StaticText   { text: 'DPI:' },                    \
                 et: EditText     { text: '300', maxvalue: '1200',  minvalue: '72'  },\
              },                                                             \
        },                                                                   \
                                                                             \
    },                                                                       \
                                                                             \
    Annotations: Panel {                                                     \
       text: 'ANOTACIONES',                                                  \
       orientation: 'row',                                                   \
       alignChildren: 'left',                                                \
       cb: Checkbox { text: 'Incluir', },                                    \
                                                                             \
       from: StaticText { text: 'de:' },                                   \
       File:   EditText   { text: ''           },                            \
       Browse: Button     { text: 'Explorar'     },                            \
    },                                                                       \
                                                                             \
    Misc: Panel {                                                            \
          text: 'Otras Opciones',                                     \
          alignChildren:'left',                                              \
                                                                             \
          RasterizeTextLayers: Group {                                       \
                 helpTip: \"Si esta Cliqueado los numeros de las fechas se rasterizan para que sea mas sencillo modificar el Estilo de Capa. Cuando NO esta Cliqueado a cada numero le corresponde una capa por separado.\",\
                 st: StaticText { text: 'Rasterizar y Acoplar Capas de Texto?' },\
                 cb: Checkbox   { value:  true      },                       \
             },                                                              \
                                                                             \
    },                                                                       \
                                                                             \
    AutoSave: Panel {                                                        \
          alignChildren:'left',                                              \
                                                                             \
          CheckBoxes: Group {                                                \
             alignChildren:'left',                                           \
                                                                             \
             YesOrNo: Group {                                                \
                 st: StaticText { text: 'Auto-Guardar:' },                      \
                 cb: Checkbox   { value:  false      },                      \
             },                                                              \
                                                                             \
             Overwrite: Group {                                              \
                 st: StaticText { enabled: false, text: '      Sobreexcribir' },\
                 cb: Checkbox   { enabled: false, value:  false      },      \
             },                                                              \
          },                                                                 \
                                                                             \
          Dir: Group {                                                       \
              st:     StaticText { enabled: false, text: 'Carpeta:', },    \
              Base:   EditText   { enabled: false, text: ''            },    \
              Browse: Button     { enabled: false, text: 'Explorar'      },    \
          },                                                                 \
                                                                             \
          FilePat: Group {                                                   \
             st: StaticText   { enabled: false, text: 'Patron .PSD:'  },\
             et: EditText     { enabled: false, text: ''   },                \
          },                                                                 \
                                                                             \
    },                                                                       \
                                                                             \
    Default: Panel {                                                         \
       text: 'OPCIONES POR DEFECTO',                                        \
       alignChildren: 'left',                                                \
       Config: Group {                                                       \
          st: StaticText { text: 'Guarda esta configuracion como Predeterminada:' },\
          but: Button    { text: 'Guardar'    },                                \
       },                                                                    \
       Restore: Group {                                                      \
          alignChildren: 'left',                                             \
          st: StaticText { text: 'Para Borrar todos los Predeterminados, Clic y Presiona Borrar:' },\
          cb: Checkbox   { value: false },                                   \
          but: Button    { text: 'Borrar', enabled: false    },              \
       },                                                                    \
    },                                                                       \
                                                                             \
    Control: Group {                                                         \
       margins: [0, 15,0, 0 ],                                               \
       alignment: 'center',                                                  \
       spacing: '20',                                                        \
       Okay:  Button { text:'OK',  properties:{name:'ok'    } },           \
       Abort: Button { text:'CANCELAR', properties:{name:'cancel'} },           \
    }                                                                        \
}";


    var dialog = new Window(dialogSpec);

    dialog.StyleAndPrint.Style.WeekNum.ShowWeekNum.et.onChange = function () {
        dialog.StyleAndPrint.Style.WeekNum.Style.enabled = (dialog.StyleAndPrint.Style.WeekNum.ShowWeekNum.et.selection != 1);
    };

    dialog.AutoSave.CheckBoxes.YesOrNo.cb.onClick = function () {
        dialog.AutoSave.CheckBoxes.Overwrite.enabled =
            dialog.AutoSave.CheckBoxes.Overwrite.st =
            dialog.AutoSave.CheckBoxes.Overwrite.cb =
            dialog.AutoSave.Dir.st.enabled          =
            dialog.AutoSave.Dir.Base.enabled        =
            dialog.AutoSave.Dir.Browse.enabled      =
            dialog.AutoSave.FilePat.st.enabled      =
            dialog.AutoSave.FilePat.et.enabled      =
                dialog.AutoSave.CheckBoxes.YesOrNo.cb.value;
    };

    dialog.AutoSave.Dir.Browse.onClick = function() {
        var f = new Folder (dialog.AutoSave.Dir.Base.text);
        var f2 = f.selectDlg();
        if (f2)
            dialog.AutoSave.Dir.Base.text = f2.fsName;
    };

    dialog.Default.Config.but.onClick = function() {
        SaveCurrentConfig(dialog);
        alert("configuration saved");
    };

    dialog.Default.Restore.cb.onClick= function() {
        dialog.Default.Restore.but.enabled = dialog.Default.Restore.cb.value;
    };

    dialog.Default.Restore.but.onClick = function() {
        (new File(ConfigFile)).remove();
        dialog.setDefaults();
        dialog.Default.Restore.but.enabled = dialog.Default.Restore.cb.value = false;
    };
    
    dialog.Annotations.cb.onClick = function() {
        dialog.Annotations.File.enabled = dialog.Annotations.Browse.enabled = dialog.Annotations.cb.value;
    };

    dialog.Annotations.Browse.onClick = function() {
        var f = new File (dialog.Annotations.File.text);
        var f2 = f.openDlg();
        if (f2)
            dialog.Annotations.File.text = f2.fsName;
    };

    dialog.setLanguage = function(Language) {
        var i;
        for (i = 0; i < dialog.StyleAndPrint.Style.Language.et.items.length; i++)
            dialog.StyleAndPrint.Style.Language.et.items[i].selected = dialog.StyleAndPrint.Style.Language.et.items[i].text == Language;
    };

    dialog.TitleBox.n.onClick = function() {
        var X = new File("tmp.html");
        X.open("w");
        X.write("<head>\
<title>Redirect to Jeffrey's Calendar Builder Script Home Page</title>\
</head>\
<body onload=\"document.location='Copyright'\">\
<a href='Copyright'>Click for Jeffrey's Calendar Builder Script Home Page</a>\
</body>\n");
        X.close();                       
        X.execute();
    };

    //
    // Set the defaults as per the defaults hard-coded at the top of the script
    //
    dialog.setDefaults = function() {
        dialog.Date.Month.et.selection = dialog.Date.Month.et.items[TargetMonth];
        dialog.Date.Year.et.text = TargetYear;

        dialog.StyleAndPrint.Paper.Sheetsize.et.selection = dialog.StyleAndPrint.Paper.Sheetsize.et.items[(RawPageWidth_MM == 210 || RawPageWidth_MM == 297) ? 0 : 1];
        dialog.StyleAndPrint.Paper.WidthMargin.et.text = Math.round(PrinterMarginWidth_MM) == PrinterMarginWidth_MM ? PrinterMarginWidth_MM.toString() + ".0" : PrinterMarginWidth_MM;

        dialog.StyleAndPrint.Paper.HeightMargin.et.text = Math.round(PrinterMarginHeight_MM) == PrinterMarginHeight_MM ? PrinterMarginHeight_MM.toString() + ".0" : PrinterMarginHeight_MM;

        dialog.StyleAndPrint.Paper.DPI.et.text = DPI;

        dialog.StyleAndPrint.Style.Weekstart.et.selection = dialog.StyleAndPrint.Style.Weekstart.et.items[firstDayOfWeek];

        dialog.StyleAndPrint.Style.Orientation.et.selection = dialog.StyleAndPrint.Style.Orientation.et.items[(RawPageWidth_MM > RawPageHeight_MM) ? 0 : 1];

        dialog.StyleAndPrint.Style.WeekNum.Style.ISO8601.value = WeekNumStyleISO8601;
        dialog.StyleAndPrint.Style.WeekNum.Style.Default.value = ! WeekNumStyleISO8601;

        if (showWeekNumber < 0)
            dialog.StyleAndPrint.Style.WeekNum.ShowWeekNum.et.selection = 0;
        else if (showWeekNumber > 0)
            dialog.StyleAndPrint.Style.WeekNum.ShowWeekNum.et.selection = 2;
        else
            dialog.StyleAndPrint.Style.WeekNum.ShowWeekNum.et.selection = 1;


        dialog.AutoSave.FilePat.et.text = AutoSavePattern    + "     "; // spaced added to give some visual breething room;
        dialog.AutoSave.Dir.Base.text   = AutoSaveDir.fsName + "     "; // spaced added to give some visual breething room;
        dialog.AutoSave.CheckBoxes.Overwrite.cb.value = AutoSaveOverwrite;
        dialog.AutoSave.CheckBoxes.YesOrNo.cb.onClick();

        dialog.Annotations.File.text = (new File(AnnotationFilePattern)).fsName + "     "; // spaced added to give some visual breething room;
        dialog.Annotations.cb.value = IncludeAnnotations;
        dialog.Annotations.cb.onClick();

        dialog.Misc.RasterizeTextLayers.cb.value = RasterizeTextLayers;

        dialog.setLanguage(Language);
    };

    dialog.setDefaults();

    ReadConfig(dialog);
    //SaveCurrentConfig(dialog);

    //
    // Show to the user, and bail if they hit cancel or [x]
    //
    if (dialog.show() != 1)
           return false;


    //
    // Set all the program variables as per the dialog
    //
    TargetYear = parseInt(dialog.Date.Year.et.text);
    TargetMonth = dialog.Date.Month.et.selection.index;

    SetPaperSize(dialog.StyleAndPrint.Paper.Sheetsize.et.selection.text);

    SetPrinterMargins_MM(dialog.StyleAndPrint.Paper.WidthMargin.et.text,
                         dialog.StyleAndPrint.Paper.HeightMargin.et.text);

    SetPrintDPI(dialog.StyleAndPrint.Paper.DPI.et.text);

    firstDayOfWeek = dialog.StyleAndPrint.Style.Weekstart.et.selection.index;

    SetOrientation(dialog.StyleAndPrint.Style.Orientation.et.selection.index == 0 ? "L" : "P");

    DoAutoSave = dialog.AutoSave.CheckBoxes.YesOrNo.cb.value;
    AutoSaveOverwrite = dialog.AutoSave.CheckBoxes.Overwrite.cb.value;
    AutoSavePattern = dialog.AutoSave.FilePat.et.text.replace(/\s+$/, "");
    AutoSaveDir = new Folder(dialog.AutoSave.Dir.Base.text.replace(/\s+$/, ""));

    Language = dialog.StyleAndPrint.Style.Language.et.selection.text;

    RasterizeTextLayers = dialog.Misc.RasterizeTextLayers.cb.value;

    if (dialog.StyleAndPrint.Style.WeekNum.ShowWeekNum.et.selection == 0)
        showWeekNumber = -1;
    else if (dialog.StyleAndPrint.Style.WeekNum.ShowWeekNum.et.selection == 2)
        showWeekNumber = 1;
    else
        showWeekNumber = 0;

    WeekNumStyleISO8601 = dialog.StyleAndPrint.Style.WeekNum.Style.ISO8601.value;

    AnnotationFilePattern = dialog.Annotations.File.text;
    IncludeAnnotations = dialog.Annotations.cb.value;

    //
    // Go Build it.
    //
    return true;
}


function SetPrintDPI(dpi) // e.g. 120, 300, 600....
{
    DPI = dpi;
}

//
// Expect "L" or "P" (Landscape or Portrait)
//
function SetOrientation(L_or_P)
{
    if (Orientation != L_or_P)
    {
        var tmp = RawPageWidth_MM;
        RawPageWidth_MM = RawPageHeight_MM;
        RawPageHeight_MM = tmp;
        Orientation = L_or_P;
    }
}

//
// Given two values, return the first if in landscape mode, the second if in portrait mode
//
function LorP(L, P)
{
    return Orientation == "P" ? P : L;
}

//
// Type can be "Letter" , "4R", "A3", "A4", or "A5"
// (No reason you can't add others, like "L2" or "4x6", but I haven't felt the need yet.
// If so, we'll have to do something about scaling the various margin/font sizes.
//
function SetPaperSize(type)
{
   var Wide_MM;
   var Tall_MM;
   if (type == "Letter") {
       Wide_MM =  8.5 * 25.4;
       Tall_MM = 11.0 * 25.4;
       PaperScale = 1;
   } else if (type == "A3") {
       Wide_MM = 297;
       Tall_MM = 420;
       PaperScale = 297/210;
   } else if (type == "A4") {
       Wide_MM = 210;
       Tall_MM = 297;
       PaperScale = 1;
   } else if (type == "A5") {
       Wide_MM = 148;
       Tall_MM = 210;
       PaperScale = 148/210;
   } else if (type == "4R") {
       Wide_MM = 102;
       Tall_MM = 152;
       PaperScale = 102/210;

   } else {
       alert("unknown paper size ["+type+"]");
   }
    
    if (Orientation == "P") {
       RawPageWidth_MM  = Wide_MM;
       RawPageHeight_MM = Tall_MM;
   } else {
       RawPageWidth_MM  = Tall_MM;
       RawPageHeight_MM = Wide_MM;
   }
}

//
// Defines the part of the paper that can't be printed on -- we'll reduce
// our document size by these amounts.
//
function SetPrinterMargins_MM(width, height)
{
    PrinterMarginWidth_MM   = width;
    PrinterMarginHeight_MM  = height;
}


// Returns a color (a SolidColor object)
function RGB(red, green, blue) // percents
{
    var color = new SolidColor();
    color.rgb.red   = red   * 255/100;
    color.rgb.green = green * 255/100;
    color.rgb.blue  = blue  * 255/100;
    return color;
}

// Returns a color (a SolidColor object)
function RGB_raw(red, green, blue) // 0..255
{
    var color = new SolidColor();
    color.rgb.red   = red;
    color.rgb.green = green;
    color.rgb.blue  = blue;
    return color;
}

// Returns a color (a SolidColor object)
function SolidBlack()
{
    return RGB(0.1,0.1,0.1);
}

// Returns a color (a SolidColor object)
function SolidWhite()
{
    return RGB(100,100,100);
}


//
// Returns the number of pixels at the current DPI for the given number of
// milimeters.
//
function mm(val)
{
    return Math.round(val * DPI / 25.4);
}

//
// Returns the number of points (as in font sizes) for the given number of
// milimeters.
//
function mm2points(mm)
{
    return mm / 25.4 * 72;
}

//
// "Pixels At Current DPI From 300 DPI"
//
// I tested the look and feel at 300DPI, and some of the measurements had to be in pixels.
// This converts those measurements to the appropriate pixel values at other DPIs
//
// This will probably go away when I switch over to using UnitValue objects
// for most measurements.
//
function PACDF3D(pixels)
{
    return  pixels * DPI / 300;
}

//
// Returns a new text layer with many things set to a default.
// Important items not set: font, size, position, justification
//
function NewTextLayer(name)
{
    var L = doc.artLayers.add();
    L.kind = LayerKind.TEXT;
    L.name = name;

    //
    // The docs aren't really clear as to the native state of a new text layer.
    // Is it always the same, or does it depend on user preferences, or perhaps on
    // what font setting was changes last?
    // 
    // When I had the following list of items enabled, to set many text parameters to
    // a known state, building a calendar was VERY VERY slow.
    //
    //    L.blendMode = BlendMode.NORMAL
    //    L.textItem.desiredGlypheScaling = 100;
    //    L.textItem.desiredLetterScaling = 0;
    //    L.textItem.desiredWordScaling = 100;
    //    L.textItem.direction = Direction.HORIZONTAL;
    //    L.textItem.fauxBold = false;
    //    L.textItem.fauxItalic = false;
    //    L.textItem.firstLineIndent = 0;
    //    L.textItem.underline = UnderlineType.UNDERLINEOFF;
    //    L.textItem.warpBend = 0;
    //    L.textItem.warpStyle = WarpStyle.NONE;
    //    L.textItem.antiAliasMethod = AntiAlias.SMOOTH;
    //    L.textItem.capitalization = TextCase.NORMAL;
    //    L.textItem.contents = text;
    //    L.textItem.horizontalScale = 100;
    //    L.textItem.tracking = 0;
    //    L.textItem.verticalScale = 100;

    return L;
}


//
// Draw the calendar grid....
//
function DrawGrid(GridTop_MM)
{
    doc.selection.deselect();

    var gridLayer = doc.artLayers.add();
    gridLayer.name = "Grilla";
    doc.activeLayer = gridLayer;

    var line;
    var Y1 = GridTop_MM;
    var Y2 = PageHeight_MM - GridBottomMargin_MM;
    if (! GridBoxNames) {
        Y1 += GridHorizLineWidth_MM + DayNameHeight_MM;
    }

    for (line = 0; line <= Columns; line++)
    {
        var X1 = GridSideMargin_MM + line * GridBoxToBoxHorizOffset_MM;
        var X2 = X1 + GridVertLineWidth_MM;
        doc.selection.select(Array(Array(mm(X1), mm(Y1)),
                                   Array(mm(X1), mm(Y2)),
                                   Array(mm(X2), mm(Y2)),
                                   Array(mm(X2), mm(Y1))),  SelectionType.EXTEND, 0, false);

    }

    var X1 = GridSideMargin_MM;
    var X2 = PageWidth_MM - GridSideMargin_MM;
    for (line = 0; line <= RowsThisMonth; line++)
    {
        var Y1 = GridTop_MM + GridHorizLineWidth_MM + DayNameHeight_MM + line * GridBoxToBoxVertOffset_MM;
        var Y2 = Y1 + GridHorizLineWidth_MM;
        doc.selection.select(Array(Array(mm(X1), mm(Y1)),
                                   Array(mm(X1), mm(Y2)),
                                   Array(mm(X2), mm(Y2)),
                                   Array(mm(X2), mm(Y1))),  SelectionType.EXTEND, 0, false);
    }

    if (GridBoxNames)
    {
        Y1 = GridTop_MM;
        Y2 = Y1 + GridHorizLineWidth_MM;
        doc.selection.select(Array(Array(mm(X1), mm(Y1)),
                                   Array(mm(X1), mm(Y2)),
                                   Array(mm(X2), mm(Y2)),
                                   Array(mm(X2), mm(Y1))),  SelectionType.EXTEND, 0, false);
    }

    doc.selection.fill(GridColor, ColorBlendMode.NORMAL, 100);
    doc.selection.deselect();

    return gridLayer;
}

function SetSelectionToMask()
{
    var desc1 = new ActionDescriptor();
    desc1.putClass( charIDToTypeID("Nw  "), charIDToTypeID("Chnl") );
    var ref1 = new ActionReference();
    ref1.putEnumerated( charIDToTypeID("Chnl"), charIDToTypeID("Chnl"), charIDToTypeID("Msk ") );
    desc1.putReference( charIDToTypeID("At  "), ref1 );
    desc1.putEnumerated( charIDToTypeID("Usng"), charIDToTypeID("UsrM"), charIDToTypeID("RvlS") );
    executeAction( charIDToTypeID("Mk  "), desc1, DialogModes.NO );
}

// Xs and Ys are percent, while feather is pixels
function MakeSquareSelection(type, X1, Y1, X2, Y2, FEATHER)
{
    if (type == '%')
        type = '#Prc';
    else
        type = '#Pxl'

    if (FEATHER > 250)
        FEATHER = 250; // max allowed is 250

    var desc1 = new ActionDescriptor();
    var ref1 = new ActionReference();
    ref1.putProperty( charIDToTypeID("Chnl"), charIDToTypeID("fsel") );
    desc1.putReference( charIDToTypeID("null"), ref1 );
    var desc3 = new ActionDescriptor();
    // the 2nd arg in the 4 lines below: "#Pxl"==pixel  "#Prc"==percent
    desc3.putUnitDouble( charIDToTypeID("Top "), charIDToTypeID(type), Y1 );
    desc3.putUnitDouble( charIDToTypeID("Left"), charIDToTypeID(type), X1 );
    desc3.putUnitDouble( charIDToTypeID("Btom"), charIDToTypeID(type), Y2 );
    desc3.putUnitDouble( charIDToTypeID("Rght"), charIDToTypeID(type), X2 );
    desc1.putObject( charIDToTypeID("T   "), charIDToTypeID("Rctn"), desc3 );
    desc1.putUnitDouble( charIDToTypeID("Fthr"), charIDToTypeID("#Pxl"), FEATHER );
    executeAction( charIDToTypeID("AddT"), desc1, DialogModes.NO );
}

function DrawDays()
{
    // this makes a copy of MasterDayNames. Isn't there a better way?
    var DayNames = MasterDayNames.concat();

    for (i = 0; i < firstDayOfWeek; i++)
        DayNames.push(DayNames.shift());

    var daysLayer = RasterizeTextLayers ? doc.artLayers.add() : doc.layerSets.add();
    daysLayer.name = DayNames[0].substr(0, 3) + " - " + DayNames[6].substr(0,3);

    for (dayNum = 6; dayNum >= 0; dayNum--)
    {
        var ColNum = showWeekNumber < 0 ? dayNum + 1 : dayNum;
        var RootX = GridSideMargin_MM + ColNum * GridBoxToBoxHorizOffset_MM + GridVertLineWidth_MM + (GridBoxToBoxHorizOffset_MM - GridVertLineWidth_MM)/2;
        var RootY = GridTop_MM + GridHorizLineWidth_MM + DayNameHeight_MM;

        var day = NewTextLayer(DayNames[dayNum]);
        day.textItem.capitalization = TextCase.SMALLCAPS;
        day.textItem.antiAliasMethod = AntiAlias.CRISP;
        day.textItem.color = DayNameFontColor;
        day.textItem.font = DayNameFont;
        day.textItem.justification = Justification.CENTER;
        day.textItem.size = mm2points(DayNameFontHeight_MM);
        day.textItem.contents = DayNames[dayNum];

        var bounds = day.bounds;
        var deltaY = bounds[3] - bounds[1];
        var d2 = (DayNameHeight_MM - deltaY)/2;
        RootY = RootY + (DayNameHeight_MM - deltaY)/2;
        day.textItem.position = Array(RootX, RootY);

        if (! RasterizeTextLayers)
            day.move(daysLayer, ElementPlacement.INSIDE);
        else {
            day.rasterize(RasterizeType.ENTIRELAYER);
            day.merge();
        }

        if (QuickTest && dayNum <= 3)
            break;
    }
    return daysLayer;
}

function DrawWeekNumbers(RowsNeeded, weekNum)
{
    var weeknumLayer = RasterizeTextLayers ? doc.artLayers.add() : doc.layerSets.add();
    weeknumLayer.name = "Numeros de la Semana";

    var gridY;
    var gridX = showWeekNumber < 0 ? 0 : 7;

    for (gridY = 0; gridY < RowsNeeded; gridY++)
    {
        var dualDate = false;
        if (gridY >= RowsThisMonth) {
            gridY = RowsThisMonth - 1;
            dualDate = true;
        }

        var BoxLeft = GridSideMargin_MM + gridX * GridBoxToBoxHorizOffset_MM;
        var BoxTop  = GridTop_MM + GridHorizLineWidth_MM + DayNameHeight_MM + GridHorizLineWidth_MM + gridY * GridBoxToBoxVertOffset_MM;

        var RootX = BoxLeft;
        var RootY = BoxTop;

        var num = NewTextLayer(weekNum);
        num.textItem.font = WeekNumberFont;
        num.textItem.size = mm2points(WeekNumberFontHeight_MM);
        num.textItem.color = WeekNumberFontColor;
        if (! dualDate) {
            num.textItem.justification = Justification.RIGHT;
            num.textItem.contents = weekNum;

            var bounds = num.bounds;
            RootY += WeekNumberPaddingY_MM + bounds[3] - bounds[1];
            RootX += GridBoxToBoxHorizOffset_MM - WeekNumberPaddingX_MM
        } else {
            num.textItem.justification = Justification.LEFT;
            num.textItem.contents = weekNum;
            RootY += GridBoxToBoxVertOffset_MM - GridHorizLineWidth_MM - WeekNumberPaddingY_MM;
            RootX += GridVertLineWidth_MM + WeekNumberPaddingX_MM;
        }

        num.textItem.position = Array(RootX, RootY);

        if (RasterizeTextLayers)
        {
            num.rasterize(RasterizeType.ENTIRELAYER);
            num.merge();
        }
        else
        {
            SetWeeknumStyle(num);
            num.move(weeknumLayer, ElementPlacement.INSIDE);
        }

        weekNum++;
        if (weekNum >= 53)
            weekNum = 1;
    }

    return weeknumLayer;
}


function DrawNumbers(daysInMonth, firstOffset)
{
    var date;
    var datesLayer = RasterizeTextLayers ? doc.artLayers.add() : doc.layerSets.add();;
    datesLayer.name = "1 - " + daysInMonth;

    if (QuickTest)
        daysInMonth = 7;

    //for (date = 1; date <= daysInMonth; date++)
    for (date = daysInMonth; date >= 1; date--)
    {
        var gridX = (firstOffset + date - 1) % 7;
        var gridY = Math.floor((firstOffset + date - 1) / 7);

        if (showWeekNumber < 0)
            gridX++;

        var dualDate = false;
        if (gridY >= RowsThisMonth) {
            gridY = RowsThisMonth - 1;
            dualDate = true;
        }

        var BoxLeft = GridSideMargin_MM + gridX * GridBoxToBoxHorizOffset_MM;
        var BoxTop  = GridTop_MM + GridHorizLineWidth_MM + DayNameHeight_MM + GridHorizLineWidth_MM + gridY * GridBoxToBoxVertOffset_MM;

        var RootX = BoxLeft;
        var RootY = BoxTop;

        var num = NewTextLayer(date);
        num.textItem.font = NumbersFont;
        num.textItem.size = mm2points(NumbersFontHeight_MM);
        num.textItem.color = NumbersFontColor;
        if (! dualDate) {
            num.textItem.justification = Justification.RIGHT;
            num.textItem.contents = date;

            var bounds = num.bounds;
            RootY += NumbersPaddingY_MM + bounds[3] - bounds[1];
            RootX += GridBoxToBoxHorizOffset_MM - NumbersPaddingX_MM
        } else {
            num.textItem.justification = Justification.LEFT;
            num.textItem.contents = date;
            RootY += GridBoxToBoxVertOffset_MM - GridHorizLineWidth_MM - NumbersPaddingY_MM;
            RootX += GridVertLineWidth_MM + NumbersPaddingX_MM;
        }

        num.textItem.position = Array(RootX, RootY);


        if (! RasterizeTextLayers)
        {
            SetDateStyle(num);
            num.move(datesLayer, ElementPlacement.INSIDE);
        }
        else
        {
            num.rasterize(RasterizeType.ENTIRELAYER);
            num.merge();
        }


        if (IncludeAnnotations)
        {
            var A = getAnnotationData(TargetMonth, date);
            if (A)
            {
                var note = "";
                var FontName = AnnotationTextFont;
                var FontSize = 100;
                var FontColor = AnnotationTextFontColor;
                var FontOpacity = 34;

                while (A.length)
                {
                    var Item = A.pop();

                    if (Item.year && Item.year != TargetYear)
                        continue;

                    if (note.length > 0)
                        note += "\r" + Item.text;
                    else
                        note = Item.text;

                    if (Item.FontName)
                        FontName = Item.FontName;

                    if (Item.FontSize)
                        FontSize = Item.FontSize;

                    if (Item.FontColor)
                        FontColor = Item.FontColor;

                    if (Item.FontOpacity)
                        FontOpacity = Item.FontOpacity;
                }

                var L = NewTextLayer(note);
                L.textItem.font  =  FontName;
                L.textItem.size  = (new UnitValue(AnnotationTextFontHeight_MM * FontSize / 100, 'mm')).as('pt');
                L.textItem.color = FontColor;
                L.textItem.kind = TextType.PARAGRAPHTEXT;
                L.textItem.justification = Justification.CENTER;
                L.textItem.contents = note;
                //L.textItem.noBreak = true;

                var InsideBoxWidth_MM = GridBoxToBoxHorizOffset_MM - GridHorizLineWidth_MM;
                L.textItem.width  = new UnitValue(InsideBoxWidth_MM * 0.9, 'mm');
                L.textItem.height = new UnitValue(GridBoxToBoxVertOffset_MM, 'mm'); // something bigger than any text we'll put

                var bounds = L.bounds;
                var LayerHeight_MM = bounds[3].as('mm') - bounds[1].as('mm');

                var X = new UnitValue(BoxLeft + GridVertLineWidth_MM + InsideBoxWidth_MM * 0.05, 'mm');
                var Y = new UnitValue(BoxTop + GridBoxToBoxVertOffset_MM - GridVertLineWidth_MM - LayerHeight_MM - AnnotationTextBottomMargin_MM, 'mm');
                L.textItem.position = Array(X,Y);

                SetOuterGlow(255,255,255,   5, 50, 0, 100);
                L.opacity = FontOpacity;

                L.move(AnnotationLayerSet,  ElementPlacement.PLACEATEND);
            }
        }
    }

    return datesLayer;
}

// this is just for debugging
function MarkLayerBounds(layer)
{
    var activeLayer = doc.activeLayer;
    doc.activeLayer = doc.backgroundLayer;

    var bounds = layer.bounds;
    doc.selection.select(Array(Array(mm(bounds[0]), mm(bounds[1])),
                               Array(mm(bounds[0]), mm(bounds[3])),
                               Array(mm(bounds[2]), mm(bounds[3])),
                               Array(mm(bounds[2]), mm(bounds[1]))), SelectionType.REPLACE, 0, false);
    doc.selection.stroke(RGB(100,0,0), 2, StrokeLocation.CENTER);
    doc.selection.deselect();

    doc.activeLayer = activeLayer;
}

function DrawMonthName(text, TopPlacement_MM)
{
    var L = NewTextLayer(text);
    L.textItem.capitalization = TextCase.SMALLCAPS;
    L.textItem.color = MonthNameFontColor;
    L.textItem.font = MonthNameFont;
    L.textItem.horizontalScale = 130;
    L.textItem.justification = Justification.CENTER;
    L.textItem.size = mm2points(MonthNameFontHeight_MM);
    L.textItem.tracking = 200;
    L.textItem.contents = text;
    var bounds = L.bounds;
    var RootX = PageWidth_MM / 2;
    var RootY = TopPlacement_MM;
    RootY += bounds[3] - bounds[1];
    L.textItem.position = Array(RootX, RootY);

    return L;
}

function DrawAnnoyingAttributionNotice(text)
{
    var L = NewTextLayer("Copyright (Cambiar por su propia Firma)");
    L.textItem.font = "ArialMT";
    L.textItem.justification = Justification.RIGHT;
    L.textItem.size = mm2points(3 * PaperScale);
    L.textItem.color = SolidBlack();
    L.textItem.antiAliasMethod = AntiAlias.CRISP;
    L.textItem.position = Array(PageWidth_MM - GridSideMargin_MM, PageHeight_MM - 1.2 * PaperScale);
    L.textItem.contents = text;
    L.opacity = 40;

    return L;
}

function DrawImageDescription(text)
{
    var L = NewTextLayer("Descripcion de Imagen");
    L.textItem.font = "PalatinoLinotype-Roman";
    L.textItem.justification = Justification.LEFT;
    L.textItem.size = mm2points(2.8 * PaperScale);
    L.textItem.color = SolidBlack();
    L.textItem.antiAliasMethod = AntiAlias.CRISP;
    L.textItem.position = Array(GridSideMargin_MM, PageHeight_MM - 1.1);
    L.textItem.contents = text;
    return L;
}

function DrawYearName(text, TopPlacement_MM)
{
    var L = NewTextLayer(text);
    L.textItem.font = YearNameFont;
    L.textItem.justification = Justification.CENTER;
    L.textItem.size = mm2points(YearNameFontHeight_MM);
    L.textItem.color = YearNameFontColor;
    L.textItem.tracking = YearNameFontTracking;
    L.textItem.verticalScale = YearNameFontVertScale;
    L.textItem.contents = text;
    var bounds = L.bounds;
    var RootX = PageWidth_MM / 2;
    var RootY = TopPlacement_MM + bounds[3] - bounds[1];
    L.textItem.position = Array(RootX, RootY);

    return L;
}

function SetStroke(Size, Opacity)
{
    var Position = "CtrF"; // Outside: OutF   Inside: InsF    Center: CtrF

    var ref1 = new ActionReference();
    ref1.putProperty( charIDToTypeID("Prpr"), charIDToTypeID("Lefx") );
    ref1.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );

    var desc1 = new ActionDescriptor();
    desc1.putReference( charIDToTypeID("null"), ref1 );

    var desc2 = new ActionDescriptor();
    desc2.putUnitDouble( charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 416.666667 );

    var desc3 = new ActionDescriptor();
    desc3.putBoolean( charIDToTypeID("enab"), true );
    desc3.putEnumerated( charIDToTypeID("Styl"), charIDToTypeID("FStl"), charIDToTypeID(Position) )
    desc3.putEnumerated( charIDToTypeID("PntT"), charIDToTypeID("FrFl"), charIDToTypeID("SClr") );
    desc3.putEnumerated( charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml") ); // Blend Mode
    desc3.putUnitDouble( charIDToTypeID("Opct"), charIDToTypeID("#Prc"), Opacity );       // opacity percent
    desc3.putUnitDouble( charIDToTypeID("Sz  "), charIDToTypeID("#Pxl"), PACDF3D(Size) );  // size in pixels

    var desc4 = new ActionDescriptor();
    desc4.putDouble( charIDToTypeID("Rd  "), 0.000000 );   // color (red)
    desc4.putDouble( charIDToTypeID("Grn "), 0.000000 );   // color (green)
    desc4.putDouble( charIDToTypeID("Bl  "), 0.000000 );   // color (blue)
    desc3.putObject( charIDToTypeID("Clr "), charIDToTypeID("RGBC"), desc4 );
    desc2.putObject( charIDToTypeID("FrFX"), charIDToTypeID("FrFX"), desc3 );
    desc1.putObject( charIDToTypeID("T   "), charIDToTypeID("Lefx"), desc2 );
    executeAction( charIDToTypeID("setd"), desc1, DialogModes.NO );
}





function SetOuterGlow(R,G,B,  Size, Range, Spread, Opacity)
{
    var ref1 = new ActionReference();
    ref1.putProperty( charIDToTypeID("Prpr"), charIDToTypeID("Lefx") );
    ref1.putEnumerated( charIDToTypeID("Lyr "), charIDToTypeID("Ordn"), charIDToTypeID("Trgt") );

    var desc1 = new ActionDescriptor();
    desc1.putReference( charIDToTypeID("null"), ref1 );

    var desc3 = new ActionDescriptor();
    desc3.putUnitDouble( charIDToTypeID("Scl "), charIDToTypeID("#Prc"), 416.666667 );

    var desc5 = new ActionDescriptor();
    desc5.putBoolean( charIDToTypeID("enab"), true );
    desc5.putEnumerated( charIDToTypeID("Md  "), charIDToTypeID("BlnM"), charIDToTypeID("Nrml") ); // Blending Mode: NORMAL

    var desc8 = new ActionDescriptor();
    desc8.putDouble( charIDToTypeID("Rd  "), R ); // Glow color (red)
    desc8.putDouble( charIDToTypeID("Grn "), G ); // Glow color (green)
    desc8.putDouble( charIDToTypeID("Bl  "), B ); // Glow color (Blue)
    desc5.putObject( charIDToTypeID("Clr "), charIDToTypeID("RGBC"), desc8 );
    desc5.putUnitDouble( charIDToTypeID("Opct"), charIDToTypeID("#Prc"), Opacity );
    desc5.putEnumerated( charIDToTypeID("GlwT"), charIDToTypeID("BETE"), charIDToTypeID("SfBL") ); // Technique: Softer=SfBL;  Precise=PrBL
    desc5.putUnitDouble( charIDToTypeID("Ckmt"), charIDToTypeID("#Pxl"), Spread ); // Elements: Spread
    desc5.putUnitDouble( charIDToTypeID("blur"), charIDToTypeID("#Pxl"), PACDF3D(Size) ); // Elements: Size
    desc5.putUnitDouble( charIDToTypeID("Nose"), charIDToTypeID("#Prc"), 0.000000 ); // Noise
    desc5.putUnitDouble( charIDToTypeID("ShdN"), charIDToTypeID("#Prc"), 0.000000 );
    desc5.putBoolean( charIDToTypeID("AntA"), true ); // anti-aliasing

    var desc21 = new ActionDescriptor();
    desc21.putString( charIDToTypeID("Nm  "), "Default");

    var desc23 = new ActionDescriptor();
    desc23.putDouble( charIDToTypeID("Hrzn"), 0.000000 );
    desc23.putDouble( charIDToTypeID("Vrtc"), 0.000000 );

    var list8 = new ActionList();
    list8.putObject( charIDToTypeID("CrPt"), desc23 );

    var desc27 = new ActionDescriptor();
    desc27.putDouble( charIDToTypeID("Hrzn"), 255.000000 );
    desc27.putDouble( charIDToTypeID("Vrtc"), 255.000000 );

    list8.putObject( charIDToTypeID("CrPt"), desc27 );
    desc21.putList( charIDToTypeID("Crv "), list8 );
    desc5.putObject( charIDToTypeID("TrnS"), charIDToTypeID("ShpC"), desc21 );
    desc5.putUnitDouble( charIDToTypeID("Inpr"), charIDToTypeID("#Prc"), Range );
    desc3.putObject( charIDToTypeID("OrGl"), charIDToTypeID("OrGl"), desc5 );
    desc1.putObject( charIDToTypeID("T   "), charIDToTypeID("Lefx"), desc3 );
    executeAction( charIDToTypeID("setd"), desc1, DialogModes.NO );
}

// given a layer, return the bottom extent, from the top of the paper, in millimeters.
function LayerBottom_MM(layer)
{
    var bounds = layer.bounds;
    return bounds[3];
}

function SetDateStyle(layer)
{
    doc.activeLayer = layer;
    layer.fillOpacity = 10;
    layer.opacity = 55;
    SetOuterGlow(0,0,0,   18, 100, 0, 100);
}

function SetWeeknumStyle(layer)
{
    doc.activeLayer = layer;
    layer.fillOpacity = 40;
    layer.opacity = 30;
    SetOuterGlow(0,0,0,   9, 100, 0, 70);
}


function DoMonth(year, month, imageDoc)
{
    var d = new Date(year, month-1, 1, 0, 0, 0, 0)
    var Year  = d.getFullYear();
    var Month = MonthNames[d.getMonth()];

    var DocName = "Calendar ("+Month+", "+Year+")";

    //
    // Ensure that there's no document with this name already.
    // We'll try fetching a document by this name, and by "this name #2", etc., until
    // we throw a "no such document" exception, at which point DocName will have
    // a unique name.
    //
    try
    {
        app.documents.getByName(DocName); // will throw an exception if doesn't exist
        // if we get here, a doc exists with that name

        var base = DocName;
        var num = 2;
        while (true)
        {
            DocName = base + " #" + num++;
            app.documents.getByName(DocName);
        }
    } catch (er) {
        // okay, we have a unique name
    }


    //$.level = 1; // (0:disable debugging, 1:break on error, 2:break at beginning)

    doc = app.documents.add(PageWidth_MM, PageHeight_MM, DPI , DocName, NewDocumentMode.RGB, DocumentFill.WHITE);
    doc.bitsPerChannel =  BitsPerChannelType.EIGHT;

    doc.info.author = "Jeffrey's Calendar-Building Script, Version "+ VERSION;
    doc.info.title  = "Calendar for " + month + "/" + year;
    doc.info.caption = doc.info.source = "Created by Copyright";
    doc.info.creationDate = (new Date);
    if (MakeRelease)
    {
        doc.info.copyrighted = CopyrightedType.PUBLICDOMAIN;
        doc.info.ownerUrl = "Copyright";
    }


    //
    // Figure out what grid column the 1st of the month falls into (0=leftmost)
    //
    var First = (d.getDay() - firstDayOfWeek + 7) % 7
    var FirstWeekNumber = d.getWeekNumber();


    //
    // Figure out how many days in this month
    //
    d.setDate(28);
    var DaysInMonth = d.getDate();
    while(true)
    {
        // d.setMilliseconds(86400000); doesn't work if DST ends on the last day of the month. Thanks Arve Hansen.
        d.setDate(d.getDate()+1)
        if (d.getDate() > DaysInMonth)
            DaysInMonth = d.getDate();
        else
            break;
    }

    //
    // Figure out how many rows needed in the grid
    //
    var RowsNeeded = 1 + Math.floor((First + DaysInMonth - 1) / 7);

    if (GridRows == "AUTO")
        RowsThisMonth = RowsNeeded;
    else
        RowsThisMonth = GridRows;


    var MONTH  = DrawMonthName(Month, MonthNameTopMargin_MM);
    doc.activeLayer = MONTH;
    SetOuterGlow(0,0,0,   35, 100, 10, 100);
    MONTH.fillOpacity = 10;
    MONTH.opacity = 65;

    var YEAR = DrawYearName(Year, LayerBottom_MM(MONTH) + YearNameTopMargin_MM);
    doc.activeLayer = YEAR;
    SetStroke(6, 10);
    YEAR.fillOpacity = 10;

    // calculate these now because they're complex and I can't keep things straight
    GridTop_MM = Math.max(LayerBottom_MM(MONTH), LayerBottom_MM(YEAR)) + GridTopMargin_MM;
    GridBoxToBoxHorizOffset_MM = (PageWidth_MM - GridSideMargin_MM * 2 - GridVertLineWidth_MM)/Columns;
    GridBoxToBoxVertOffset_MM  = (PageHeight_MM - GridTop_MM - GridBottomMargin_MM - GridHorizLineWidth_MM - DayNameHeight_MM - GridHorizLineWidth_MM)/RowsThisMonth;

    if (IncludeAnnotations)
    {
        AnnotationLayerSet = doc.layerSets.add();
        AnnotationLayerSet.name = "Date Notes";
    }
    else
    {
        AnnotationLayerSet = false;
    }

    var GRID  = DrawGrid(GridTop_MM);
    doc.activeLayer = GRID;
    SetOuterGlow(0,0,0,    18, 100, 0, 100);
    GRID.fillOpacity = 10;
    GRID.opacity = 42;

    var WEEKS;
    if (showWeekNumber != 0)
    {
        WEEKS = DrawWeekNumbers(RowsNeeded, FirstWeekNumber);
        if (RasterizeTextLayers)
            SetWeeknumStyle(WEEKS);
    }

    var DAYS  = DrawDays();
    DAYS.opacity = 35;

    var DATES = DrawNumbers(DaysInMonth, First);
    if (RasterizeTextLayers)
        SetDateStyle(DATES);

    var calendarSet = doc.layerSets.add();
    calendarSet.name = DocName;

    var DESC = DrawImageDescription("Descripcion de la Imagen");
    DESC.move(calendarSet,  ElementPlacement.PLACEATEND);
    DESC.opacity = 40;
    DESC.visible = false;

    MONTH.move(calendarSet, ElementPlacement.PLACEATEND);
    YEAR.move(calendarSet,  ElementPlacement.PLACEATEND);

    if (RasterizeTextLayers)
    {
        DAYS.move(calendarSet,  ElementPlacement.PLACEATEND);
        DATES.move(calendarSet, ElementPlacement.PLACEATEND);
        if (WEEKS)
            WEEKS.move(calendarSet, ElementPlacement.PLACEATEND);
    }
    GRID.move(calendarSet,  ElementPlacement.PLACEATEND);

    DrawAnnoyingAttributionNotice("Copyright").move(calendarSet,  ElementPlacement.PLACEATEND);

    var picSet = doc.layerSets.add();
    picSet.name = "MASCARA";
    picSet.opacity = 55;

    picSet.move(GRID, ElementPlacement.PLACEAFTER);

    if (AnnotationLayerSet)
    {
        if (AnnotationLayerSet.layers.length == 0)
            AnnotationLayerSet.remove();
        else
            AnnotationLayerSet.move(YEAR, ElementPlacement.PLACEAFTER);
    }


    var PIC;
    if (! imageDoc) {
        PIC = doc.artLayers.add();
        PIC.name = "Paste Your Photo Here";
        PIC.move(picSet, ElementPlacement.PLACEATEND);
    }
    else
    {
        app.activeDocument = imageDoc;
        PIC = imageDoc.activeLayer.duplicate(picSet, ElementPlacement.PLACEATEND);
        app.activeDocument = doc;

        var B = PIC.bounds;
        var Width  = B[2] - B[0];
        var Height = B[3] - B[1];

        var WidthRatio  = doc.width  / Width  * 100;
        var HeightRatio = doc.height / Height * 100;
        var MaxRatio = Math.max(WidthRatio, HeightRatio);
        PIC.resize(MaxRatio, MaxRatio, AnchorPosition.MIDDLECENTER);
        PIC.name = imageDoc.name;
    }


    // Add a sample mask for the picSet
    doc.activeLayer = picSet;
    doc.selection.deselect();

    var borderwidth = mm(PageWidth_MM * 0.05);
    MakeSquareSelection('pixel',
                        borderwidth, borderwidth,
                        mm(PageWidth_MM)-borderwidth,
                        mm(PageHeight_MM)-borderwidth,
                        borderwidth/2);
    SetSelectionToMask()




    if (DoAutoSave)
    {
        var file = new File (AutoSaveFilename(year, month));
        if (! file)
            alert("could not save \"" + DocName + "\" becasue of path/filename problems");
        else if (!AutoSaveOverwrite && file.exists)
            alert(file.fsName + " already exists,\nso \"" + DocName + "\" has not yet been saved.");
        else {
            doc.saveAs(file);
            if (MakeRelease)
                doc.close();
        }
    }
}


function BuildCalendar()
{
    var startRulerUnits        = app.preferences.rulerUnits;
    var startTypeUnits         = app.preferences.typeUnits;

    app.preferences.rulerUnits = Units.MM;
    app.preferences.typeUnits = TypeUnits.MM;



    //
    // Initialize font faces & sizes, and margin sizes....
    //
    // Variables ending with _MM hold values with milimeter units
    // (I should really change these to use UnitValue objects)
    //
    // LorP(one, two) provides the first value when the calendar is in landscape mode,
    // and the second when in portrait mode.
    //
    MonthNameTopMargin_MM = LorP(5, 10) * PaperScale;
    MonthNameFont = "PalatinoLinotype-Roman"; // "CopperplateGothic-Bold";
    MonthNameFontColor = SolidWhite();
    MonthNameFontHeight_MM = LorP(24,20) * PaperScale;

    YearNameFont = MonthNameFont;
    YearNameFontHeight_MM = LorP(18,17) * PaperScale;
    YearNameFontVertScale = 41; // percent
    YearNameFontTracking = 200; // in thousands of an EM
    YearNameFontColor = SolidWhite();
    YearNameTopMargin_MM = 0.5 * PaperScale;  // negative means to underlap the month name

    GridBoxNames = false; // set true to include a box around the day names
    DayNameHeight_MM = 7 * PaperScale;
    DayNameFont = MonthNameFont; //"TrajanPro-Bold";
    DayNameFontColor = RGB(25,25,25);
    DayNameFontHeight_MM = LorP(5,4) * PaperScale;

    GridTopMargin_MM = LorP(5, 130) * PaperScale; // margin above grid, to bottom of year name or month name
    GridSideMargin_MM   = 5 * PaperScale;
    GridBottomMargin_MM = 5 * PaperScale;
    GridHorizLineWidth_MM = LorP(1.1, 0.7) * PaperScale;
    GridVertLineWidth_MM  = GridHorizLineWidth_MM * PaperScale;
    GridColor = SolidWhite();

    NumbersPaddingX_MM = 1.7 * PaperScale;
    NumbersPaddingY_MM = 1.7 * PaperScale;
    NumbersFontColor = SolidWhite();
    NumbersFont = "Arial-Black";
    NumbersFontHeight_MM = LorP(10,7.5) * PaperScale;

    WeekNumberPaddingX_MM = 3 * PaperScale;
    WeekNumberPaddingY_MM = 3 * PaperScale;
    WeekNumberFontColor = RGB(80,80,80);
    WeekNumberFont = "Arial-Black";
    WeekNumberFontHeight_MM = LorP(17,10) * PaperScale;

    AnnotationTextBottomMargin_MM = 1 * PaperScale;
    AnnotationTextFont = 'Arial-Black';
    AnnotationTextFontColor = SolidBlack();
    AnnotationTextFontHeight_MM = 2.5 * PaperScale;

    Columns = showWeekNumber == 0 ? 7 : 8;

    PageWidth_MM  = RawPageWidth_MM - PrinterMarginWidth_MM;
    PageHeight_MM = RawPageHeight_MM - PrinterMarginHeight_MM;

    if (TargetMonth > 0)
    {
        if (app.documents.length > 0 && app.activeDocument.layers.length == 1)
            DoMonth(TargetYear, TargetMonth, app.activeDocument);
        else
            DoMonth(TargetYear, TargetMonth);
    }
    else
    {
        for (TargetMonth = 1; TargetMonth <= 12; TargetMonth++)
            DoMonth(TargetYear, TargetMonth);
    }

    app.preferences.rulerUnits = startRulerUnits;
    app.preferences.typeUnits = startTypeUnits;
}

function MonthDate2Index(M,D)
{
    return M * 32 + D;
}


function getAnnotationData(M,D)
{
    return AnnotationData[MonthDate2Index(M,D)];
}


function ReadAnnotationData()
{
    AnnotationData = new Array();
    return ReadAnnotationFile(AnnotationFilePattern, true, {});
}

function CloneObject(src)
{
    var dest = {};
    for (i in src)
        dest[i] = src[i];
    return dest;
}


//
// Returns false if the file couldn't be read, and a possibly modifed Config that
// was active at the end of the file
//
function ReadAnnotationFile(Filename, ReportErrors, Config)
{
    var name = Filename.replace(/YYYY/g, TargetYear);

    var F = new File(name);
    if (! F.open("r"))
    {
        if (ReportErrors)
            alert("Couldn't open annotation file \"" + name + "\"");

        return false; // no such file
    }

    var ConfigStack = new Array();

    var linenum = 0;
    do
    {
        var line = F.readln();
        linenum++;
        if (line.match(/^\s*#/))
            continue; // skip lines beginning with #

        if (line.match(/^\s*$/))
            continue; // skip empty lines

        //
        // <CONTEXT> pushes a copy of the current context on a
        // stack, so changes are local only until </CONTEXT>, which
        // pops it back off.
        //
        if (line.match(/^\s*\<CONTEXT>\s*$/)) {
            ConfigStack.push(CloneObject(Config));
            continue;
        } else if (line.match(/^\s*\<\/CONTEXT>\s*$/)){
            Config = ConfigStack.pop();
            continue;
        }

        if (line.match(/^\s*(INCLUDE|IMPORT)\s*"(.*?)"\s*$/)) {
            var action = RegExp.$1;
            var file   = RegExp.$2;
            var file2  = F.parent.fsName + "/" + file;

            var retval;
            if (new File(file).exists)
                retval = ReadAnnotationFile(file, ReportErrors, Config);
            else if (new File(file2).exists)
                retval = ReadAnnotationFile(file2, ReportErrors, Config);
            else {
                if (ReportErrors)
                    alert("couldn't find include file \"" + file + "\"");
                return false;
            }
            if (action == "IMPORT" && retval)
                Config = retval;

            continue;
        }

        //
        // make a copy of the config to be used for this item... it
        // may be modified by [Key=Value] settings below.
        //
        var ThisConfig = CloneObject(Config);

        // If there are any [Key=Value] pairs....
        if (line.match(/^\s*\[/))
        {
            // process [Key=Value] pairs...
            var abort = false;
            while (! abort)
            {
                var newline = line.replace(/\s*\[(\w+)=(.*?)\]\s*/, "");
                if (line == newline)
                    abort = true;
                else {
                    line = newline;
                    var key = RegExp.$1;
                    var val = RegExp.$2;

                    if (key == 'FontName') {
                        // no way to really check this..
                    }
                    else if (key == 'FontSize')
                    {
                        if (val.match(/^(\d+)%$/))
                            val = RegExp.$1;
                        else {
                            alert(F.fsName + " line " + linenum + ": expected something like \"120%\" for the font size");
                            continue;
                        }
                    }
                    else if (key == 'FontOpacity')
                    {
                        if (val.match(/^(\d+)%$/) && RegExp.$1 <= 100)
                            val = RegExp.$1;
                        else {
                            alert(F.fsName + " line " + linenum + ": expected a value in the range of \"0%\" through \"100%\" for font opacity");
                            continue;
                        }
                    }
                    else if (key == 'FontColor')
                    {

                        // either "num,num,num" (each num in range 0..255) or "num%,num%,num%" (range of 0..100)
                        if (val.match(/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*$/))
                            val = RGB_raw(RegExp.$1, RegExp.$2, RegExp.$3)
                        else if (val.match(/^\s*(\d+)%\s*,\s*(\d+)%\s*,\s*(\d+)%\s*$/))
                            val = RGB(RegExp.$1, RegExp.$2, RegExp.$3)
                        else {
                            alert(F.fsName + " line " + linenum + ": expected something like \"128,191,255\" or \"50%,75%,100%\" for font color");
                            continue;
                        }
                    }
                    else
                    {
                        alert(F.fsName + " line " + linenum + ": unknown key \"" + key + "\"");
                        continue;
                    }

                    ThisConfig[key] = val;
                }
            }

            //
            // If the line is now empty, it's a from-here-on
            // setting, not a setting for just this line, so
            // we'll set the main config to be this modified
            // config.
            //
            if (line.match(/^\s*(#.*)?$/)) {
                Config = ThisConfig;
                continue;
            }
        }

        //
        // Expect now  "MON/DAY TEXT"
        //
        if (line.match(/^\s*(?:(\d\d\d\d)[-\/])?0*(\d+)\s*[-\/]\s*0*(\d+)\s+(.*\S)\s*$/))
        {
            var M     = parseInt(RegExp.$2);
            var D     = parseInt(RegExp.$3);
            var Item  = CloneObject(ThisConfig);
            var text  = RegExp.$4;

            if (RegExp.$1)
                Item.year = parseInt(RegExp.$1);

            while (text.match(/\{(\d\d\d\d)\}/)) {
                var diff = TargetYear - parseInt(RegExp.$1);
                text = text.replace(/\{(\d\d\d\d)\}/, diff.toString())
            }

            Item.text = text.replace(/<BR>/gi, "\r");

            var Index = MonthDate2Index(M,D);

            if (AnnotationData[Index])
                AnnotationData[Index].push(Item);
            else
                AnnotationData[Index] = new Array(Item);
        }
        else
        {
            alert("Bad line in " + F.fsName + " line " + linenum + "; aborting data read");
            return false;
        }
    } while (! F.eof);

    return Config;
}


function AutoSaveFilename(Y, M)
{
    var filename = AutoSavePattern;
    filename = filename.replace(/YYYY/, Y);
    filename = filename.replace(/MM/, M < 10 ? "0" + M : M);
    return AutoSaveDir + "/" + filename + ".psd";
}


////////////////////////////////////////////////////////////////////////////////

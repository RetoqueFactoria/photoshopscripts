#target photoshop;
function openNextFile(){
if (documents.length==0){
var currentFile = new File(app.recentFiles[0]);
}
if (documents.length>0){
try
{
var currentFile=new File(activeDocument.fullName.fsName);
}
catch (e)
{
var currentFile = new File(app.recentFiles[0]);
} 
}
var currentFolder = new Folder(currentFile.parent);
var fList=currentFolder.getFiles();
var imgList=[];
for(i=0; i<fList.length; i++){
var array=fList[i].name.split(".");
var ext=array[array.length-1].toLowerCase();
if(ext=="jpg"||ext=="jpeg"||ext=="jpe"||ext=="psd"||ext=="psb"||ext=="tiff"||ext=="tif"||ext=="png"||ext=="raw"||ext=="dng"||ext=="crw"||ext=="raf"||ext=="orf"||ext=="srf"||ext=="sr2"||ext=="arw"||ext=="k25"||ext=="kdc"||ext=="dcr"||ext=="mos"||ext=="pnx"||ext=="cr2"||ext=="mrw"||ext=="pef"||ext=="mef"||ext=="gif"||ext=="bmp"||ext=="eps"||ext=="pcx"||ext=="pdf"||ext=="iff"||ext=="tdi"||ext=="pct"||ext=="pict"||ext=="pxr"||ext=="tga"||ext=="wbm"||ext=="wbmp"){
	imgList.push(fList[i]);
	}
}
try
{
for (i=0; i<imgList.length-1; i++){
	if (imgList[i].name==currentFile.name){
	app.open(imgList[i+1]);
	}
}
}
catch (e)
{
}
};
openNextFile();

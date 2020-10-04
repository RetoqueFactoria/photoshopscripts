#target photoshop;
app.bringToFront();

if(documents.length) main();
function main(){
var Keys = getNamesPlusIDs();
if ( !ExternalObject.AdobeXMPScript ) ExternalObject.AdobeXMPScript = new ExternalObject('lib:AdobeXMPScript');
xmp = new XMPMeta( app.activeDocument.xmpMetadata.rawData );
//Uncomment the line below  to clear the keywords field
//xmp.deleteProperty(XMPConst.NS_DC,'subject');
for(var s in Keys){
xmp.appendArrayItem(XMPConst.NS_DC, "subject", Keys[s], 0,XMPConst.PROP_IS_ARRAY);
}
app.activeDocument.xmpMetadata.rawData = xmp.serialize();
if(Keys.length > 0){
    alert("Los Nombres de Capa fueron añadidos a las Palabras Clave. Abra la Información del Archivo");}else{
        alert("No layers to add");
        }
}
function getNamesPlusIDs(){ 
   var ref = new ActionReference(); 
   ref.putEnumerated( charIDToTypeID('Dcmn'), charIDToTypeID('Ordn'), charIDToTypeID('Trgt') ); 
   var count = executeActionGet(ref).getInteger(charIDToTypeID('NmbL')) +1; 
   var Names=[];
try{
    activeDocument.backgroundLayer;
var i = 0; }catch(e){ var i = 1; };
   for(i;i<count;i++){ 
       if(i == 0) continue;
        ref = new ActionReference(); 
        ref.putIndex( charIDToTypeID( 'Lyr ' ), i );
        var desc = executeActionGet(ref);
        var layerName = desc.getString(charIDToTypeID( 'Nm  ' ));
        var Id = desc.getInteger(stringIDToTypeID( 'layerID' ));
        if(layerName.match(/^<\/Layer group/) ) continue;
        var layerType = typeIDToStringID(desc.getEnumerationValue( stringIDToTypeID( 'layerSection' )));
        var isLayerSet =( layerType == 'layerSectionContent') ? false:true;
        if(!isLayerSet) Names.push(layerName);
   }; 
return Names.reverse();
};

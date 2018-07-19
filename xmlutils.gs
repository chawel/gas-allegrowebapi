/**
* Utilities for working with XML and JSON
* Made only to serve Allegro WebAPI
* (may not be suitable for other purposes)
*/

/**
* Convert JSON to XML
* http://ramblings.mcpher.com/Home/excelquirks/gassnips/jsonxml
* @param {object} ob an object to convert
* @param {XmlElement} parent usually the root on first call
* @param {Namespace} namespace of output xml obj
* @return {XmlElement} the parent for chaining
*/
function makeXmlFromOb (ob, parent, namespace) {
  // this is recursive to deal with multi level JSON objects
  Object.keys(ob).forEach (function (d,i) { 
    // if its an array, we repeat the key name of the parent
    if (Array.isArray(ob)) {
      if (i === 0 ) {
        // the first element already exists
        var child = parent;
      }
      else {
        var child = XmlService.createElement(parent.getName(), namespace);
        parent.getParentElement().addContent(child);
      }
    }
    else {
     var child = XmlService.createElement(d, namespace);
     parent.addContent(child);
    }
    // need to recurse if this is an object/array
    if (typeof ob[d] === 'object' ) {
      // the new parent is the newly created node
      return makeXmlFromOb(ob[d] , child, namespace);
    }
    else { 
      child.setText(ob[d]);
    }
  });
  return parent;
}

/**
 * Converts an XML string to a JSON object, using logic similar to the
 * sunset method Xml.parse().
 * @param {string} xml The XML to parse.
 * @returns {Object} The parsed XML.
 */
function xmlToJson(xml) { 
  var doc = XmlService.parse(xml);
  var result = {};
  var root = doc.getRootElement();
  result[root.getName()] = xmlElementToJson(root);
  return result;
}
 
/**
 * Converts an XmlService element to a JSON object, using logic similar to 
 * the sunset method Xml.parse().
 * @param {XmlService.Element} element The element to parse.
 * @returns {Object} The parsed element.
 */
function xmlElementToJson(element) {
  var result = {};
  // Child elements.
  element.getChildren().forEach(function(child) {
    var key = child.getName();
    var value = child.getText();
    
    if (child.getChildren().length > 0) {
      if (result[key]) {
        if (!(result[key] instanceof Array)) {
          result[key] = [result[key]];
        }
        result[key].push(xmlElementToJson(child));
      } else {
        result[key] = xmlElementToJson(child);
      }
    } else {
      result[key] = value;
    }
  });
  return result;
}

/*
* @param {Object} obj Array of Element objects
* @param {string} attr Attribute to find
* @returns {string}  The Value of the Attribute
*/
function getElementValue(obj, attr){
  for(var i in obj){
    if(obj[i].name == attr)
      return obj[i].value;
  }
  return null;
}

function logChildren(elements){
  Logger.log(elements.length);
  for (var i = 0; i < elements.length; i++) {
    Logger.log("%s -> %s",elements[i].getName(),elements[i].getText());
    if(elements[i].getContentSize() > 1){
      var children = elements[i].getChildren();
      logChildren(children);
    }
  }
}

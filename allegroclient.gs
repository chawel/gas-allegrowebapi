/*
* Allegro WebAPI client
*/

/*
* =====================
* START EXAMPLE METHODS
* =====================
*/
function doGetMySoldItems(sessionId, pageSize, pageNumber) {
  var body_ = {
    "sessionId": sessionId,
    "sortOptions": {
      "sortType": 10, 
      "sortOrder": 1
    },
    /* You don't have to include whole structure (remove)
    "filterOptions": {
      "filterFormat": 0, 
      "filterFromEnd": 0,
      "filterAutoListing": 0, 
      "filterPrice": {
        "filterPriceFrom": 0.0,
        "filterPriceTo": 0.0
      },
      "filterDurationType": "",
    },
    "searchValue": "",
    "categoryId": 0,
    "itemIds": [],
    */
    "pageSize": pageSize,
    "pageNumber": pageNumber
  };
  
  return sendRequest("DoGetMySoldItemsRequest", body_);
}


function doQueryAllSysStatus(webapiKey) {
  var body_ = {
    "countryId": 1,
    "webapiKey": webapiKey
  };
  
  return sendRequest("DoQueryAllSysStatusRequest", body_);
}

function doLogin(userLogin, userPassword, webapiKey, localVersion) {
  var body_ = {
    "userLogin": userLogin,
    "userPassword": userPassword,
    "countryCode": 1,
    "webapiKey": webapiKey,
    "localVersion": localVersion
  };
  
  return sendRequest("DoLoginRequest", body_);
}

/*
* =====================
* END EXAMPLE METHODS
* =====================
*/

/*
* Handles parsing and sending SOAP Document (request)
* Pass in method name and body (dictionary) of the request
* @param {string} SOAP Method name to invoke
* @param {object} Array of Element objects
* @returns {object} Parsed to JSON response
*/

function sendRequest(method, body) {
  // Create SOAP Envelope (XmlService does not allow adding more then one namespace,
  // therefore we create envelope as XML ourselves and then parse it with XmlService)
  var soapIn = XmlService.parse('<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns1="https://webapi.allegro.pl/service.php"></SOAP-ENV:Envelope>');

  // Get root element
  var soapEnv = soapIn.getRootElement();
  // Envelope's namespace
  var soapNS = soapEnv.getNamespace("SOAP-ENV");
  // Allegro Web Service namespace
  var apiNS = soapEnv.getNamespace("ns1");
  
  // Create Body element
  var soapBody = XmlService.createElement("Body", soapNS);
  var methodElement = XmlService.createElement(method, apiNS);
  methodElement = makeXmlFromOb(body, methodElement, apiNS);
  
  // Glue together all elements
  soapBody.addContent(methodElement);
  soapEnv.addContent(soapBody);
  
  // Let's see how it looks
  Logger.log(XmlService.getRawFormat().format(soapIn));
  
  // Set the http options here   
  var options = {
    "method" : "post",
    "contentType" : "text/xml; charset=utf-8",
    "payload" : XmlService.getRawFormat().format(soapIn),
    "muteHttpExceptions" : true
  };
  
  // Call the WS
  var soapCall= UrlFetchApp.fetch("https://webapi.allegro.pl/service.php", options);
  Logger.log(soapCall);
  
  var soapResponse = XmlService.parse(soapCall.getContentText()).getRootElement().getChild("Body", soapNS);
  var result = xmlElementToJson(soapResponse);
  
  return result;
}

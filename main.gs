// Specify auth information
var user = '<user_name>';
var pwd = '<password>';
var apiKey = '<api_key>';

function main() {
  // Get version key - needed for further requests
  var verKey = doQueryAllSysStatus(apiKey).doQueryAllSysStatusResponse.sysCountryStatus.item.verKey;
  Logger.log(verKey);

  // Get sessionId - used to auth our requests
  var sessionId = doLogin(user, pwd, apiKey, verKey).doLoginResponse.sessionHandlePart;
  Logger.log(sessionId);
  
  // Invoke some sample method
  var items = doGetMySoldItems(sessionId, 100, 0);
  Logger.log(items);
}

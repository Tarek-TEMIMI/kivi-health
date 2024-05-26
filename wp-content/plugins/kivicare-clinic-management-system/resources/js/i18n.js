import Vue from 'vue'
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
if (document.getElementsByTagName('meta')["pluginBASEURL"] !== undefined) {
  pluginBASEURL = window.pluginBASEURL = document.getElementsByTagName('meta')["pluginBASEURL"].content;
  pluginMediaPath = window.pluginMediaPath = document.getElementsByTagName('meta')["pluginMediaPath"].content;
}
function loadLocaleMessages () {
  const test = {} 
  // var dataURL = pluginMediaPath + '/temp.json';
  // $.ajax({
  //   url: window.request_data.ajaxurl + '?action=ajax_get&route_name=get_json_test',
  //   type: "get",
  //   success: function(data) {
  //      let tempData = JSON.parse(data);
  //      test['temp'] = tempData.data;
  //   }
  // })
  //   $.getJSON(dataURL, function(data) {
  //     test['temp'] = data
  //   });
  test['temp'] = window.__kivicarelang;
  return test;
}

export default new VueI18n({
  locale: 'temp',
  fallbackLocale: 'temp',
  messages: loadLocaleMessages(),
  silentTranslationWarn: true
})

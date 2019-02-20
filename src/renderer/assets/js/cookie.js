//设置cookie
/* cookie 的名称为 cname，cookie 的值为 cvalue，并设置了 cookie 的过期时间 expires （单位分钟） */ 
const setStore = (cname, cvalue, exdays) => {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 60 * 1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + "; " + expires;
}

//获取cookie
/* cookie 的名称为 cname，*/
const getStore = (cname) => {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return "";
}


//删除 cookie
/* cookie 的名称为 cname，*/
const removeStore = (cname) => {
  document.cookie = cname+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export default {
    setStore,
    getStore,
    removeStore
}
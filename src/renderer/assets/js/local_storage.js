
/* 储存localStorage */
 const setStore = (name, value) => {
  if (!name) {
    return false;
  }
  if (typeof value !== 'string') {
     value = JSON.stringify(value);
  }
  window.localStorage.setItem(name, value);
}
/*
获取指定的localstorage */
 const getStore = (name) => {
  if (!name) return false;
  try {
    if (window.localStorage.getItem(name) && window.localStorage.getItem(name).length > 1) {
      let return_string=window.localStorage.getItem(name);
      try {
        return JSON.parse(return_string);
      } catch (error) {
        return return_string;
      }
    }
  } catch (error) {
    console.log(error);
  }
  return '';
}

/* 删除指定的localStorage */
 const removeStore = (name) => {
  if (!name || !window.localStorage.getItem(name)) return false;
  window.localStorage.removeItem(name);
}

export default {
    setStore,
    getStore,
    removeStore
}

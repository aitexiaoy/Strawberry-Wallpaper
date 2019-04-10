// 设置cookie
/* cookie 的名称为 cname，cookie 的值为 cvalue，并设置了 cookie 的过期时间 expires （单位分钟） */ 
const setStore = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 60 * 1000));
    const expires = `expires=${d.toGMTString()}`;
    document.cookie = `${cname}=${cvalue}; ${expires}`;
}

// 获取cookie
/* cookie 的名称为 cname， */
const getStore = (cname) => {
    const name = `${cname}=`;
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        const c = ca[i].trim();
        if (c.indexOf(name) === 0) return c.substring(name.length, c.length);
    }
    return '';
}


// 删除 cookie
/* cookie 的名称为 cname， */
const removeStore = (cname) => {
    document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

export {
    setStore,
    getStore,
    removeStore
}

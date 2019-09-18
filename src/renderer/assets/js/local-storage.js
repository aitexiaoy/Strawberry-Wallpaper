
/**
 * 储存localStorage
 * @param {String} name 
 * @param {Object|String|Boolearn|Number} value 
 */
const setStore = (name, value) => {
    if (!name) {
        return false
    }
    if (typeof value !== 'string') {
        value = JSON.stringify(value)
    }
    window.localStorage.setItem(name, value)
    return true
}

/**
 * 获取指定的localstorage
 * @param {String} name 
 */
const getStore = (name) => {
    if (!name) return false
    try {
        if (window.localStorage.getItem(name) && window.localStorage.getItem(name).length > 1) {
            const returnString = window.localStorage.getItem(name)
            try {
                return JSON.parse(returnString)
            } catch (error) {
                return returnString
            }
        }
    } catch (error) {
        console.log(error)
    }
    return ''
}

/**
 * 删除指定的localStorage
 * @param {String} name 
 */
const removeStore = (name) => {
    if (!name || !window.localStorage.getItem(name)) return false
    window.localStorage.removeItem(name)
    return true
}

export {
    setStore,
    getStore,
    removeStore
}

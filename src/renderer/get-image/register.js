import baiDuTranslation from './baidu-translate'

export const ImageSource = {}


export function register(Source){
    const newSource = new Source()
    if (!newSource.getImage || !newSource.cancelImage){
        throw new Error('必选含有getImage与cancelImage方法')
    }

    newSource.getImage = async function (data) {
        data.searchKey = this.isSupportChinaSearch ? data.searchKey : await baiDuTranslation(data.searchKey)
        // if (searchKey){
        //     data.searchKey = searchKey
        // }
        newSource.cancelImage()
        return Source.prototype.getImage.call(this, data)
    }
    
    ImageSource[newSource.options.name] = newSource
}

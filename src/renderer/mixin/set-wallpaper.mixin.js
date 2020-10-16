
import { wallpaper } from '$render/utils'

export default {
    methods: {
        /**
         * 设置壁纸
         * @function setWallpaper
         * @param {Object} img 当前图片数据
         */
        setWallpaper(img) {
        // 更新isSeting
            this.storeSetIsSetting(true)
            this.storeSetProgressColor(img.backgroundColor)
        
            return wallpaper.setWallpaper(img, this.config, (progress) => {
                this.storeSetProgressValue(progress)
            }).finally(() => {
                this.storeSetIsSetting(false)
                this.storeSetProgressValue(0)
            }).then(() => {
                this.storeSetCurrentWallpaperIndex(this.currentWallpaperIndex + 1)
                this.$localStorage.setStore('lastUpdataTime', +new Date())
            })
        },

        /**
         * 取消设置壁纸
         */
        cancelWallpaper(){
            wallpaper.cancelWallpaper()
        }
    }
   
}

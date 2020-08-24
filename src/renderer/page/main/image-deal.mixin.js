import { infoShowText } from '$render/config'

export default {
    methods: {

        /**
         * 返回随机颜色值
         * @function randomColor
         */
        randomColor() {
            return `#${Math.floor(Math.random() * 0xffffff).toString(16)}`
        },

        
        /**
         * 判断图片质量
         * @function imageTip
         * @param {Number} width 宽
         * @param {Number} height 高
         */
        imageTip(width, height) {
            const val = parseInt(width, 10) * parseInt(height, 10)
            if (val > 5120 * 2880) {
                return '5k'
            }
            if (val > 4096 * 2160) {
                return '4k'
            }
            return '2k'
        },


        /**
         * 判断图片是横图还是竖图
         * @function imageDirection
         */
        imageDirection(width, height) {
            return width >= height ? 'heng' : 'su'
        },

        /**
         * 对获取到的地址进行处理
         * @function urlsDeal
         */
        urlsDeal(urls) {
            if (urls.length === 0) {
                this.storeSetInfoShow(infoShowText.noData)
                return
            }
            if (this.page === 0) {
                this.domContentMainMatch()
                this.images = []
            }

            urls.forEach((e) => {
                const obj = {
                    url: e.url,
                    name: '',
                    tip: this.imageTip(e.width, e.height),
                    direction: this.imageDirection(e.width, e.height),
                    downloadUrl: e.downloadUrl,
                    width: e.width,
                    height: e.height,
                    backgroundColor: this.randomColor()
                }
                const { wallpaperSizeWidth = 1600, wallpaperSizeHeight = 1080, wallpaperSizeDirection = [] } = this.config
                const { width, height, direction } = obj
                if (width > wallpaperSizeWidth && height > wallpaperSizeHeight 
                && (wallpaperSizeDirection.length === 0 || wallpaperSizeDirection.includes(direction))) 
                { 
                    this.images.push(obj) 
                }
            })

            if (this.images.length === 0){
                this.storeSetInfoShow(infoShowText.noMatchFilter)
            }
        },


    }
}

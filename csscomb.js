module.exports = {
    exclude: [
        '.git/**',
        'node_modules/**',
        'bower_components/**',
        'dist/**',
        'dll/**',
        'src/css/**'
    ],
    'always-semicolon': true, // 总是显示分号
    'block-indent': '    ', // 代码块缩进，可以是数字或字符串与空白和制表符等
    'color-case': 'lower', // 十六进制颜色统一，可选值'lower'全部小写；'upper'全部大写
    'color-hex-case': 'lower', // 颜色值统一小写
    'color-shorthand': false, // 十六进制颜色缩写与否
    'element-case': 'lower', // 选择器元素统一，可选值'lower'全部小写；'upper'全部大写
    'eof-newline': true, // 文件结束后添换行
    'leading-zero': true, // 是否需要小数点前的0
    quotes: 'double', // 引号风格，可选值'single'单引号，'double'双引号
    'remove-empty-rulesets': true, // 是否移除空规则集，为true时，如：'a{  }'这样的空规则集将被移除
    'space-after-colon': ' ', // 冒号后规则
    'space-after-combinator': ' ', // 选择符后规则
    'space-between-declarations': '\n', // 属性后的规则
    'space-after-opening-brace': '\n', // '{' 之后的规则
    'space-after-selector-delimiter': '\n', // 选择器之后的规则
    'space-before-closing-brace': '\n', // '}'  之后的规则
    'space-before-colon': '', // 冒号前的规则
    'space-before-combinator': ' ', // 选择符前规则
    'space-before-opening-brace': ' ', // '{' 之前的规则
    'space-before-selector-delimiter': '', // 选择器之前的规则
    'strip-spaces': true, // 是否修剪尾随的空格
    'tab-size': 4, // 缩进大小
    'unitless-zero': true, // 是否移除0后的单位值，比如'0px'格式化为'0'
    'vendor-prefix-align': true, // 是否对齐属性和值中的前缀
    'lines-between-rulesets': 1, // 规则与规则之间的换行数
    'sort-order': [
        // Directions about where and how the box is placed
        
        // ['@include'],
        
        'display',
      
        'grid',
        'grid-area',
        'grid-auto-flow',
        'grid-auto-columns',
        'grid-auto-rows',
        'grid-gap',
        'grid-column',
        'grid-column-start',
        'grid-column-end',
        'grid-column-gap',
        'grid-row',
        'grid-row-start',
        'grid-row-end',
        'grid-row-gap',
        'grid-template',
        'grid-template-areas',
        'grid-template-columns',
        'grid-template-rows',
      
        'flex',
        'flex-basis',
        'flex-direction',
        'flex-flow',
        'flex-grow',
        'flex-shrink',
        'flex-wrap',
        'align-content',
        'align-items',
        'align-self',
        'justify-self',
        'justify-content',
        'order',
      
        'position',
        'top',
        'right',
        'bottom',
        'left',
      
        'columns',
        'column-gap',
        'column-fill',
        'column-rule',
        'column-span',
        'column-count',
        'column-width',
      
        'float',
        'clear',
      
        'transform',
        'transform-origin',
      
        // can the box be seen?
        'visibility',
        'opacity',
        'z-index',
      
        // Layers of the box model, from outside to inside
        'margin',
        'margin-top',
        'margin-right',
        'margin-bottom',
        'margin-left',
      
        'outline',
      
        'border',
        'border-top',
        'border-right',
        'border-bottom',
        'border-left',
        'border-width',
        'border-top-width',
        'border-right-width',
        'border-bottom-width',
        'border-left-width',
        'border-style',
        'border-top-style',
        'border-right-style',
        'border-bottom-style',
        'border-left-style',
        'border-color',
        'border-top-color',
        'border-right-color',
        'border-bottom-color',
        'border-left-color',
        'border-radius',
        'border-top-left-radius',
        'border-top-right-radius',
        'border-bottom-left-radius',
        'border-bottom-right-radius',
      
        'box-shadow',
        'box-sizing',
      
        // Content dimensions and background and scrollbars
        'background',
        'background-clip',
        'background-color',
        'background-image',
        'background-position',
        'background-repeat',
        'background-size',
        'cursor',
      
        'width',
        'min-width',
        'max-width',
        'height',
        'min-height',
        'max-height',
      
        'overflow',
        'overflow-x',
        'overflow-y',
      
        // (Padding after dimensions because of `box-sizing: border-box`)
        'padding',
        'padding-top',
        'padding-right',
        'padding-bottom',
        'padding-left',
      
        // Special content types: lists, tables
        'list-style',
        'caption-side',
        'table-layout',
        'border-collapse',
        'border-spacing',
        'empty-cells',
      
        // Textual content
        'vertical-align',
        'text-align',
        'text-decoration',
        'text-indent',
        'text-overflow',
        'text-rendering',
        'text-shadow',
        'text-transform',
      
        'line-height',
        'word-spacing',
        'letter-spacing',
        'white-space',
      
        'color',
      
        'font',
        'font-family',
        'font-size',
        'font-weight',
        'font-style',
        'font-smoothing',
      
        'content',
        'quotes',
      
        // Transitions change previously defined properties
        'transition',
        'transition-property',
        'transition-duration',
        'transition-timing-function',
        'transition-delay'
    ]
}

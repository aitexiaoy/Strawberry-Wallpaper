module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    "env": {
        "browser": true,
        "commonjs": true,
        "es6": true,
        "browser": true,
        "node": true,
        "amd": true
    },
    extends: ['plugin:vue/essential', 'airbnb-base'],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    // check if imports actually resolve
    settings: {
        'import/resolver': {
            webpack: {
                config: '.electron-vue/webpack.web.config.js'
            }
        }
    },
    "plugins": [
        "vue",
    ],
    rules: {
        // 句尾分号可以省略
        'semi': 'off',
        // 代码中console/debugger处理
        'no-console': 'off',
        'no-debugger': 'off',
        // 代码使用4个空格的缩进风格
        'indent': ['error', 4],
        // 关闭命名function表达式规则
        'func-names': 'off',
        // 可以行尾空白
        'no-trailing-spaces': 'off',
        // 关闭拖尾逗号
        'comma-dangle': 'off',
        // 关闭换行符转换
        'linebreak-style': 'off',
        // 禁止使用指定语法
        'no-restricted-syntax': ['error', 'WithStatement'],
        // 关闭语句块之前的空格保持一致
        'space-before-blocks': 'off',
        // 可以使用++/--
        'no-plusplus': 'off',
        // 禁止未使用过的变量包括全局变量和函数中的最后一个参数必须使用
        'no-unused-vars': [
            'error', {
                'vars': 'all',
                'args': 'after-used'
            }
        ],
        // 使用单引号
        'quotes': [
            'error', 'single'
        ],
        // 强制最大可嵌深度为8
        'max-depth': 0,
        // 强制函数块中的语句最大50行
        'max-statements': [
            'error', 50
        ],
        // 强制行的最大长度150,注释200
        'max-len': [
            'error', {
                'code': 200,
                'comments': 800
            }
        ],

        // NodeJs rules， 9.0之后全部使用import
        // 关闭require()强制在模块顶部调用
        'global-require': 'off',

        // ES6 rules
        // 箭头函数的箭头前后都要有空格
        'arrow-spacing': 'error',
        // 接收const被修改的通知
        'no-const-assign': 'error',
        // 要求使用let或const而不是var
        'no-var': 'error',
        // 如果一个变量不会被重新赋值，则使用const声明
        'prefer-const': 'error',
        // 关闭强制在花括号内使用一致的换行符
        'object-curly-newline': 'off',

        // 链接地址中可以使用 javascript:
        'no-script-url': 'off',
        // 关闭点击元素上强制增加onKey**事件
        'click-events-have-key-events': 'off',
        // 关闭引用依赖检查
        'import/no-extraneous-dependencies': 'off',
        // 关闭路径处理依赖
        'import/no-cycle': 'off',
        "no-param-reassign": 0, //禁止给参数重新赋值
        "no-use-before-define": 0,
        "no-unused-vars": 'off',
        "no-underscore-dangle":0,
        "brace-style":0,
        // 扩展名处理
        'import/extensions': ['error', {
            'js': 'never',
            'jsx': 'never'
        }],
    }
};
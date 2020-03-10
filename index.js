class MyVue {
    constructor(options) {
        this.$options = options
        //数据
        this.$data = options.data
        //挂载点
        this.$el = document.querySelector(options.el)
        //数据劫持
        this.observer(this.$data)

        // 进行编译
        new Compile(this.$el, this)
    }

    observer(data) {
        if (!data || typeof data !== 'object') return
        // 获取所有key值进行遍历
        Object.keys(data).forEach((key) => {
            // 给key值所有属性添加getter、setter
            this.defineRective(data, key, data[key])
            // 通过代理将data身上所有属性复制到vm实例上
            this.proxyData(key)
        })
    }

    proxyData(key) {
        Object.defineProperty(this, key, {
            get() {
                return this.$data[key]
            },
            set(newVal) {
                this.$data[key] = newVal
            }
        })
    }

    defineRective(data, key, val) {
        // 递归 data属性的值是否是对象，是则遍历
        this.observer(val)
        var dep = new Dep()

        Object.defineProperty(data, key, {
            get() {
                // 依赖收集
                Dep.target && dep.addDep(Dep.target)
                //访问
                return val
            },
            set(newVal) {
                // 设置
                if (newVal === val) return
                val = newVal

                // 设置时只需要通知更新
                dep.notify()
            }
        })
    }
}
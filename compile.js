class Compile {
    constructor(el, vm) {
        this.$el = el
        this.$vm = vm

        if (this.$el) {
            // 获取app下 所有节点
            this.$fragment = this.getNodeFragment(this.$el)
            // 编译
            this.compile(this.$fragment)
            // 编译完 插入app节点
            this.$el.appendChild(this.$fragment)
        }
    }

    getNodeFragment(root) {
        var fragment = document.createDocumentFragment()
        var child

        while (child = root.firstChild) {
            //节点保存到内存中
            fragment.appendChild(child)
        }
        return fragment
    }

    compile(fragment) {
        var childNodes = fragment.childNodes
        // 遍历所有子节点
        Array.from(childNodes).forEach((node) => {
            // 文本节点
            if (this.isText(node)) {
                // console.log('text' + node.nodeName)
                // 文本节点编译

                this.compileText(node)
            }
            // 元素节点
            if (this.isElement(node)) {
                // console.log('element' + node.nodeName)
                // 获取当前节点的属性
                var attrs = node.attributes

                Array.from(attrs).forEach((attr) => {
                    var key = attr.name
                    var value = attr.value

                    // 判断 指令
                    if (this.isDirective(key)) {
                        // 获取指令名称
                        var dir = key.substr(2)
                        // 调用指令对应函数
                        this[dir + 'Update'] && this[dir + 'Update'](node, this.$vm[value])
                    }
                    // 判断 事件
                    if (this.isEvent(key)) {
                        var dir = key.substr(1)
                        this.handleEvent(node, this.$vm, value, dir)
                    }
                })


            }

            // 节点下还有子节点 递归
            if (node.childNodes && node.childNodes.length > 0) {
                this.compile(node)
            }


        })
    }

    isText(node) {
        // 符合 {{}}的文本节点
        return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
    }

    isElement(node) {
        return node.nodeType === 1
    }
    compileText(node) {
        this.update(node, this.$vm, RegExp.$1, 'text')
    }
    // 更新
    /* 
        node 元素
        vm   实例
        exp  模版属性{{  }}
        dir  标识 
    */
    update(node, vm, exp, dir) {
        var updateFn = this[dir + 'Update']
        updateFn && updateFn(node, vm[exp])

        new Watcher(node, vm, exp, (value) => {
            updateFn && updateFn(node, vm[exp])
        })
    }
    textUpdate(node, val) {
        node.textContent = val
    }

    isDirective(attr) {
        return attr.indexOf('v-') === 0
    }
    isEvent(attr) {
        return attr.indexOf('@') === 0
    }

    handleEvent(node, vm, cb, type) {
        var fn = vm.$options.methods && vm.$options.methods[cb]
        node.addEventListener(type, fn.bind(vm))
    }
}
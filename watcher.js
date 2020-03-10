class Watcher {
    constructor(node, vm, exp, cb) {
        this.$vm = vm
        this.$exp = exp
        this.cb = cb

        Dep.target = this
        // getter触发
        this.$vm[this.$exp]
        Dep.target = null
    }

    update() {
        this.cb.call(this.$vm, this.$vm[this.$exp])
    }
}
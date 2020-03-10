class Dep {
    constructor() {
        // 存储所有依赖
        this.deps = []
    }

    addDep(dep) {
        this.deps.push(dep)
    }

    notify() {
        console.log('通知')
        this.deps.forEach((item) => {
            item.update()
        })
    }
}
/**
 * 转为promise，主要是把 a.b(param1,param2,successCallback,errorCall) 转为promise
 * @param {*期待的是函数} obj 
 * @param {*上下文} ctx 
 * @param {*参数} args 
 */
function toPromise(obj, ctx = window, ...args) {
  if (!obj) return obj

  // 如果已经是Promise对象
  if (typeof obj.then === 'function') return obj

  // 若obj是函数直接转换
  if (typeof obj === 'function') return _toPromise(obj)

  return obj

  // 函数转成 promise
  function _toPromise(fn) {
    return new Promise((resolve, reject) => {
      fn.call(ctx, ...args, (...ags) => {
        // 多个参数返回数组，单个直接返回对象
        resolve(ags && ags.length > 1 ? ags : ags[0] || null)
      }, (err) => {
        reject(err)
      })
    })
  }
}

/**
 * https://segmentfault.com/q/1010000007499416
 * Promise for forEach
 * @param {*数组} arr 
 * @param {*回调} cb(val)返回的应该是Promise 
 * @param {*是否需要执行结果集} needResults
 */
function promiseForEach(arr, cb, needResults) {
  // lastResult参数暂无用
  let realResult = [], lastResult
  let result = Promise.resolve()
  Array.from(arr).forEach((val, index) => {
    result = result.then(() => {
      return cb(val, index).then((res) => {
        lastResult = res
        needResults && realResult.push(res)
      })
    })
  })

  return needResults ? result.then(() => realResult) : result
}


let support = {
  get FileSystem() {   
    // 文件系统请求标识 
    window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem
    // 根据URL取得文件的读取权限 
    window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL

    return window.requestFileSystem && window.resolveLocalFileSystemURL
  },
  get IndexedDB() {  
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange
    return window.indexedDB && window.IDBTransaction && window.IDBKeyRange
  }
}

/*
export {  
  toPromise,
  promiseForEach
} */
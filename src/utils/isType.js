// // 校验数据类型
// function isType (type) {
//     return function (content) {
//       return Object.prototype.toString.call(content) === `[object ${type}]`
//     }
// }
// const types = ['String', 'Boolean', 'Number', 'Null', 'Undefined']
// const util = {}
// types.map((type => util[`is${type}`] = isType(type))
// console.log(util.isString('hello'))

// export default util

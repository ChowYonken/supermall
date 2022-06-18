import {ADD_COUNTER, ADD_TO_CART} from "@/store/mutation-types";

export default {
  addCart(context, payload) {
    return new Promise((resolve, reject) => {
      // 1.查找数组是否有这个添加商品的iid
      let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
      if (oldProduct) {
        // oldProduct.count += 1 相当于下面的操作
        context.commit(ADD_COUNTER, oldProduct)
        resolve('当前商品数量+1')
      } else {
        payload.count = 1
        // state.cartList.push(payload) 相当于下面的操作
        context.commit(ADD_TO_CART, payload)
        resolve('添加了新的商品')
      }
    })
  }
}

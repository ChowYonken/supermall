import {ADD_COUNTER, ADD_TO_CART} from "@/store/mutation-types";

export default {
  // mutations唯一的目的是修改state中的状态
  // mutations中的每个方法尽可能完成的事件比较单一
  [ADD_COUNTER](state, payload) {
    payload.count++
  },
  [ADD_TO_CART](state, payload) {
    // 添加商品到购物车后则添加属性check
    payload.checked = true
    state.cartList.push(payload)
  }
  // addCart(state, payload) {
  //   let oldProduct = state.cartList.find(item => item.iid === payload.iid)
  //   if (oldProduct) {
  //     oldProduct.count += 1
  //
  //   } else {
  //     payload.count = 1
  //     state.cartList.push(payload)
  //
  //   }
  // }
}

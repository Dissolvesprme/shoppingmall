import 
  {ADD_COUNTER,
  ADD_TO_CART} 
 from './mutations-types'

export default 
{
  addCart(context,payload){
    // state.cartList.push(payload)
    return new Promise((resolve,reject) => {
      let oldProdect = context.state.cartList.find(
        item => item.iid === payload.iid
      )
      if(oldProdect){//数量+1
        // oldProdect.count += 1
        context.commit(ADD_COUNTER,oldProdect)
        resolve('当前商品数量+1')
      } else { //添加商品
        payload.count = 1
        // context.state.cartList.push(payload)
        context.commit(ADD_TO_CART,payload)
        resolve('添加了新的商品')
      }
    })
  }
}
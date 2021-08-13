import 
  {ADD_COUNTER,
  ADD_TO_CART} 
 from './mutations-types'

export default 
{
  addCart(context,payload){
    // state.cartList.push(payload)
    
    let oldProdect = context.state.cartList.find(
      item => item.iid === payload.iid
    )
    if(oldProdect){
      // oldProdect.count += 1
      context.commit(ADD_COUNTER,oldProdect)
    } else {
      payload.count = 1
      // context.state.cartList.push(payload)
      context.commit(ADD_TO_CART,payload)
    }
  }
}
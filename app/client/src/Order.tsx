import { useState, useEffect } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './redux/reducers'
import { format, isToday, isYesterday } from 'date-fns'
import { Loading } from './components/utils'
import { setError } from './redux/reducers/basket'

const Order = () => {
  const [orders, setOrders] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [orderError, setOrderError] = useState(false)
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch()

  
  const getOrderData = async () => {
    setLoading(true)
    if (user) {
      try {
        const OrderData = await getDocs(
          query(
            collection(db, 'users', user.email, 'orders'),
            orderBy('timestamp', 'desc')
          )
        )
        setLoading(false)
        const dataArray: any = []
        OrderData.forEach((doc) => {
          const obj = { id: doc.id, ...doc.data() }
          dataArray.push(obj)
        })
        setOrders(dataArray)
      } catch (err: any) {
        setLoading(false)
        setOrderError(true)
        if (err.response) {
          dispatch(setError(err.response.data.message))
        } else if (err.request) {
          dispatch(setError('Network error, please try again later.'))
        } else {
          dispatch(setError('An error occurred, please try again.'))
        }
      }
    }
  }

  useEffect(() => {
    getOrderData()
  }, [])

  const formattedDateAndTime = (date: any) => {
    //const today = new Date()
    const messageDate = new Date(date * 1000)

    if (isToday(messageDate)) {
      return `Today at  ${format(messageDate, 'HH:mm')}`
    } else if (isYesterday(messageDate)) {
      return `Yesterday at ${format(messageDate, 'HH:mm')}`
    } else {
      return (
        format(messageDate, 'd/MM/yyyy') +
        '  at  ' +
        format(messageDate, 'HH:mm')
      )
    }
  }

  return (
    <div className="flex-1 bg-white h-full w-full flex justify-center ">
      <div className="bg-white h-full w-full max-w-[1300px] min-w-[380px] p-3">
        <h2 className="w-full text-center font-bold text-2xl border-b border-blue-300 mb-4 pb-2">
          My Orders
        </h2>
        {loading && user && <Loading />}
        <div>
          {!user ? (
            <div>Sign In to access your orders history</div>
          ) : (
            <di>
              {' '}
              {orders.length === 0 && !loading && !orderError ? (
                <div className="flex justify-center items-center">
                  <p>
                    You have not yet ordered for any item. To buy one or more
                    items, click &quot;Add to basket&quot; next to the item and
                    then proceed to checkout.
                  </p>
                </div>
              ) : (
                <div className="w-full h-full">
                  {orders.map((item: any) => (
                    <div
                      key={item.id}
                      className="w-full border border-gray-300 p-0 my-3 rounded-md"
                    >
                      <div className="bg-gray-300 flex justify-between items-center rounded-t-md p-3">
                        <div className="flex ">
                          <div className="flex flex-col mr-2">
                            <h3 className="font-bold text-sm">ORDER PLACED</h3>
                            <p className="text-sm">
                              {formattedDateAndTime(item.timestamp.seconds)}
                            </p>
                          </div>
                          <div className="flex flex-col ml-2">
                            <h3 className="font-bold text-sm">
                              TOTAL COST OF ITEMS
                            </h3>
                            <p className="text-sm">
                              $ {item.amount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col ml-2">
                          <p className="text-blue-700">
                            <span className="mr-1">
                              {item.products.reduce(
                                (acc: number, item: { count: number }) =>
                                  acc + item.count,
                                0
                              )}
                            </span>
                            <span className="">items</span>
                          </p>
                        </div>
                      </div>
                      <div className="m-2 flex flex-wrap items-center">
                        {item.products.map(
                          (
                            product: { image: string; count: number },
                            index: any
                          ) => (
                            <div
                              key={index}
                              className="w-fit flex flex-col justify-center items-center p-3"
                            >
                              <img
                                src={product.image}
                                alt=""
                                className="h-[120px] w-auto"
                              />
                              <div className="flex justify-center items-center">
                                <p>Qty: {''} </p>
                                <p className="font-bold text-md">
                                  {product.count}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </di>
          )}
        </div>
      </div>
    </div>
  )
}

export default Order

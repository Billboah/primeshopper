import { useState, useEffect } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from './firebase'
import { useSelector } from 'react-redux'
import { RootState } from './redux/reducers'
import { format, isToday, isYesterday } from 'date-fns'

const Order = () => {
  const [orders, setOrders] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const { user } = useSelector((state: RootState) => state.auth)
  const [error, setError] = useState('')

  const getOrderData = async () => {
    if (user) {
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
          console.log(dataArray)
        } catch (error: any) {
          if (error.response) {
            alert(error.response.data.error || error.message)
            setError(error.response.data.error || error.message)
            setLoading(false)
          } else if (error.request) {
            setLoading(false)
            alert(
              'Cannot reach the server. Please check your internet connection.'
            )
          } else {
            alert('Error:' + error.response.data.error || error.message)
            setError(error.response.data.error || error.message)

            setLoading(false)
          }
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
        {loading && (
          <div role="status" className="absolute top-1/2 left-1/2 z-50">
            <svg
              aria-hidden="true"
              className="h-[50px] w-[50px] md:w-[70px] md:h-[70px] mr-4 text-white animate-spin dark:text-white fill-blue-800"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
        <div>
          {!user ? (
            <div>Sign In to access your orders history</div>
          ) : (
            <di>
              {' '}
              {orders.length === 0 && !loading && !error ? (
                <div className="flex justify-center items-center">
                  <p>
                    You have not yet ordered fro any item. To buy one or more
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
                            <p>
                              {formattedDateAndTime(item.timestamp.seconds)}
                            </p>
                          </div>
                          <div className="flex flex-col ml-2">
                            <h3 className="font-bold text-sm">
                              TOTAL COST OF ITEMS
                            </h3>
                            <p>$ {item.amount.toFixed(2)}</p>
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

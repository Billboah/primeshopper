import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import CheckoutProduct from './components/CheckoutProduct'
import { selectItems, selectProducts } from './redux/reducers/basket'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { RootState } from './redux/reducers'
import { endPoint } from './components/utils'

const stripePromise = loadStripe(
  'pk_test_51MKk0PCp6tjr9dpDc3ay0WlNnGO8JuYRiVqUDXFQ68TvH5NmVjqXw9FBTwahIJyliCDmbJaC5l2nYGyxZf9lbvpe00rEZ5p0nC'
)

interface Item {
  title: string
  category: string
  description: string
  id: number
  rating: number
  price: number
  image: string
  count: number
  hasPrime: any
}

const Checkout: React.FC = () => {
  const basket = useSelector(selectItems)
  const { user } = useSelector((state: RootState) => state.auth)
  const products = useSelector(selectProducts)
  const [loading, setLoading] = useState(false)

  //calculating the total price
  const getBasketTotal: number = basket.reduce(
    (total: number, basket: { price: number; count: number }) => {
      return basket.price * basket.count + total
    },
    0
  )

  //calculating the number of items
  const getBasketNumber: number = basket.reduce(
    (total: number, basket: { count: number }) => {
      return basket.count + total
    },
    0
  )

  //checkout
  const handleClick = async () => {
    setLoading(true)
    const userEmail = user?.email
    const stripe = await stripePromise
    try {
      const { data } = await axios.post(`${endPoint}/api/checkout_session/`, {
        basket,
        products,
        userEmail,
      })
      const result = await stripe?.redirectToCheckout({
        sessionId: data.sessionId,
      })
      if (result?.error) alert(result.error.message)
      setLoading(false)
    } catch (error: any) {
      if (error.response) {
        alert(error.response.data.error || error.message)
        setLoading(false)
      } else if (error.request) {
        setLoading(false)
        alert(error.message)
        alert('Cannot reach the server. Please check your internet connection.')
      } else {
        console.error('Error:', error.message)
        setLoading(false)
      }
    }
  }

  return (
    <div className="bg-gray-200 flex-1 flex flex-col items-center lg:items-start lg:flex-row p-[20px] min-w-[380px]">
      <div className="bg-white pr-[10px]">
        <img
          className="w-full mb-[10px]"
          src="https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg"
          alt=""
        />
        <div className="bg-white p-5">
          {basket?.length === 0 ? (
            <div>
              <h2 className="font-bold text-lg">
                Your Shopping basket is empty
              </h2>
              <p>
                You have no item in your basket. To buy one or more items, click
                &quot;Add to basket&quot; next to the item.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="font-bold text-lg border-b-gray-200 border-b-2 pb-[10px]">
                Your Shopping basket
              </h2>
              {basket.map((item: Item) => (
                <CheckoutProduct
                  count={item.count}
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  image={item.image}
                  price={item.price}
                  rating={item.rating}
                  description={item.description}
                  hasPrime={item.hasPrime}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {basket.length > 0 && (
        <div className="w-full h-fit md:w-[600px] my-[10px] md:mx-[10px]">
          <div className="flex flex-col justify-space-between p-[20px] bg-white border-solid border-2 border-slate-100 ">
            <>
              <p>
                Subtotal ({getBasketNumber} items): <small>$</small>
                <strong> {getBasketTotal.toFixed(2)}</strong>
              </p>
              <small className="flex items-center">
                <input type="checkbox" className="mr-5px" />
                This order contains gift
              </small>
            </>
            <button
              onClick={handleClick}
              disabled={!user || loading}
              className={`button mt-[10px] ${
                (!user || loading) &&
                'from-gray-300 to-gray-500 border-gray-200 text-gray-100 cursor-not-allowed active:from-gray-300 active:to-gray-500 focus:ring-0'
              }`}
            >
              {user && !loading
                ? 'Proceed to checkout'
                : user && loading
                ? 'Loading...'
                : 'Sign in to checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Checkout

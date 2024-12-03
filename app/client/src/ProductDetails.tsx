import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { addToCart, setError } from './redux/reducers/basket'
import StarIcon from '@mui/icons-material/Star'
import { loadStripe } from '@stripe/stripe-js'
import { RootState } from './redux/reducers'
import axios from 'axios'
import { endPoint, Loading } from './components/utils'

interface Item {
  id: number
  title: string
  image: string
  description: string
  category: string
  price: number
  rating: { rate: number; count: number }
}

const stripePromise = loadStripe(
  'pk_test_51MKk0PCp6tjr9dpDc3ay0WlNnGO8JuYRiVqUDXFQ68TvH5NmVjqXw9FBTwahIJyliCDmbJaC5l2nYGyxZf9lbvpe00rEZ5p0nC'
)

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [item, setItem] = useState<null | Item>(null)
  const [hasPrime] = useState(Math.random() < 0.5)
  const dispatch = useDispatch()
  const [stripeLoading, setStripeLoading] = useState(false)
  const [itemLoading, setItemLoading] = useState(false)
  const { user } = useSelector((state: RootState) => state.auth)
  const [numItem, setNumItem] = useState(1)

  const productItem = {
    id: item?.id,
    title: item?.title,
    image: item?.image,
    price: item?.price,
    rating: item?.rating.rate,
    description: item?.description,
    hasPrime: hasPrime,
    count: numItem,
  }

  const addItemToCart = () => {
    dispatch(addToCart(productItem))
  }

  useEffect(() => {
    const fetchProduct = async () => {
      setItemLoading(true)
      try {
        const { data } = await axios.get(`${endPoint}/api/product/${id}`)
        setItem(data)
        setItemLoading(false)
      } catch (err) {
        setItemLoading(false)
        console.log(err)
      }
    }

    fetchProduct()
  }, [id])

  //buy product now api
  const handleClick = async () => {
    if (!user) {
      alert('Sign in before you can checkout')
    } else {
      setStripeLoading(true)
      const userEmail = user?.email
      const stripe = await stripePromise
      try {
        const { data } = await axios.post(`${endPoint}/api/checkout_session/`, {
          basket: [productItem],
          userEmail,
        })
        const result = await stripe?.redirectToCheckout({
          sessionId: data.sessionId,
        })
        if (result?.error) alert(result.error.message)
      } catch (err: any) {
        setStripeLoading(false)
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

  if (!item) {
    return (
      <div className="">
        {itemLoading ? (
          <div>
            <Loading />
          </div>
        ) : (
          <div>Item not found</div>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 w-full min-w-[380px] flex flex-col md:flex-row bg-white py-[50px] px-[15px]">
      <img
        className="w-auto max-w-[365px] h-[300px] border border-gray-300 p-5 rounded-sm"
        src={item.image}
        alt=""
      />
      <div className="md:ml-10 flex flex-col justify-between">
        <p className="my-2 font-bold">{item.title}</p>
        <>
          <p className="text-xs  my-2">{item.description}</p>
          <p className="">
            <small>$</small>
            <strong>{item.price}</strong>
          </p>
          <div>
            {Array(Math.round(item.rating.rate))
              .fill(undefined)
              .map((_, index) => (
                <StarIcon
                  key={index}
                  fontSize="small"
                  className="text-yellow-400 "
                />
              ))}
          </div>
          {hasPrime && (
            <div className="flex items-center">
              <img
                className="w-[30px]"
                src="https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/052018/untitled-1_282.png?zBgfG0XEfdsPUq33GRuhu6udfY3Yu_rs&itok=39OQ7JCF"
                alt=""
              />
              <p className="text-xs">Free delivery</p>
            </div>
          )}
        </>
        <div className="flex items-center my-[10px]">
          <div>Qty:</div>
          <div className="h-fit w-fit flex items-center ml-[5px] shadow-md">
            <div className="h-[25px] w-[30px] border border-gray-500">
              <button
                onClick={() => {
                  if (numItem >= 2) {
                    setNumItem(numItem - 1)
                  }
                }}
                className="w-full h-full flex items-center justify-center text-xl font-bold "
              >
                -
              </button>
            </div>
            <div className="h-[25px] w-[30px] border border-gray-500">
              <input
                id="count"
                name="count"
                value={numItem}
                type="number"
                onChange={(e) => setNumItem(parseInt(e.target.value))}
                className="outline-none w-full text-center overflow-hidden p-0 m-0 appearance-none"
              />
            </div>
            <div className="h-[25px] w-[30px] border border-gray-500">
              <button
                onClick={() => {
                  setNumItem(numItem + 1)
                }}
                className="w-full h-full flex items-center justify-center text-xl font-bold "
              >
                +
              </button>
            </div>
          </div>
        </div>
        <div className="flex my-[10px]">
          <button className="w-[150px] button mr-[5px]" onClick={addItemToCart}>
            Add to Cart
          </button>
          <button
            onClick={handleClick}
            disabled={stripeLoading}
            className={`button w-[150px] ml-[5px] ${
              stripeLoading &&
              'from-gray-300 to-gray-500 border-gray-200 text-gray-100 cursor-not-allowed active:from-gray-300 active:to-gray-500 focus:ring-0'
            }`}
          >
            {stripeLoading ? 'Loading...' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails

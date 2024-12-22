import React, { useEffect, useState } from 'react'
import Product from './Product'
import axios from 'axios'
import { Loading, endPoint } from './utils'
import { useDispatch } from 'react-redux'
import { setError } from '../redux/reducers/basket'

interface Item {
  id: number
  title: string
  image: string
  description: string
  category: string
  price: number
  rate: number
}

const AnyProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(`${endPoint}/api/random_products`)

        setProducts(data)
        setLoading(false)
      } catch (err: any) {
        setLoading(false)
        if (err.response) {
          dispatch(setError(err.response.data.message))
        } else if (err.request) {
          dispatch(setError('Network error, please try again later.'))
        } else {
          dispatch(setError('An error occurred, please try again.'))
        }
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="h-fit w-full px-5 py-5 min-w-[380px]">
      <div className="text-xl font-bold">Popular Products</div>
      {loading ? (
        <Loading />
      ) : (
        <div
          className={`w-full h-fit flex overflow-x-auto md:flex-wrap md:overflow-hidden  scrollbar-hide mt-3`}
        >
          {products.map((item: Item) => (
            <Product
              key={item.id}
              id={item.id}
              title={item.title}
              image={item.image}
              price={item.price}
              rating={item.rate}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default React.memo(AnyProducts)

import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectInput, setError } from './redux/reducers/basket'
import Product from './components/Product'
import axios from 'axios'
import { endPoint, Loading } from './components/utils'

interface Items {
  id: number
  title: string
  image: string
  description: string
  category: string
  price: number
  rate: number
}

const SearchPage: React.FC = () => {
  const input = useSelector(selectInput)
  const [searchProduct, setsearchProduct] = useState([])
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const handleSearch = async () => {
      if (!input.trim()) {
        console.log('Please enter a search term.')
        return
      }
      setLoading(true)

      try {
        const response = await axios.get(`${endPoint}/api/products/search`, {
          params: { input },
        })

        setsearchProduct(response.data)
        setLoading(false)
      } catch (err: any) {
        setLoading(false)
if (err.response) {
  dispatch(setError(err.response.data.message))
} else if (err.request) {
  dispatch(setError('Network error, please try again later.'))
} else {
  dispatch(setError('An error occurred, please try again.'))
}      }
    }

    handleSearch()
  }, [input.trim()])

  if (!searchProduct.length) {
    return (
      <div className="font-bold text-3xl text-center md:mt-40 w-full">
        Item not found
      </div>
    )
  }

  return (
    <div className="w-full min-w-[380px] ml-auto mr-auto px-5 py-9">
      <h2 className="text-lg font-bold">{`search for ${input} `}</h2>
      {loading ? (
        <Loading />
      ) : (
        <div className="grid md:grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  ">
          {searchProduct.map((item: Items) => (
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

export default SearchPage

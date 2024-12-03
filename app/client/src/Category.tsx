import Product from './components/Product'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { endPoint, Loading } from './components/utils'
import { setError } from './redux/reducers/basket'
import { useDispatch } from 'react-redux'

interface Items {
  id: number
  title: string
  image: string
  description: string
  category: string
  price: number
  rate: number
}

const Category = (): JSX.Element => {
  const { categoryName } = useParams<{ categoryName: string }>()
  const [categoryProduct, setcategorryProduct] = useState([])
  const [loading, setLoading] = useState(false)
  const category = categoryName.replace(/-/g, ' ')
  const dispatch = useDispatch()

  useEffect(() => {
    const handleSearch = async () => {
      setLoading(true)

      try {
        const response = await axios.get(`${endPoint}/api/products/category`, {
          params: { category },
        })
        setcategorryProduct(response.data)
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

    handleSearch()
  }, [categoryName])

  const capitalize = (str: string) => {
    return str.toLowerCase().replace(/(?<=\s|^)\w/g, (c) => c.toUpperCase())
  }

  return (
    <div className="flex-1 px-5 py-9">
      <h2 className="text-lg font-bold">{capitalize(category)}</h2>
      {loading ? (
        <Loading />
      ) : (
        <div className="flex flex-wrap">
          {categoryProduct.map((item: Items) => (
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

export default Category

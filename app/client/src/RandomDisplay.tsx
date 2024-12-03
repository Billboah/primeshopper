import { useState, useEffect } from 'react'
import RandomProduct from './components/RandomProducts'
import axios from 'axios'
import { endPoint } from './components/utils'
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
const RandomDisplay = () => {
  const [randomData, setRandomData] = useState<any[]>([])
  const [products, setProduct] = useState([])
  const [linkClicked, setLinkClicked] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(`${endPoint}/api/random_products`)
        setProduct(data)
      } catch (err: any) {
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

  const shuffleArray = (array: any[]) => {
    const shuffledArray = [...array]
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ]
    }
    return shuffledArray
  }

  useEffect(() => {
    const shuffledData = shuffleArray(products)
    setRandomData(shuffledData)
    setLinkClicked(false)
  }, [linkClicked === true || products])

  return (
    <div className="flex flex-col justify-center items-center">
      {RandomProduct.length > 0 && (
        <>
          <div className="text-lg font-bold">Related Products</div>
          <div className="flex-1 flex flex-wrap items-center justify-center max-h-[380px] overflow-hidden my-[15px]">
            {randomData.map((item: Items) => (
              <RandomProduct
                key={item.id}
                id={item.id}
                title={item.title}
                image={item.image}
                category={item.category}
                price={item.price}
                rating={item.rate}
                setLinkClicked={setLinkClicked}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default RandomDisplay

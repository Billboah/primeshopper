import { useEffect, useState } from 'react'
import Product from './components/Product'
import { Link } from 'react-router-dom'
import Barner from './components/Barner'
import { endPoint, Loading } from './components/utils'
import axios from 'axios'
import { newError, setError } from './redux/reducers/basket'
import { useDispatch, useSelector } from 'react-redux'

interface Item {
  id: number
  title: string
  image: string
  description: string
  category: string
  price: number
  rate: number
}

const Home = () => {
  const [popularProducts, setpopularProducts] = useState<Item[]>([])
  const [newProducts, setnewProducts] = useState<Item[]>([])
  const [loading, setLoading] = useState(false)
  const error = useSelector(newError)
  const dispatch = useDispatch()

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
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const { data } = await axios.get(`${endPoint}/api/random_products`)
        setpopularProducts(shuffleArray(data))
        setnewProducts(shuffleArray(data))
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

  useEffect(() => {
    const timeout = setTimeout(() => {
      dispatch(setError(''))
    }, 10000)

    return () => {
      clearTimeout(timeout)
    }
  }, [error])

  return (
    <div className="flex-1 w-full flex justify-center items-center">
      <div className="w-full h-full max-w-[1500px]">
        <Barner />
        <div className="bg-white w-full h-full ">
          <div className="bg-white w-full h-full px-5 py-9">
            <h2 className="text-xl font-bold">Our Top Category</h2>
            <div className="flex flex-wrap items-center justify-around">
              <Link
                to="/category/men's-clothing"
                className="flex flex-col justify-center items-center m-3 "
              >
                <img
                  src="https://png.pngtree.com/png-clipart/20190912/ourmid/pngtree-fashion-clothes-collection-for-men-graphic-png-image-png-image_1726895.jpg"
                  alt="men's clothing collections"
                  className="bg-white h-[170px] border-2 border-gray-200 hover:border-yellow-300"
                />
                <div className="font-bold text-gray-500">
                  Men&rsquo;s Clothing
                </div>
              </Link>
              <Link
                to="/category/jewelery"
                className="flex flex-col justify-center items-center m-3 "
              >
                <img
                  src="https://collections.jewelryimages.net/png_images_v3/uniqueset04.png"
                  alt="jewery collections"
                  className="bg-white h-[170px] border-2 border-gray-200 hover:border-yellow-300"
                />
                <div className="font-bold text-gray-500"> Jewelery</div>
              </Link>
              <Link
                to="/category/electronics"
                className="flex flex-col justify-center items-center m-3 "
              >
                <img
                  src="https://png.pngtree.com/png-vector/20190120/ourmid/pngtree-isometric-electronic-devices-collection-png-image_324124.jpg"
                  alt="electronics collections"
                  className="bg-white h-[170px] border-2 border-gray-200 hover:border-yellow-300"
                />
                <div className="font-bold text-gray-500">Electronics</div>
              </Link>
              <Link
                to="/category/women's-clothing"
                className="flex flex-col justify-center items-center m-3 "
              >
                <img
                  src="https://makeitbritish.co.uk/wp-content/uploads/2021/04/Best-of-British-Womens-Clothing-Brands-Womenswear-made-in-the-UK.png"
                  alt="women's clothing"
                  className="bg-white h-[170px] border-2 border-gray-200 hover:border-yellow-300"
                />
                <div className="font-bold text-gray-500">
                  Women&rsquo;s Clothing
                </div>
              </Link>
              <Link
                to="#"
                className="flex flex-col justify-center items-center m-3 "
              >
                <img
                  src="https://www.societystores.in/wp-content/uploads/cart1.png"
                  alt="other products"
                  className="bg-white h-[170px] border-2 border-gray-200 hover:border-yellow-300"
                />
                <div className="font-bold text-gray-500">Other Products</div>
              </Link>
            </div>
          </div>
          <div className="h-full w-full px-5 py-9 min-w-[380px]">
            <div className="text-xl font-bold">Popular Products</div>
            {loading ? (
              <Loading />
            ) : (
              <div
                className={`w-full h-fit max-h-[1150px] flex overflow-x-auto md:flex-wrap md:overflow-hidden  scrollbar-hide mt-5`}
              >
                {popularProducts.map((item: Item) => (
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
          <img
            src="https://m.media-amazon.com/images/I/71qid7QFWJL._SX3000_.jpg"
            className={`md:col-span-full h-[200px] md:h-[300px] w-full`}
            alt="advert banner"
          />
          <div className="h-full w-full px-5 py-9">
            <div className="text-xl font-bold">New collections</div>
            {loading ? (
              <Loading />
            ) : (
              <div className="w-full h-fit max-h-[1130px] flex overflow-x-auto md:flex-wrap md:overflow-hidden scrollbar-hide mt-5">
                {newProducts.map((item: Item) => (
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
        </div>
      </div>
      {error && (
        <div
          className={` animate__fadeInUp animate__animated animate__delay-300ms absolute  bottom-[20px] flex h-fit w-full items-center justify-center p-[10px] `}
        >
          <button
            className="flex h-fit w-full max-w-[500px] items-center justify-center rounded border border-inherit bg-red-500 px-1 py-2 text-white shadow-lg font-semibold"
            onClick={() => dispatch(setError(''))}
          >
            {error}
          </button>
        </div>
      )}
    </div>
  )
}

export default Home

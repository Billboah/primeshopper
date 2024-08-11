import { useEffect, useState } from 'react'
import Product from './components/Product'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { PLoading, selectProducts } from './redux/reducers/basket'
import Barner from './components/Barner'
import { Loading } from './components/utils'

interface Items {
  id: number
  title: string
  image: string
  description: string
  category: string
  price: number
  rating: { rate: number }
}

const Home = () => {
  const products = useSelector(selectProducts)
  const productLoading = useSelector(PLoading)
  const [randomData1, setRandomData1] = useState<any[]>([])
  const [randomData2, setRandomData2] = useState<any[]>([])

  useEffect(() => {
    setRandomData1(shuffleArray(products))
    setRandomData2(shuffleArray(products))
  }, [productLoading])

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

  return (
    <div className="flex-1 w-full flex justify-center items-center">
      <div className="w-full h-full max-w-[1500px]">
        <Barner />
        {productLoading ? (
          <Loading />
        ) : (
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
              </div>
            </div>
            <div className="h-full w-full px-5 pt-9 min-w-[380px]">
              <div className="text-xl font-bold">Popular Products</div>
              <div className="w-full h-fit md:h-[1150px] flex overflow-x-auto md:flex-wrap md:overflow-hidden  scrollbar-hide">
                {randomData1.map((item: Items) => (
                  <Product
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    category={item.category}
                    price={item.price}
                    rating={item.rating.rate}
                    description={item.description}
                  />
                ))}
              </div>
            </div>
            <img
              src="https://m.media-amazon.com/images/I/71qid7QFWJL._SX3000_.jpg"
              className={`md:col-span-full h-[200px] md:h-[300px] w-full`}
              alt="advert banner"
            />
            <div className="h-full w-full px-5 py-9">
              <div className="text-xl font-bold">New collections</div>
              <div className="w-full h-fit md:h-[1150px] flex overflow-x-auto md:flex-wrap md:overflow-hidden  scrollbar-hide">
                {randomData2.map((item: Items) => (
                  <Product
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    category={item.category}
                    price={item.price}
                    rating={item.rating.rate}
                    description={item.description}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

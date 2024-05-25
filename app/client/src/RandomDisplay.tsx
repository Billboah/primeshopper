import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectProducts } from './redux/reducers/basket'
import RandomProduct from './components/RandomProducts'

interface Items {
  id: number
  title: string
  image: string
  description: string
  category: string
  price: number
  rating: { rate: number }
}
const RandomDisplay = () => {
  const [randomData, setRandomData] = useState<any[]>([])
  const products = useSelector(selectProducts)
  const [linkClicked, setLinkClicked] = useState(false)

  useEffect(() => {
    const shuffledData = shuffleArray(products)
    setRandomData(shuffledData)
    setLinkClicked(false)
  }, [linkClicked === true || products])

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
    <div className="flex flex-col justify-center items-center">
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
            rating={item.rating.rate}
            setLinkClicked={setLinkClicked}
          />
        ))}
      </div>
    </div>
  )
}

export default RandomDisplay

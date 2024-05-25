import React from 'react'
import { useSelector } from 'react-redux'
import { selectInput, selectProducts } from './redux/reducers/basket'
import Product from './components/Product'

interface Items {
  id: number
  title: string
  image: string
  description: string
  category: string
  price: number
  rating: { rate: number }
}

const SearchPage: React.FC = () => {
  const products = useSelector(selectProducts)
  const input = useSelector(selectInput)
  const filtered = products.filter(
    (item: { title: string; category: string }) =>
      item.title.toLowerCase().includes(input) ||
      item.category.toLowerCase().includes(input)
  )
  if (!filtered.length) {
    return (
      <div className="font-bold text-3xl text-center md:mt-40 w-full">
        Item not found
      </div>
    )
  }

  return (
    <div className=" flex-1 max-w-[1450px] min-w-[380px] ml-auto mr-auto px-5 py-9">
      <h2 className="text-lg font-bold">{`search for ${input} `}</h2>
      <div className="grid md:grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  ">
        {filtered.map((item: Items) => (
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
  )
}

export default SearchPage

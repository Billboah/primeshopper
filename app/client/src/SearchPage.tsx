import React from 'react'
import { useSelector } from 'react-redux'
import Barner from './components/Barner'
import { selectProducts } from './redux/reducers/basket'
import SearchProductFeed from './components/SearchProductFeed'

const SearchPage: React.FC = () => {
  const products = useSelector(selectProducts)

  return (
    <div className=" flex-1 max-w-[1450px] min-w-[380px] ml-auto mr-auto">
      <Barner />
      <div className="">
        <SearchProductFeed products={products} />
      </div>
    </div>
  )
}

export default SearchPage

import { useSelector } from 'react-redux'
import { selectProducts } from './redux/reducers/basket'
import Product from './components/Product'
import { useParams } from 'react-router-dom'

interface Items {
  id: number
  title: string
  image: string
  description: string
  category: string
  price: number
  rating: { rate: number }
}

const Category = (): JSX.Element => {
  const products = useSelector(selectProducts)
  const { categoryName } = useParams<{ categoryName: string }>()

  const formattedCategoryName = categoryName.replace(/-/g, ' ')

  const productCategory = products.filter(
    (item: { title: string; category: string }) =>
      item.category.toLowerCase() === formattedCategoryName.toLowerCase()
  )

  const capitalize = (str: string) => {
    return str.toLowerCase().replace(/(?<=\s|^)\w/g, (c) => c.toUpperCase())
  }

  return (
    <div className="flex-1 px-5 py-9">
      <h2 className="text-lg font-bold">{capitalize(formattedCategoryName)}</h2>
      <div className="flex flex-wrap">
        {productCategory.map((item: Items) => (
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
// #endregion

export default Category

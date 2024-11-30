import React, { useState } from 'react'
import StarIcon from '@mui/icons-material/Star'
import { Link } from 'react-router-dom'
import { addToCart } from '../redux/reducers/basket'
import { useDispatch } from 'react-redux'
import { ShoppingCart } from '@mui/icons-material'

interface Props {
  title: string
  id: number | string
  rating: number
  price: number
  image: string
}

const Product: React.FC<Props> = ({ title, id, rating, image, price }) => {
  const [hasPrime] = useState(Math.random() < 0.5)
  const dispatch = useDispatch()
  const [cart, setCart] = useState(false)

  const addItemToCart = () => {
    const productItem = {
      id: id,
      title: title,
      image: image,
      price: price,
      rating: rating,
      hasPrime: hasPrime,
    }
    dispatch(addToCart(productItem))
  }

  return (
    <div
      onMouseEnter={() => setCart(true)}
      onMouseLeave={() => setCart(false)}
      className={`w-[250px] relative m-2 min-w-[250px] bg-white rounded-md transform hover:bg-gray-50 hover:scale-105 hover:z-50 transition`}
    >
      <Link
        to={`/details/${id}`}
        onClick={() => window.scrollTo(0, 0)}
        className="flex flex-col relative m-0 p-5 transform hover:bg-gray-50 hover:z-50s active:scale-100 transition"
      >
        <div className="flex flex-col justify-between h-full ">
          <div className="bg-white w-[200px] h-[200px] border border-gray-300 p-5 rounded-sm">
            <img className="w-auto h-full " src={image} alt={title} />
          </div>
          <p className="my-3  line-clamp-1 font-bold">{title}</p>
          <p className="">
            <small>$</small>
            <strong>{price}</strong>
          </p>
          <div>
            {Array(Math.round(rating))
              .fill(undefined)
              .map((_, index) => (
                <StarIcon
                  key={index}
                  className="text-yellow-400"
                  fontSize="small"
                />
              ))}
          </div>
          {hasPrime && (
            <div className="flex items-center">
              <img
                className="w-[30px]"
                src="https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/052018/untitled-1_282.png?zBgfG0XEfdsPUq33GRuhu6udfY3Yu_rs&itok=39OQ7JCF"
                alt=""
              />
              <p className="text-xs">Free delivery</p>
            </div>
          )}
        </div>
      </Link>
      {cart && (
        <button
          className="bg-yellow-400 rounded-full ml-2 p-2 absolute top-[-10px] right-0 transform hover:scale-105 hover:z-50 active:scale-100 transition z-20"
          title="Add Item to Cart"
          onClick={addItemToCart}
        >
          <ShoppingCart
            sx={{ fontSize: '20px' }}
            className="text-yelow-400 m-0 p-0"
          />
        </button>
      )}
    </div>
  )
}

export default Product

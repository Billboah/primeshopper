import React, { useState } from 'react'
import StarIcon from '@mui/icons-material/Star'

import { Link } from 'react-router-dom'

interface Props {
  title: string
  category: string
  id: number | string
  rating: number
  price: number
  image: string
  setLinkClicked: React.Dispatch<React.SetStateAction<boolean>>
}

const RandomProduct: React.FC<Props> = ({
  title,
  id,
  rating,
  image,
  price,
  setLinkClicked,
}) => {
  const [hasPrime] = useState(Math.random() < 0.5)

  return (
    <Link
      to={`/details/${id}#`}
      onClick={() => (setLinkClicked(true), window.scrollTo(0, 0))}
      className="w-[160px] h-[180px] text-[10px] flex flex-col m-1 p-[5px] bg-white z-30 border border-gray-300  rounded-sm transform hover:scale-105 active:scale-100 transition  "
    >
      <div className="flex flex-col justify-between h-full ">
        <img className="w-[65px] h-[65px]" src={image} alt="" />
        <p className="my-3  line-clamp-2 font-bold">{title}</p>
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
                style={{ fontSize: '15px' }}
              />
            ))}
        </div>
        {hasPrime && (
          <div className="flex items-center">
            <img
              className="w-[20px]"
              src="https://d1yjjnpx0p53s8.cloudfront.net/styles/logo-thumbnail/s3/052018/untitled-1_282.png?zBgfG0XEfdsPUq33GRuhu6udfY3Yu_rs&itok=39OQ7JCF"
              alt=""
            />
            <p className="text-[8px]">Free delivery</p>
          </div>
        )}
      </div>
    </Link>
  )
}

export default RandomProduct

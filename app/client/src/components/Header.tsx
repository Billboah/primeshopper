import { Link, useHistory } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCart from '@mui/icons-material/ShoppingCart'
import { auth } from '../firebase'
import React, { useState } from 'react'
import Logo from '../assets/primeshopperWhite.png'
import { useSelector, useDispatch } from 'react-redux'
import { inputValue, selectItems } from '../redux/reducers/basket'
import { RootState } from '../redux/reducers'

const Header: React.FC = () => {
  const basket = useSelector(selectItems)
  const { user } = useSelector((state: RootState) => state.auth)
  const [value, setValue] = useState('')
  const dispatch = useDispatch()
  const history = useHistory()

  const UserLink = () => {
    if (user) {
      auth.signOut()
    } else {
      history.push({
        pathname: '/login',
        state: { from: history.location.pathname },
      })
    }
  }

  //calculating the number of items
  const getBasketNumber: number = basket.reduce(
    (total: number, basket: { count: number }) => {
      return basket.count + total
    },
    0
  )

  //search product
  const searchInput = (event: { preventDefault: any }) => {
    event.preventDefault()
    dispatch(inputValue(value))
    if (value.length === 0) {
      history.push('/')
    } else {
      history.push('/search')
    }
  }

  return (
    <nav className="bg-slate-800  flex flex-col sticky top-0 z-[100] min-w-[380px]">
      <div className="h-[80px] flex items-center justify-between">
        <Link
          to="/"
          className="mx-[20px]  hover:border-solid hover:border-white hover:border-[1px]"
          aria-label="Home"
        >
          <img
            className="object-contain w-[100px]"
            height={50}
            width={100}
            src={Logo}
            alt=""
          />
        </Link>
        <form
          onSubmit={searchInput}
          className="hidden bg-white md:flex items-center flex-1 rounded-md"
        >
          <label htmlFor="search" className="sr-only">
            Search:
          </label>
          <input
            type="search"
            name="search"
            id="search"
            className="w-full h-[25px] m-[5px] p-[5px] outline-none border-none"
            onChange={(e) => setValue(e.target.value.toLowerCase())}
          />
          <button aria-label="search">
            <SearchIcon className="bg-orange-400 m-0 p-1 !h-[35px] !w-[35px] rounded-[4px] cursor-pointer" />
          </button>
        </form>
        <div className="flex justify-evenly items-center m-5">
          <button
            onClick={UserLink}
            className="text-white hover:border-solid hover:border-white hover:border-[1px] no-underline"
            aria-label="sign in"
          >
            <div aria-hidden="true" className="flex flex-col mx-[10px] ">
              <span
                className="text-[9px] md:text-[10px]"
                title={user ? 'Log Out' : 'Log In'}
              >
                {user ? `Hello,  ${user.displayName}` : 'Hello, Sign In'}
              </span>
              <span className="text-[11px] md:text-[13px] font-[800]">
                Account & Lists
              </span>
            </div>
          </button>
          <Link
            to={'/orders'}
            className="text-white hover:border-solid hover:border-white hover:border-[1px] no-underline"
          >
            <div className="flex flex-col mx-[10px] ">
              <span className="text-[9px] md:text-[10px]">Returns</span>
              <span className="text-[11px] md:text-[13px] font-[800]">
                & Orders
              </span>
            </div>
          </Link>
          <Link
            to="/checkout"
            className="h-fit text-white flex hover:border-solid hover:border-white hover:border-[1px] no-underline mr-1"
          >
            <div className="flex items-center relative p-0 m-0">
              <ShoppingCart sx={{ fontSize: '30px' }} className="m-0 p-0" />
              <div className="bg-orange-500 absolute top-0 right-0 text-[12px] font-[750] text-black rounded-full m-[-5px] px-1">
                {getBasketNumber}
              </div>
            </div>
            <div className="hidden md:flex items-end ">Cart</div>
          </Link>
        </div>
      </div>
      <form
        onSubmit={searchInput}
        className="md:hidden bg-white my-[5px] mx-[10px] flex items-center rounded-md"
      >
        <input
          type="search"
          className="w-full h-[12px] m-[5px] p-[10px] outline-none border-none"
          onChange={(e) => setValue(e.target.value.toLowerCase())}
        />
        <button>
          <SearchIcon className="bg-orange-400 m-0 p-1 !h-[30px] !w-[30px] rounded-[4px] cursor-pointer" />
        </button>
      </form>
    </nav>
  )
}

export default Header

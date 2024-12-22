import { lazy, Suspense, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { newError, setError } from './redux/reducers/basket'
import { useDispatch, useSelector } from 'react-redux'
import Barner from './components/Barner'
import { category, Loading } from './components/utils'
const OtherProducts = lazy(() => import('./components/anyProducts'))

const Home = () => {
  const error = useSelector(newError)
  const dispatch = useDispatch()

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
              {category.map((item) => (
                <Link
                  key={item.id}
                  to={`/category/${item.cat}`}
                  className="flex flex-col justify-center items-center m-3 "
                >
                  <img
                    src={item.img}
                    alt={item.catName}
                    className="bg-white h-[170px] border-2 border-gray-200 "
                    loading="lazy"
                    height={170}
                    width={180}
                  />
                  <div className="font-bold text-gray-500">{item.catName}</div>
                </Link>
              ))}
            </div>
          </div>
          <Suspense fallback={<Loading />}>
            <OtherProducts />
          </Suspense>
          <img
            src="https://m.media-amazon.com/images/I/71qid7QFWJL._SX3000_.jpg"
            className={`md:col-span-full h-[150px] md:h-[200px] w-full`}
            height={150}
            width={250}
            alt="ad banner"
            loading="lazy"
          />
          <Suspense fallback={<Loading />}>
            <OtherProducts />
          </Suspense>
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

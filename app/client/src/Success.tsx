import { Link } from 'react-router-dom'

const Success = () => {
  return (
    <div className="flex-1 h-full w-full min-w-[380px] my-5 flex flex-col items-center justify-center ">
      <h2 className="text-2xl font-bold">Your order has been confirm</h2>
      <p className=" mb-2 font-semibold">
        Thank you for choosing PrimeShopper service.
      </p>
      <p>You will be informed when your item is shipped </p>
      <div className="m-2 ">
        <Link to="/orders" className="button w-[150px] mr-1">
          Orders
        </Link>
        <Link to="/" className="button w-[150px] ml-1">
          Home page
        </Link>
      </div>
    </div>
  )
}

export default Success

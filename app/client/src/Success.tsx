import { Link } from 'react-router-dom'

const Success = () => {
  return (
    <div className="flex-1 h-full w-full min-w-[380px] my-5 flex flex-col items-center justify-center ">
      <h2 className="text-2xl font-bold">Your order has been confirm</h2>
      <p className=" mb-2 font-semibold">
        Thank you for choosing amazon service.
      </p>
      <p>You will be informed when your item is shipped </p>
      <Link to="/orders" className="button h-fit">
        Go to your oders
      </Link>
    </div>
  )
}

export default Success

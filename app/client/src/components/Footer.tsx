/* eslint-disable jsx-a11y/anchor-is-valid */
const Footer = () => {
  return (
    <footer className="w-full min-w-[380px] bg-gray-900 text-white py-8">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-around">
          <div className="w-full md:w-1/4 lg:w-1/6 px-4">
            <h4 className="text-lg font-bold mb-4">Get to Know Us</h4>
            <ul className="list-none">
              <li className="mb-2">
                <a href="#" className="text-gray-400 hover:text-white">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-400 hover:text-white">
                  Careers
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-400 hover:text-white">
                  Press Releases
                </a>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-1/4 lg:w-1/6 px-4">
            <h4 className="text-lg font-bold mb-4">Shop with Us</h4>
            <ul className="list-none">
              <li className="mb-2">
                <a href="#" className="text-gray-400 hover:text-white">
                  Product Categories
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-400 hover:text-white">
                  Deals & Promotions
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-400 hover:text-white">
                  Customer Reviews
                </a>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-1/4 lg:w-1/6 px-4">
            <h4 className="text-lg font-bold mb-4">Help & Support</h4>
            <ul className="list-none">
              <li className="mb-2">
                <a href="#" className="text-gray-400 hover:text-white">
                  Your Account
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-400 hover:text-white">
                  Returns & Refunds
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-gray-400 hover:text-white">
                  Customer Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Amazon Clone. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

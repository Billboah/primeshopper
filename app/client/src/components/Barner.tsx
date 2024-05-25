import React from 'react'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel } from 'react-responsive-carousel'

const Barner: React.FC = () => {
  return (
    <div className="w-full">
      <Carousel
        autoPlay
        infiniteLoop
        showIndicators={false}
        showThumbs={false}
        showArrows={true}
        interval={5000}
      >
        <div>
          <img
            loading="lazy"
            src="https://static.vecteezy.com/system/resources/thumbnails/002/294/859/small/flash-sale-web-banner-design-e-commerce-online-shopping-header-or-footer-banner-free-vector.jpg"
            alt="banner 1"
            className="h-[200px] md:h-[270px]"
          />
        </div>
        <div>
          <img
            loading="lazy"
            src="https://previews.123rf.com/images/arrow/arrow1508/arrow150800011/43834601-online-shopping-e-commerce-flat-design-concept-banner-background.jpg"
            alt="banner 2"
            className="h-[200px] md:h-[270px]"
          />
        </div>
        <div>
          <img
            loading="lazy"
            src="https://4.bp.blogspot.com/-j08zU37hpt4/W5aaDndpsWI/AAAAAAAAFoc/tq-c11-V1sgMDyFd5cB3Z6jsO2UICZiQgCK4BGAYYCw/s1600/CL-Banner.jpg"
            alt="banner 3"
            className="h-[200px] md:h-[270px]"
          />
        </div>
        <div>
          <img
            loading="lazy"
            src="https://www.jdmedia.co.za/images/carousel/Ecommerce-Banner-1920.jpg"
            alt="banner 4"
            className="h-[200px] md:h-[270px]"
          />
        </div>
      </Carousel>
    </div>
  )
}

export default Barner

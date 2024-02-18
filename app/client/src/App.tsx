import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Header from './components/Header'
import Home from './Home'
import Checkout from './Checkout'
import Login from './Login'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { useDispatch } from 'react-redux'
import SearchPage from './SearchPage'
import ProductDetails from './ProductDetails'
import Success from './Success'
import Footer from './components/Footer'
import RandomDisplay from './RandomDisplay'
import { setUser } from './redux/reducers/auth'
import Order from './Order'

const App: React.FC = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          setUser({
            userId: user.uid,
            displayName: user.displayName,
            email: user.email,
            userImage: user.photoURL,
          })
        )
      } else {
        dispatch(setUser(null))
      }
    })
  })

  return (
    <Router>
      <div className="h-full min-h-screen w-full scrollbar-hide flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col ">
          <Switch>
            <Route path="/checkout">
              <Header />
              <Checkout />
            </Route>
            <Route path="/orders">
              <Header />
              <Order />
            </Route>
            <Route path="/success">
              <Header />
              <Success />
            </Route>
            <Route path="/search">
              <Header />
              <SearchPage />
            </Route>
            <Route exact path="/details/:id">
              <Header />
              <ProductDetails />
              <RandomDisplay />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route exact path="/">
              <Header />
              <Home />
            </Route>
          </Switch>
        </div>
        <Footer />
      </div>
    </Router>
  )
}

export default App

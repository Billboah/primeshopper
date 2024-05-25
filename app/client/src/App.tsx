import React, { useEffect } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Header from './components/Header'
import Home from './Home'
import Checkout from './Checkout'
import Login from './Login'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { useDispatch, useSelector } from 'react-redux'
import SearchPage from './SearchPage'
import ProductDetails from './ProductDetails'
import Success from './Success'
import Footer from './components/Footer'
import RandomDisplay from './RandomDisplay'
import { setUser } from './redux/reducers/auth'
import Order from './Order'
import Category from './Category'
import SignUp from './sign-up'
import {
  addProducts,
  selectProducts,
  setLoading,
} from './redux/reducers/basket'

const App: React.FC = () => {
  const dispatch = useDispatch()
  const products = useSelector(selectProducts)

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
  }, [auth])

  useEffect(() => {
    if (products.length === 0) {
      dispatch(setLoading(true))
      fetch('https://fakestoreapi.com/products')
        .then((res) => res.json())
        .then((data) => {
          dispatch(addProducts(data))
          dispatch(setLoading(false))
        })
        .catch((error) => {
          dispatch(setLoading(false))
          if (error.response) {
            dispatch(setLoading(false))
            alert(error.response.data.error)
          } else if (error.request) {
            alert(
              'Cannot reach the server. Please check your internet connection.'
            )
            dispatch(setLoading(false))
          } else {
            alert(error.message)
            dispatch(setLoading(false))
          }
        })
    }
    return
  }, [])

  return (
    <Router>
      <div className="flex flex-col h-full min-h-screen w-full">
        <Switch>
          <Route exact path="/checkout">
            <Header />
            <Checkout />
          </Route>
          <Route exact path="/orders">
            <Header />
            <Order />
          </Route>
          <Route exact path="/success">
            <Header />
            <Success />
          </Route>
          <Route exact path="/search">
            <Header />
            <SearchPage />
            <RandomDisplay />
          </Route>
          <Route exact path="/category/:categoryName">
            <Header />
            <Category />
            <RandomDisplay />
          </Route>
          <Route exact path="/details/:id">
            <Header />
            <ProductDetails />
            <RandomDisplay />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/signup">
            <SignUp />
          </Route>
          <Route exact path="/">
            <Header />
            <Home />
          </Route>
        </Switch>
        <Footer />
      </div>
    </Router>
  )
}

export default App

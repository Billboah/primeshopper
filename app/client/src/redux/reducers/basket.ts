import { createSlice } from '@reduxjs/toolkit'

interface Item {
  title: string
  category: string
  description: string
  id: number
  rating: number
  price: number
  image: string
  count: number
  hasPrime: any
}

interface Product {
  title: string
  category: string
  description: string
  id: number
  rating: { rate: number }
  price: number
  image: string
  count: number
}

export interface BasketState {
  items: Item[]
  input: string | number
  products: Product[]
  category: string
  productLoading: boolean
}

const initialState: BasketState = {
  items: [],
  input: '',
  products: [],
  category: '',
  productLoading: false,
}

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addProducts: (state, { payload }) => {
      state.products = payload
    },
    setLoading: (state, { payload }) => {
      state.productLoading = payload
    },
    addToCart: (state, action) => {
      const newItem: Item = action.payload
      const existingItem = state.items.find((item) => item.id === newItem.id)

      if (existingItem) {
        alert('This item is already in your cart')
      } else {
        newItem.count
          ? state.items.push(newItem)
          : ((newItem.count = 1), state.items.push(newItem))
      }
    },
    changeCount: (state, action) => {
      const newItem = action.payload
      const existingItem = state.items.find((item) => item.id === newItem.id)
      const change = newItem.change

      if (existingItem) {
        if (change === 'add') {
          existingItem.count += 1
        }
        if (change === 'minus' && existingItem.count !== 1) {
          existingItem.count -= 1
        }
      }
      return state
    },
    addNumber: (state, action) => {
      const newItem = action.payload

      if (action.payload.num !== 0) {
        const existingItem = state.items.find((item) => item.id === newItem.id)

        if (existingItem) {
          existingItem.count = action.payload.num
        }
      }
    },
    removeFromCart: (state, action) => {
      const index = state.items.findIndex(
        (basketItem) => basketItem.id === action.payload.id
      )
      const newBasket = [...state.items]
      if (index >= 0) {
        newBasket.splice(index, 1)
      } else {
        console.warn(
          `can't remove product (id ${action.payload.id}) as it's not in basket!`
        )
      }
      state.items = newBasket
    },
    inputValue: (state, action) => {
      state.input = action.payload
    },
  },
})

export const {
  addToCart,
  changeCount,
  addNumber,
  removeFromCart,
  inputValue,
  addProducts,
  setLoading,
} = basketSlice.actions

export const selectItems = (state: { basket: { items: Item[] } }) =>
  state.basket.items
export const selectInput = (state: { basket: { input: string } }) =>
  state.basket.input
export const selectProducts = (state: { basket: { products: Product[] } }) =>
  state.basket.products
export const PLoading = (state: { basket: { productLoading: boolean } }) =>
  state.basket.productLoading

export default basketSlice.reducer

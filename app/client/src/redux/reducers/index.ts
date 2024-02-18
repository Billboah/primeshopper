import { combineReducers } from '@reduxjs/toolkit'
import basketReducer from './basket'
import userReducer from './auth'

const rootReducer = combineReducers({
  basket: basketReducer,
  auth: userReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer

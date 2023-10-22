import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import searchReducer from "../features/postSearch"
const store = configureStore({
  reducer: {
    searchReducer
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Provider store={store}>
        <Component className='no-scrollbar' {...pageProps} />
      </Provider>
    </SessionProvider>
  )
}

export default MyApp

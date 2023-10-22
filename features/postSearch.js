import { createSlice } from '@reduxjs/toolkit'
const initialState = { searchedData: [], searchTerm: '' }
export const searchDataSlice = createSlice({
  name: 'SearchData',
  initialState: { value: initialState },
  reducers: {
    setSearchData: (state, action) => {
      state.value =  action.payload
    },
  },
})

export const { setSearchData } = searchDataSlice.actions
export default searchDataSlice.reducer

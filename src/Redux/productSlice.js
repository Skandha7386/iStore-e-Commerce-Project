import {createSlice,createAsyncThunk} from '@reduxjs/toolkit'
import axios from 'axios'


// create AysncThunk

export const fetchProducts=createAsyncThunk(
    'fetchProducts'
    ,
    async function(){
        const response=await axios.get("http://localhost:3000/products")
        return response.data
    }
)

const productSlice=createSlice({
    name:"Product",

    initialState:{
        products:[],
        isLoading:false,
        error:null
    },

    reducers:{
        productStocksUpdated:function(state, action){
            action.payload.forEach(function(update){
                const product = state.products.find(function(item){
                    return String(item.id) === String(update.id)
                })
                if(product) product.stock = update.stock
            })
        }
    },

    extraReducers:function(builder){
        builder.addCase(fetchProducts.pending,function(state){
            state.isLoading=true
            state.error=null
        })
        builder.addCase(fetchProducts.fulfilled,function(state, action){
            state.isLoading=false
            state.products=action.payload
        })
        builder.addCase(fetchProducts.rejected,function(state, action){
            state.isLoading=false
            state.error=action.error.message
        })
    }
})

export const { productStocksUpdated } = productSlice.actions
export default productSlice.reducer

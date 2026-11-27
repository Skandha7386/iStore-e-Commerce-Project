import axios from "axios"

const API_URL="http://localhost:3000/products"

export async function getAdminProducts(){

    const response= await axios.get(API_URL)

    return response.data
    
}

export async function addAdminProduct(newProduct){

    const response=await axios.post(API_URL,newProduct)

    return response.data
}

export async function deleteAdminProduct(id){
    const response=await axios.delete(`${API_URL}/${id}`)
    return response.data
}

export async function updateAdminProduct({id,updatedProduct}){
    const response =await axios.put(`${API_URL}/${id}`,updatedProduct)
    return response.data
}
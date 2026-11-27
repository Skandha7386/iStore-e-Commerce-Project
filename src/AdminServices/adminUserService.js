import axios from "axios"


const API_URL="http://localhost:3000/users"

export async function getAdminUser(){

    const response=await axios.get(API_URL)
    return response.data
    
}

export async function getAdminUserById(id) {

    const response = await axios.get(`${API_URL}/${id}`)

    return response.data

}

export async function deleteAdminUser(id){
    const response=await axios.delete(`${API_URL}/${id}`)
    return response.data
}

export async function updateAdminUserStatus(id,status){
    const response=await axios.patch(`${API_URL}/${id}`,{
        status:status
    })
    return response.data
}
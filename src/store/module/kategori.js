import axios from 'axios'

const state = {
    loading : false,
    allItem : [],
    kategoriProduk: []
}
const mutations = {
    fillLoading(state,payload){
        state.loading = payload
        },    
    fillData(state,payload){
        state.allItem = payload
        },
    fillData2(state,payload){
        state.kategoriProduk = payload
        }               
}
const actions = {
  fetchKategori(context,payload,limit) {
      context.commit('fillLoading',true)
      context.commit('fillData',[])
      axios({
        url: `https://kueku-server-15ecaf79af24.herokuapp.com/kategori`,
        method: 'get',
        headers:{
            token : localStorage.getItem('token')
        }
      })      
            .then(({data})=>{   
                      context.commit('fillData',data)
                      context.commit('fillLoading',false)

                    //   kategori produk
                    let tempData = []
                    data.forEach(element => {
                        tempData.push({ item: element._id, name: element.nama })
                    });

                    context.commit('fillData2',tempData)                
            })
            .catch(err=>{
                console.log(err)
            })
  },
  fetchKategoriProduk(context,payload,limit) {
    context.commit('fillLoading',true)
    if(state.kategoriProduk.length <= 0){
        axios({
            url: `https://kueku-server-15ecaf79af24.herokuapp.com/kategori`,
            method: 'get',
            headers:{
                token : localStorage.getItem('token')
            }
          })      
                .then(({data})=>{   
                    let tempData = []
                        data.forEach(element => {
                            tempData.push({ item: element._id, name: element.nama })
                        });

                        context.commit('fillData2',tempData)                
                        context.commit('fillLoading',false)
                })
                .catch(err=>{
                    console.log(err)
                })
    }
    context.commit('fillLoading',false)
}

}
const getters = {
    getLoading : (state) => {
        return  state.loading
      },    
    getKategori : (state) => {
      return  state.allItem
    },
    getKatProduk : (state) => {
        return state.kategoriProduk
    }  
}

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
}
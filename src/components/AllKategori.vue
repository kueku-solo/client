<template>
    <div class="overflow-auto"> 
        <v-card v-if='card === true'>
            <v-container fluid>
                <v-row>
                    <v-col
                    v-for="(kategori, i) in kategories"
                    :key="i"
                    cols="12"
                    md="4"
                    >
                        <a @click.prevent='klik(kategori.item)'>
                            <v-card 
                                color="#d5d5d5" 
                                height="100">
                                <v-card-title class="text-h5">
                                    {{kategori.name}}
                                </v-card-title>
                            </v-card>
                        </a>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
        <div v-if='card === false'>
            <v-row>
                <v-col cols="12" md="4">
                    <a @click.prevent='card = true'>
                        <p><span class="mdi mdi-chevron-double-left"></span>Back</p>                
                    </a>
                </v-col>  
                <v-col cols="12" md="4">
                    <h3>Total Item : {{allItem.length}}</h3>
                </v-col>  
            </v-row>
            <v-data-table
                :headers="headers"
                :items="allItem"
                class="elevation-1"
                :loading="loadingItem"
                :footer-props="{
                    'items-per-page-options': [5, 10]
                }"
                :items-per-page="5"
            >
                <template v-slot:item.harga="{ item }">
                <p>Rp {{getRupiah( item.harga)}}</p>
                </template>  

                <template v-slot:item.actions="{ item }">
                    <a @click="plusItem(item)">
                    <v-icon color="green" dense>mdi-cart-plus</v-icon>
                    </a> 
                </template>    
            </v-data-table>   
        </div>
    </div>
  
  </template>
  
  <script>
      import { mapGetters,mapActions } from 'vuex'
      import axios from 'axios'
    export default {
      data() {
        return {
            card: true,
            // item
            headers:[
            { text: 'Nama', value: 'nama' },
            { text: 'Stok', value: 'stok' },
            { text: 'Harga', value: 'harga' },
            { text: 'Actions', value: 'actions', sortable: false },], 
            allItem: [],
            loadingItem:false
        }
      },
      computed:{
          ...mapGetters({
            kategories: 'kategori/getKatProduk',
            loading: 'kategori/getLoading'
          }),   
          getRole(){
            return this.$store.state.userRole
          }             
      },    
      methods:{        
          ...mapActions({
            fetchKategori: 'kategori/fetchKategoriProduk',
            addItem: 'transaksi/addItem',
          }),
          getRupiah(uang){
            if(uang){
                var number_string = uang.toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    uang = sisa ? '.' : '';
                    rupiah += uang + ribuan.join('.');
                }            

                return rupiah
            }else{
                return '-'
            }
        },
        formatRupiahEsc(angka){
            let al = "";
            if(angka=="" || angka==null || angka=="null" || angka==undefined){
                al = "";
            } else {
                al = Math.abs(angka.replace(/[^,\d]/g, '').toString());
            }
            return al;
        }      ,  
          klik(id){
              this.loadingItem = true
              this.allItem = []
              this.card = false
            axios({
              url: `https://kueku-server-15ecaf79af24.herokuapp.com/item/findbykategori?id=${id}`,
              method: 'get',
              headers:{
                  token : localStorage.getItem('token')
              }
            })      
                  .then(({data})=>{ 
                      this.allItem = data                                                                               
                      this.loadingItem = false                  
                  })
                  .catch(err=>{
                    this.loadingItem = false                  
                    console.log(err)
                  })        
          },
          plusItem(data){
            if(Number(data.stok) > 0){
                this.src = ''
                let temp = {
                    id: data._id,
                    nama: data.nama,
                    kodeBarang: data.kodeBarang,
                    disc:0,
                    qty: 1,
                    stok:data.stok,
                    harga: data.harga,
                    laba: (Number(data.modal) - Number(data.harga)) * Number(data.stok)
                }
                this.addItem(temp)          
          }  
        }  
      },
      created(){
          this.fetchKategori()      
      }
    }
  </script>
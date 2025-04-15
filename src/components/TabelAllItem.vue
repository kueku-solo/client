<template>
  <div class="overflow-auto"> 
    <v-text-field
        solo
        label="Nama/Kode Barang"
        append-icon="mdi-magnify"
        v-on:keyup.enter="search(1)"
        class="mr-4 ml-4"
        clearable
        v-model="src"
    ></v-text-field>    


    <v-data-table
        :headers="headers"
        :items="allItem"
        class="elevation-1"
        :loading="loading"
        :footer-props="{
                    'items-per-page-options': [6, 10]
                }"
        :items-per-page="6"
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

</template>

<script>
    import { mapGetters,mapActions,mapMutations } from 'vuex'
    import Swal from 'sweetalert2'
    import axios from 'axios'
  export default {
    data() {
      return {
        perPage: 20,
        currentPage: 1,
        headers:[
            { text: 'Nama', value: 'nama' },
            { text: 'Stok', value: 'stok' },
            { text: 'Harga', value: 'harga' },
            { text: 'Actions', value: 'actions', sortable: false },],           
        src: ''
      }
    },
    computed:{
        ...mapGetters({
        allItem: 'item/getAllItem',
        loading:'item/getLoading',        
        }),   
        getRole(){
          return this.$store.state.userRole
        }             
    },    
    methods:{
        ...mapMutations({
          fillData: 'item/fillData', 
          fillLoading: 'item/fillLoading'        
        }),          
        ...mapActions({
          addItem: 'transaksi/addItem',
        }),       
        search(){          
            this.fillLoading(true)
            this.fillData([])
            axios({
              url: `https://kueku-server-15ecaf79af24.herokuapp.com/item/search?src=${this.src}`,
              method: 'get',
              headers:{
                  token : localStorage.getItem('token')
              }
            })      
                  .then(({data})=>{                   
                    this.fillData(data.results)
                    this.fillLoading(false)                                                               
                  })
                  .catch(err=>{
                      console.log(err)
                  })            
        },        
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
        },           
    },
    created(){
      this.fillData([])
    }
  }
</script>
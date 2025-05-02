<template>
  <div class="overflow-auto"> 
    <v-row>
      <v-col cols="12" md="10">
        <v-text-field
        solo
        label="Nama / Kode Barang"
        v-on:keyup.enter="search()"
        class="mr-4 ml-4"
        clearable
        v-model="src"     
        >
      </v-text-field>
      </v-col>
      <v-col cols="12" md="2">
        <v-btn  @click="search()" >Search<v-icon color="red" dense>mdi-magnify</v-icon></v-btn>
      </v-col>
    </v-row>


    
    <!-- tabel all item -->
    <v-data-table
        v-if="tabel==='all'"
        :headers="headers"
        :items="allData"
        class="elevation-1"
        :loading="loading"
        hide-default-footer
    >  
        <template v-slot:item.kat="{ item }">
          <p v-if="item.kategori !== undefined && item.kategori !== null">{{item.kategori.nama}}</p>
          <p v-if="item.kategori === undefined || item.kategori === null">-</p>
        </template>    

        <template v-slot:item.modal="{ item }">
          <p v-if="getRole === 'super'">Rp {{getRupiah( item.modal)}}</p>
        </template>

        <template v-slot:item.harga="{ item }">
          <p>Rp {{getRupiah( item.harga)}}</p>
        </template>  
     
        <template v-slot:item.actions="{ item }">
            <a @click="formEdit(item)" v-if="getRole === 'super'" class="mr-2">
              <v-icon color="green"  small>mdi-file-document-edit</v-icon>
            </a> 

            <a @click="formEditStokAdmin(item)" v-if="getRole === 'super' || getRole === 'admin'" class="mr-2">
              <v-icon color="green" small>mdi-store-edit-outline</v-icon>
            </a>             
                
            <a @click.prevent="deleteItem(item._id)" v-if="getRole === 'super'">
                <v-icon color="red" small>mdi-delete</v-icon>
            </a>  
        </template>    
    </v-data-table>
    <b-pagination
      class="mt-2"
      v-if="allData.length > 0 && tabel === 'all'"
      v-model="currentPage"
      :total-rows="totalItem"      
      :per-page="perPage"
      aria-controls="my-table"
      align="center"
    ></b-pagination> 
    <!-- tabel all item -->

    <!-- tabel search -->
    <v-data-table
        v-if="tabel==='search'"
        :headers="headers"
        :items="allData"
        class="elevation-1"
        :loading="loading"
        :footer-props="{
                    'items-per-page-options': [5, 10]
                }"
        :items-per-page="5"
    >  
        <template v-slot:item.kat="{ item }">
          <p v-if="item.kategori !== undefined">{{item.kategori.nama}}</p>
          <p v-if="item.kategori === undefined">-</p>
        </template>    

        <template v-slot:item.modal="{ item }" v-if="getRole === 'super'">
          <p>Rp {{getRupiah( item.modal)}}</p>
        </template>

        <template v-slot:item.harga="{ item }">
          <p>Rp {{getRupiah( item.harga)}}</p>
        </template>  
     
        <template v-slot:item.actions="{ item }" v-if="getRole === 'super' || getRole === 'admin'">
            <a @click="formEdit(item)" v-if="getRole === 'super'" class="mr-2">
              <v-icon color="green"  small>mdi-file-document-edit</v-icon>
            </a> 

            <a @click="formEditStokAdmin(item)" v-if="getRole === 'super' || getRole === 'admin'" class="mr-2">
              <v-icon color="green" small>mdi-store-edit-outline</v-icon>
            </a>             
                
            <a @click.prevent="deleteItem(item._id)" v-if="getRole === 'super'">
                <v-icon color="red" small>mdi-delete</v-icon>
            </a>  
        </template>    
    </v-data-table>     
    <!-- tabel search -->

    <!-- form edit produk -->
    <v-dialog
    v-model="dialog"
    width="1000"      
    >      
    <b-overlay :show="loading2" rounded="sm">
      <v-card >
        <v-card-title class="text-h5 grey lighten-2 mb-4">
          Edit Produk
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
                <v-col cols="12" md="10">
                    <v-text-field
                        v-model="nama"
                        label="Nama Barang"    
                        outlined                        
                        clearable
                        v-on:keyup.alt="editItem()"
                    ></v-text-field>      
                </v-col>
                <v-col cols="12" md="2">                  
                    <v-text-field
                    label="Stok"
                    min="0"
                    v-model="stok"
                    suffix="pcs"
                    type=number                
                    v-on:keyup.alt="editItem()"                                           
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row v-if="getRole === 'super'">
                <v-col cols="12" md="3">                  
                    <v-text-field
                    label="Harga Modal"
                    v-model="modal"
                    prefix="Rp"                
                    v-on:keyup.enter="editItem()"                                         
                    ></v-text-field>
                </v-col>   
                <v-col cols="12" md="3">                  
                    <v-text-field
                    label="Harga Jual"
                    v-model="harga"
                    prefix="Rp"                
                    v-on:keyup.enter="editItem()"                                         
                    ></v-text-field>
                </v-col>    
                <v-col cols="12" md="2">                  
                    Laba = {{ formatRupiahEsc(harga) - formatRupiahEsc(modal) }}
                </v-col>  
                <v-col cols="12" md="4">
                    <v-text-field
                        v-model="kodeBarang"
                        label="Kode Barang"    
                        outlined                        
                        clearable
                        v-on:keyup.enter="editItem()"
                    ></v-text-field>      
                </v-col>                                   
            </v-row>  
            
            <v-row>
              <v-col cols="12" md="4">
              <p>Kategori</p>
                <b-form-select
                    v-model="kat"
                    :options="getKatProduk"
                    class="mb-3"
                    value-field="item"
                    text-field="name"
                ></b-form-select>
              </v-col>
            </v-row>

            <!-- foto -->
            <!-- <v-row>
                <div id="app" class="web-camera-container">
                    <div class="camera-button">
                        <button type="button" class="button is-rounded" :class="{ 'is-primary' : !isCameraOpen, 'is-danger' : isCameraOpen}" @click="toggleCamera">
                            <span v-if="!isCameraOpen">Open Camera</span>
                            <span v-else>Close Camera</span>
                        </button>
                    </div>
                    
                    <div v-show="isCameraOpen && isLoading" class="camera-loading">
                        <ul class="loader-circle">
                        <li></li>
                        <li></li>
                        <li></li>
                        </ul>
                    </div>
                    
                    <div v-if="isCameraOpen" v-show="!isLoading" class="camera-box" :class="{ 'flash' : isShotPhoto }">
                        
                        <div class="camera-shutter" :class="{'flash' : isShotPhoto}"></div>
                        
                        <video v-show="!isPhotoTaken" ref="camera" :width="450" :height="337.5" autoplay></video>
                        
                        <canvas v-show="isPhotoTaken" id="photoTaken" ref="canvas" :width="450" :height="337.5"></canvas>
                    </div>
                    
                    <div v-if="isCameraOpen && !isLoading" class="camera-shoot">
                        <v-btn type="button" class="button" @click="takePhoto">
                          capture
                        </v-btn>
                    </div>

                    </div>
            </v-row> -->
            <!-- foto -->              
          </v-container>
          <br>
          <small>*kode barang jangan diisi jika tidak ada barcode</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Batal
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="editItem()"
          >
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
    </b-overlay>
    </v-dialog>      
    <!-- form edit produk -->   

    <!-- form Edit Stok Produk -->
    <v-dialog
    v-model="dialogNama"
    width="1000"
    >      
      <b-overlay :show="loading2" rounded="sm">    
      <v-card >
        <v-card-title class="text-h5 grey lighten-2 mb-4">
          Edit Stok Produk
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
                <v-col cols="12" md="10">
                    <v-text-field
                        v-model="nama"
                        label="Nama Barang"    
                        outlined                        
                        clearable
                        disabled
                    ></v-text-field>      
                </v-col>
                <v-col cols="12" md="2">                  
                    <v-text-field
                    label="Stok"
                    min="0"
                    v-model="stok"
                    suffix="pcs"
                    type=number
                    v-on:keyup.enter="editStokAdmin()"
                    ></v-text-field>
                </v-col>                
            </v-row>      
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialogNama = false"
          >
            Batal
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="editStokAdmin()"
          >
            Edit
          </v-btn>
        </v-card-actions>
      </v-card>
      </b-overlay>
    </v-dialog>       
    <!-- form Edit Stok Produk -->  
  </div>

</template>

<script>
    import { mapGetters,mapActions,mapMutations } from 'vuex'
    import Swal from 'sweetalert2'
    import axios from 'axios'
import kategori from '../store/module/kategori'
import { Button } from 'bootstrap'

  export default {
    data() {
      return {
        tabel: 'all',
        perPage: 10,
        allData :[],
        totalItem:0,
        currentPage:1,
        // search
        loading2: false,
        src: '',
        dataSrc: [],
        headers:[            
          { text: 'Nama', value: 'nama' },
          { text: 'Kategori', value: 'kat' },
          { text: 'Harga Modal', value: 'modal' },
          { text: 'Stok', value: 'stok' },
          { text: 'Harga Jual', value: 'harga' },
          { text: 'Kode Barang', value: 'kodeBarang'},
            { text: 'Actions', value: 'actions', sortable: false },],        

        // form
        dialog: false,
        nama: '',
        stok:0,
        modal:null,
        harga:null,
        kodeBarang: '',
        kat:'-',
        // foto
        // isCameraOpen: false,
        // isPhotoTaken: false,
        // isShotPhoto: false,
        // isLoading: false,
        // link: '#',

        // edit nama
        dialogNama: false,

        // edit kode
        dialog2: false,
        kodeItem: '',
        kodeLama: ''
      }
    },
    computed:{
        ...mapGetters({
          loading: 'item/getLoading',
          allItem: 'item/getAllItem',
          getKatProduk: 'kategori/getKatProduk'
        }),     
        getRole(){
          return this.$store.state.userRole
        }           
    },    
    methods:{     
        ...mapActions({
          search: 'item/fetchAction',
          }),     
        ...mapMutations({
          fillLoading: 'item/fillLoading'        
        }),                        
        search(){                
          if(this.src === ''){                
            this.fillLoading(true)
            this.allData = []
            this.tabel = 'all'
            axios({
              url: `https://kueku-server-15ecaf79af24.herokuapp.com/item?page=${this.currentPage}&limit=${this.perPage}`,
              method: 'get',
              headers:{
                  token : localStorage.getItem('token')
              }
            })      
                  .then(({data})=>{      
                    this.allData = data.results    
                    this.totalItem = data.Total       
                    this.fillLoading(false)
                  })
                  .catch(err=>{
                      console.log(err)
                  })   
          } else{
            this.currentPage = 1
            this.fillLoading(true)
            this.allData = []
            this.tabel = 'search'
            axios({
              url: `https://kueku-server-15ecaf79af24.herokuapp.com/item/search?src=${this.src}`,
              method: 'get',
              headers:{
                  token : localStorage.getItem('token')
              }
            })      
                  .then(({data})=>{         
                    this.allData = data.results                  
                    this.fillLoading(false)
                  })
                  .catch(err=>{
                      console.log(err)
                  })        
          }     
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
        },

        editOneData(itm){
                let temp = this.allData.findIndex(function(data) {
                  return data._id === itm._id
                })
                this.allData.splice(Number(temp), 1,itm)
        },

        // edit produk
        formEdit(data){
            this.kat = '-'            
            if(data.kategori !== undefined && data.kategori !== null){
                this.kat = data.kategori._id
            }
            this.tempId = data._id
            this.nama = data.nama
            this.modal = this.getRupiah(data.modal)
            this.harga = this.getRupiah(data.harga)
            this.kodeBarang = data.kodeBarang
            this.stok = this.getRupiah(data.stok)
            this.dialog = true
        },
        // foto
        // toggleCamera() {
        //     this.link = '#'
        //     if(this.isCameraOpen) {
        //         this.isCameraOpen = false;
        //         this.isPhotoTaken = false;
        //         this.isShotPhoto = false;
        //         this.stopCameraStream();
        //     } else {
        //         this.isCameraOpen = true;
        //         this.createCameraElement();
        //     }
        // },
    
        // createCameraElement() {
        //     this.isLoading = true;
            
        //     const constraints = (window.constraints = {
        //                 audio: false,
        //                 video: true
        //             });


        //             navigator.mediaDevices
        //                 .getUserMedia(constraints)
        //                 .then(stream => {
        //         this.isLoading = false;
        //                     this.$refs.camera.srcObject = stream;
        //                 })
        //                 .catch(error => {
        //         this.isLoading = false;
        //                     alert("May the browser didn't support or there is some errors.");
        //                 });
        //     },
            
        // stopCameraStream() {
        //     let tracks = this.$refs.camera.srcObject.getTracks();

        //             tracks.forEach(track => {
        //                 track.stop();
        //             });
        //     },
    
        // takePhoto() {
        //     if(!this.isPhotoTaken) {
        //         this.isShotPhoto = true;

        //         const FLASH_TIMEOUT = 50;

        //         setTimeout(() => {
        //         this.isShotPhoto = false;
        //         }, FLASH_TIMEOUT);
        //     }
            
        //     this.isPhotoTaken = !this.isPhotoTaken;
            
        //     const context = this.$refs.canvas.getContext('2d');
        //     context.drawImage(this.$refs.camera, 0, 0, 450, 337.5);
            
        //     const canvas = document.getElementById("photoTaken").toDataURL()
           
        //     this.link = canvas

        // },        
        editItem(){
                if(!this.loading2){   
                  let temp = {
                    nama: this.nama,
                    modal: this.formatRupiahEsc(this.modal),
                    harga:this.formatRupiahEsc(this.harga),
                    kodeBarang:this.kodeBarang,
                    stok:this.stok  
                  }          

                  if(this.kat !== '-'){
                    temp.kategori = this.kat
                  }

                  this.loading2 = true
                    axios({
                        url: `https://kueku-server-15ecaf79af24.herokuapp.com/item/${this.tempId}`,
                        method: 'put',
                        headers:{
                            token : localStorage.getItem('token')
                        },
                        data:temp
                        })
                        .then(({data}) =>{                                            
                            this.loading2 = false                  
                            this.dialog = false
                            this.editOneData(data)
                        })
                        .catch(err=>{
                            this.loading2 = false                  
                                console.log(err)
                                Swal.fire({
                                icon: 'error',
                                title: 'gagal !',
                                text: err.errors,
                                })                        
                        })                     
                }
        },        

        // edit stok barang
        formEditStokAdmin(item){
          this.dialogNama = true
          this.nama = item.nama
          this.stok = item.stok
          this.tempId = item._id
        },
        editStokAdmin(){
                this.loading2 = true  
                axios({
                    url: `https://kueku-server-15ecaf79af24.herokuapp.com/item/editstok/${this.tempId}`,
                    method: 'put',
                    headers:{
                        token : localStorage.getItem('token')
                    },
                    data:{
                        stok: this.stok                     
                    }
                    })
                    .then(({data}) =>{
                        this.loading2 = false                    
                        this.dialogNama = false
                        this.nama = ''   
                        this.stok = 0     
                        this.editOneData(data)
                    })
                    .catch(err=>{
                            this.loading2 = false                  
                            console.log(err)
                            Swal.fire({
                            icon: 'error',
                            title: 'gagal !',
                            text: err.errors,
                            })                        
                    })         
        },        

        deleteItem(id){
          Swal.fire({
              title: 'Apakah anda yakin ?',
              text: "Ingin menghapus item ini!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Ya, hapus item!"
            }).then((result) => {
              if (result.isConfirmed) {
                axios({
                        url: `https://kueku-server-15ecaf79af24.herokuapp.com/item/${id}`,
                        method: 'delete',
                        headers:{
                            token : localStorage.getItem('token')
                        }
                        })
                        .then((respone) =>{
                            this.search()
                            Swal.fire({
                              icon: "success",
                              title: "Hapus Item Berhasil",
                              showConfirmButton: false,
                              timer: 1500
                            });
                        }) 
              }
            });         
        }         
    },
    watch:{
        currentPage: function(){
          this.search()
        },
        src: function(){
          if(this.src === ''){
            this.search()
          }
        },
        harga: function(){
            if(this.harga){
                var number_string = this.harga.replace(/[^,\d]/g, '').toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    this.harga = sisa ? '.' : '';
                    rupiah += this.harga + ribuan.join('.');
                }            
    
                this.harga = rupiah
            }
        },
        modal: function(){
            if(this.modal){
                var number_string = this.modal.replace(/[^,\d]/g, '').toString()
                var sisa 	= number_string.length % 3,
                    rupiah 	= number_string.substr(0, sisa),
                    ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                        
                if (ribuan) {
                    this.modal = sisa ? '.' : '';
                    rupiah += this.modal + ribuan.join('.');
                }            
    
                this.modal = rupiah
            }
        }                    
    },
    created(){
      if(this.getRole === 'kasir'){
        this.headers = [            
          { text: 'Nama', value: 'nama' },
          { text: 'Kategori', value: 'kat' },
          { text: 'Stok', value: 'stok' },
          { text: 'Harga Jual', value: 'harga' },
          { text: 'Kode Barang', value: 'kodeBarang'}]
      }
      this.search()
    }
  }
</script>
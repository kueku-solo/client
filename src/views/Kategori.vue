<template>
    <div class="overflow-auto"> 
          <v-card max-width="auto" tile flat class="my-5">
            <v-toolbar flat height="60px" >
            <v-spacer></v-spacer>
              <h2>Kategori</h2>
              <v-spacer></v-spacer>                                 
            </v-toolbar>
          </v-card>   

          <!-- tabel -->
          <v-row class="m-4">
            <v-col col="12" sm="12">
              <v-btn
                rounded
                color="#04428D"
                small
                dark
                @click.prevent="openForm()"
                style="margin-bottom: 10px;"
                >
                Buat Kategori
              </v-btn>  

              <v-simple-table
                fixed-header
                height="400px"
                >
                <template v-slot:default >
                <thead>
                    <tr>                                      
                    <th class="text-left" style="color:#000000;background-color: #d4d4d4;">
                        <h5>Nama Kategori</h5>
                    </th>       
                    <th class="text-left" style="color:#000000;background-color: #d4d4d4;">
                        <h5>Action</h5>
                    </th>                                                          
                    </tr>
                </thead>
                <tbody>
                    <tr
                    v-for="item in getKategori"
                    :key="item._id"
                    >
                    <td>{{ item.nama }}</td>
                    <td>
                      <v-btn
                      rounded                      
                      small
                      dark
                      @click.prevent="openFormEdit(item._id,item.nama)"
                      >
                      EDIT
                      </v-btn>  
                      <v-btn
                      style="margin-left: 10px;"
                      rounded
                      color="#a30606"
                      small
                      dark
                      @click.prevent="deleteItem(item._id)"
                      >
                      DELETE
                      </v-btn>                        
                    </td>
                    </tr>
                </tbody>
                </template>
              </v-simple-table>   

              <!-- loading -->
              <v-container style="position: absolute;top: 200px;" v-if="getLoading">            
                <v-row
                    class="fill-height"
                    align-content="center"
                    justify="center"
                >                 
                      <v-progress-circular
                        indeterminate
                        color="black"
                      ></v-progress-circular>                    
                </v-row>
              </v-container> 	
              <!-- loading -->   

            </v-col>     
          </v-row>
          <!-- tabel -->


          <!-- form + kategori -->
          <v-dialog
            v-model="dialog"
            width="1000"      
            >      
            <b-overlay :show="loading2" rounded="sm">
            <v-card >
                <v-card-title class="text-h5 grey lighten-2 mb-4">
                Tambah Kategori
                </v-card-title>
                <v-card-text>
                <v-container>
                    <v-row>
                        <v-col cols="12" md="10">
                            <v-text-field
                                v-model="nama"
                                label="Nama Kategori"    
                                outlined                        
                                clearable
                                v-on:keyup.enter="tambahItem()"
                            ></v-text-field>      
                        </v-col>
                    </v-row>                        
                </v-container>

                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="red darken-1"
                    text
                    @click="dialog = false"
                >
                    Batal
                </v-btn>
                <v-btn
                    color="blue darken-1"
                    text
                    @click="tambahItem()"
                >
                    Tambah
                </v-btn>
                </v-card-actions>
            </v-card>
            </b-overlay>
          </v-dialog>                 
          <!-- form + kategori -->       
          
          <!-- form edit -->
          <v-dialog
            v-model="dialog2"
            width="1000"      
            >      
            <b-overlay :show="loading2" rounded="sm">
            <v-card >
                <v-card-title class="text-h5 grey lighten-2 mb-4">
                Form Edit
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
                                v-on:keyup.enter="editItem()"
                            ></v-text-field>      
                        </v-col>
                    </v-row>                        
                </v-container>

                </v-card-text>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="red darken-1"
                    text
                    @click="dialog2 = false"
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
          <!-- form edit -->              
    </div>
  
  </template>
  
  <script>
    import { mapActions, mapGetters } from 'vuex'
      import Swal from 'sweetalert2'
      import axios from 'axios'

  
    export default {
      data() {
        return {
            // form tambah kategori
            dialog: false,
            loading2: false,
            nama : "",

            // edit
            dialog2: false,
            tempId: ""
        }
      },
      components:{
       
      },
      computed:{  
        ...mapGetters({
                getKategori: 'kategori/getKategori',
                getLoading: 'kategori/getLoading'
            }),           
          getRole(){
            return this.$store.state.userRole
          }           
      },    
      methods:{     
        ...mapActions({
                fetchKategori: 'kategori/fetchKategori'
            }),          
        openForm(){
            this.dialog = true
        },
        tambahItem(){
            this.loading2 = true
            axios({
                    url: `https://kueku-server-15ecaf79af24.herokuapp.com/kategori`,
                    method: 'post',
                    headers:{
                        token : localStorage.getItem('token')
                    },
                    data:{
                        nama: this.nama
                    }
                })
                .then(({data}) =>{
                    this.fetchKategori()
                    this.nama = ""               
                    this.loading2 = false       
                })
                .catch(err=>{
                    this.loading2 = false
                    console.log(err.response)
                    Swal.fire({
                    icon: 'error',
                    title: 'isi data dengan lengkap !',
                    text: err.errors,
                    })         
                        
                })    
            }, 
        openFormEdit(id,tempNama){
            this.tempId = id
            this.nama = tempNama
            this.dialog2 = true
        },
        editItem(){
            this.loading2 = true
            axios({
                    url: `https://kueku-server-15ecaf79af24.herokuapp.com/kategori/${this.tempId}`,
                    method: 'put',
                    headers:{
                        token : localStorage.getItem('token')
                    },
                    data:{
                    nama: this.nama
                    }
                })
                .then(({data}) =>{
                    this.fetchKategori()
                    this.nama = ""           
                    this.loading2 = false      
                    this.dialog2 = false 
                })
                .catch(err=>{
                        this.loading2 = false
                        console.log(err.response)
                        Swal.fire({
                        icon: 'error',
                        title: 'isi data dengan lengkap !',
                        text: err.errors,
                        })         
                        
                })                   
        },                              
        deleteItem(id){
            Swal.fire({
                title: 'Apakah anda yakin akan menghapus?',
                showDenyButton: true,
                confirmButtonText: `Batal`,
                denyButtonText: `Ya,Hapus`,
                }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                        
                } else if (result.isDenied) {                      
                    axios({
                    url: `https://kueku-server-15ecaf79af24.herokuapp.com/kategori/${id}`,
                    method: 'delete',
                    headers:{
                        token : localStorage.getItem('token')
                    }
                    })
                    .then((respone) =>{       
                        this.fetchKategori()                         
                        Swal.fire('deleted!', '', 'success')
                    })                   
                }
            })            
    }                                        
      },
      watch:{
                        
      },
      created(){
        this.fetchKategori()
      }
    }
  </script>
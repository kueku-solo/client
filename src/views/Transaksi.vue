<template>
  <div>
    <v-card max-width="auto" tile flat class="my-5" v-if="!print">
      <v-toolbar color="" flat height="60px" >
      <v-spacer></v-spacer>
        <h2>Transaksi</h2>
        <v-spacer></v-spacer>
      </v-toolbar>
    </v-card>
    <v-row v-if="data !== null && !print">
        <!-- item -->
        <v-col cols="12" md="7" v-if="!print">
          <!-- <b-card class="ml-1"  footer-tag="footer" header-tag="header" >
                    <TabelKategori />                          
          </b-card>  -->
              <b-tabs card v-if="!print">
                  <b-tab title="All Item" active>
                      <b-card-text>
                        <b-card class="ml-1"  footer-tag="footer" header-tag="header" >
                                <TabelAllitem/>                          
                        </b-card>                      
                      </b-card-text>
                  </b-tab>
                  <b-tab title="Kategori">
                    <b-card-text>
                        <b-card class="ml-1"  footer-tag="footer" header-tag="header" >
                                <TabelKategori/>                          
                        </b-card>                      
                    </b-card-text>  
                  </b-tab>
              </b-tabs>            
        </v-col>
        <!-- item -->

        <!-- cart -->
        <v-col cols="12" md="5">  
          <b-card class="mr-1" v-if="!print" >                
              <Cart />
          </b-card>
        </v-col>
        <!-- cart -->
        
    </v-row>    

    <Billing v-if="print" />        

    <!-- kasir belum mulai shift -->
    <v-dialog
        v-model="dialog"
        max-width="290"
      >
        <v-card>
          <v-card-title class="text-h5">
            Belum Memulai Shift?
          </v-card-title>

          <v-card-text>
            pilih halaman shift lalu lakukan MULAI SHIFT terlebih dahulu.
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              @click="dialog = false"
            >
              Mengerti
            </v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>         
    <!-- kasir belum mulai shift -->
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import TabelAllitem from '../components/TabelAllItem.vue'
  import TabelKategori from '../components/AllKategori.vue'
  import Billing from '../components/Billing.vue'
  import Cart from '../components/Cart.vue'

  export default {
    data() {
      return {
        // shift
        dialog: false,
        tab:"one"
      }
    },
    components: {
        TabelAllitem,
        TabelKategori,
        Billing,
        Cart
    },
    computed:{
        ...mapGetters({
            print: 'transaksi/getPrint',
            allItem: 'item/getAllItem',
            loading: 'item/getLoading',
            //shift kasir
            shift: 'shift/getShift' ,
            data: 'shift/getData'

        }),      
        getRole(){
          return this.$store.state.userRole
        }             
    },        
    watch: {
        data: function(){
            if(this.data === null){
                this.dialog = true
            }
        }   
    },   
    methods: { 
        ...mapActions({
            fetchShift: 'shift/getDataShift'
        }),               
    },
    created(){
         this.fetchShift()
    }      
  }
</script>
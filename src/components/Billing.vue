<template>
  <div class="overflow-auto"> 
            <div class="ticket">
                <p class="centered">
                    KUEKU SOLO
                    <br>
                    instagram : kueku_solo
                </p>
            <div>
                <small>{{getDateFull}}</small>
                <br>
                <small>{{transaksi.jam}}</small>
                <br>
                <small>{{transaksi.kasirName}}</small>    
                <br>            
                <small>___________________________</small>
            </div>                  

            <div v-for="item in items" :key="item._id">
                <small style="font-weight: bold;">- {{item.nama}}</small>
                <br>
                <small >{{getRupiah(item.harga)}} x {{item.qty}} = Rp{{getRupiah(item.harga * item.qty)}}</small>                
                <br>
                <p></p>
            </div> 
            <div>
                <small>___________________________</small>
            </div>
            <div>
                <small>SubTotal:Rp{{getRupiah(transaksi.total + transaksi.diskon)}}</small>
                <br>
                <small>Diskon:Rp{{getRupiah(transaksi.diskon)}}</small>
                <br>
                <small style="font-weight: bold;">Total:Rp{{getRupiah(transaksi.total)}}</small>
                <br>
                <small>Bayar:Rp{{getRupiah(transaksi.bayar)}}</small>
                <br>
                <small>Kembali:Rp{{getRupiah(transaksi.kembali)}}</small>                    
            </div>   
            <div class="mt-3">
                <p class="centered">
                    TERIMAKASIH TELAH BERBELANJA   
                    <br>
                    <br>
                </p>
            </div>
        </div>
        <!-- <b-button @click.prevent="printOke()" v-if="show">Print</b-button>  -->

  </div>

</template>

<script>
    import { mapGetters,mapActions,mapMutations } from 'vuex'

  export default {
    data() {
      return {    
          show: false          
      }
    },
    computed:{
        userName(){
        return this.$store.state.user
        },        
        ...mapGetters({
            items: 'transaksi/getListItem',
            printStatus: 'transaksi/getPrint',
            transaksi: 'transaksi/getTransaksi'
        }),      
        getDateFull: function(){
                var newDate = new Date()
                var date= newDate.getDate()
                var month = newDate.getMonth()
                var year = newDate.getFullYear()
                return `${date}/${month+1}/${year}`
        }         
    },    
    methods:{       
        // 
        ...mapMutations({
          fillPrint: 'transaksi/fillPrint',
          fillItem: 'transaksi/fillItem'
        }),         
        print(){
            this.fillPrint(true)
            this.show = true
        },
        printOke(){
            window.print()
            this.fillPrint(false)
            this.fillItem(false)
            this.show = false
        },
        ...mapActions({
            fetchItem: 'item/fetchAction',
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
            console.log(angka)
            let al = "";
            if(angka=="" || angka==null || angka=="null" || angka==undefined){
                al = "";
            } else {
                al = Math.abs(angka.replace(/[^,\d]/g, '').toString());
            }
            return al;
        },
        getHargaGrosir(item){
            if(item.hargaGrosir === null || item.hargaGrosir === false){
                return item.hargaEcer
            }else{
                return item.hargaGrosir
            }
        },
        getTotalHargaGrosir(data){
            if(data.hargaGrosir === null || data.hargaGrosir === false){
                return data.hargaEcer * data.qty                    
            }else{
                return data.hargaGrosir * data.qty
            }
        }                         
    },
    watch:{
        show: function(){
                if(this.show){
                    this.printOke()
                }
            }       
    },
    created(){        
        this.show = false
        this.print()
    }
  }
</script>

<style scoped>
* {
    font-size: 15px;
    font-family:'Times New Roman', Times, serif;
    color: black;
}

td,
th,
tr,
table {
    border-top: 1px solid black;
    border-collapse: collapse;
}

td.description,
th.description {
    width: 70mm;
    max-width: 70mm;
}

td.quantity,
th.quantity {
    width: 70mm;
    max-width: 70mm;
    word-break: break-all;
}

/* td.price,
th.price {
    width: 70mm;
    max-width: 70mm;
    word-break: break-all;
} */

.centered {
    text-align: center;
    align-content: center;
}

.ticket {
    width: 70mm ;
    max-width: 70mm;
}

img {
    max-width: inherit;
    width: inherit;
}

@media print {
    .hidden-print,
    .hidden-print * {
        display: none !important;
    }
}

@page {
    size:70mm;
    margin: 1mm;
}


/* @page {
    size: 40mm 100mm;
    margin: 0;
}
@media print {
    .page {
        margin: 0;
        border: initial;
        border-radius: initial;
        width: initial;
        min-height: initial;
        box-shadow: initial;
        background: initial;
        page-break-after: always;
    }
} */
</style>
<template>
  <div class="overflow-auto"> 
        <div class="ticket">
                <p style="font-weight: bold;" class="centered">
                    KUEKU SOLO
                </p>            
                <p class="centered">
                    instagram : kueku_solo
                    <br>
                    <small>_____________________________</small>
                </p>
            <div>
                <small>{{this.getTanggal(transaksi.createdAt)}}</small>
                <br>
                <small>{{transaksi.jam}}</small>
                <br>
                <small>{{transaksi.kasir.username}}</small>
                <br>
                <small>_____________________________</small>
            </div>                  

            <div v-for="item in items" :key="item._id">                
                <small style="font-weight: bold;">- {{item.nama}}</small>
                <br>
                <small v-if="item.disc === undefined || item.disc <= 0">{{getRupiah(item.harga)}} x {{item.qty}} = Rp{{getRupiah(item.harga * item.qty)}}</small>
                <small v-if="item.disc !== undefined && item.disc > 0">{{getRupiah(item.harga)}} x {{item.qty}} = Rp{{getTotalHargaItem(item)}}</small>
                <br v-if="item.disc !== undefined && item.disc > 0">
                <small v-if="item.disc !== undefined && item.disc > 0">Diskon {{ item.disc }}%</small>              
                <br v-if="item.disc !== undefined && item.disc > 0">
                <p></p>
            </div> 
            <div>
                <small>_____________________________</small>
            </div>
            <div>             
                <small v-if="transaksi.subTotal">SubTotal:Rp{{getRupiah(transaksi.subTotal)}}</small>
                <small v-if="transaksi.subTotal === undefined">SubTotal:Rp{{getRupiah(transaksi.totalHarga)}}</small>
                <br>
                <small v-if="transaksi.diskon !== undefined && transaksi.diskon > 0">Diskon:{{transaksi.diskon}}%</small>
                <br v-if="transaksi.diskon !== undefined && transaksi.diskon > 0">
                <small style="font-weight: bold;">Total:Rp{{getRupiah(transaksi.totalHarga)}}</small>
                <br>
                <small>Metode:{{ transaksi.pembayaran }}</small>                       
                <br>
                <small>Bayar:Rp{{getRupiah(transaksi.bayar)}}</small>                       
                <br>
                <small>Kembali:Rp{{getRupiah(Number(transaksi.bayar) - Number(transaksi.totalHarga))}}</small>                   
            </div>   

            <div class="mt-3">
                <p class="centered">           
                    TERIMA KASIH   
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
import transaksi from '../store/module/transaksi'

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
            },               
    },    
    methods:{       
        getTanggal(str){
            if(str){
                let arr =  str.split('T')

                return arr[0]
            }
        },
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
            let al = "";
            if(angka=="" || angka==null || angka=="null" || angka==undefined){
                al = "";
            } else {
                al = Math.abs(angka.replace(/[^,\d]/g, '').toString());
            }
            return al;
        }      , 
        getTotalHargaItem(item){
                console.log(item)
                let tempTotal = item.harga * item.qty

                let rumus = tempTotal - (tempTotal*item.disc/100)

                return this.getRupiah(rumus)
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
    font-size: 17px;
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
    width: 58mm;
    max-width: 58mm;
}

td.quantity,
th.quantity {
    width: 58mm;
    max-width: 58mm;
    word-break: break-all;
}

/* td.price,
th.price {
    width: 58mm;
    max-width: 58mm;
    word-break: break-all;
} */

.centered {
    text-align: center;
    align-content: center;
}

.ticket {
    width: 58mm ;
    max-width: 58mm;
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
    size:58mm;
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
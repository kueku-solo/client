<template>
  <div class="overflow-auto"> 
        <div class="ticket">
            <p class="centered">
                KUEKU SOLO
                <br>
                instagram : kueku_solo
            </p>
            <small>___________________________</small>
            <div>
                <small>Tgl:{{this.getTanggal(transaksi.createdAt)}}</small>
                <br>
                <small>Jam:{{transaksi.jam}}</small>
                <br>
                <small>Kasir:{{transaksi.kasir.username}}</small>                
            </div>                  
            <small>___________________________</small>

            <div v-for="item in items" :key="item._id">
                <small>- {{item.nama}}</small>
                <br>
                <small>Rp{{ getRupiah(item.harga)  }} x {{item.qty}}</small>
                <br>
                <small>= Rp{{getRupiah(item.harga * item.qty)}}</small>
                <p></p>
            </div> 
            <small>___________________________</small>
            <div>
                <small v-if="transaksi.diskon !== null">SubTotal:Rp{{getRupiah(transaksi.totalHarga + transaksi.diskon)}}</small>
                <small v-if="transaksi.diskon === null">SubTotal:Rp{{getRupiah(transaksi.totalHarga)}}</small>
                <br>
                <small v-if="transaksi.diskon !== null">Diskon:Rp{{getRupiah(transaksi.diskon)}}</small>
                <small v-if="transaksi.diskon === null">Diskon:-</small>
                <br>
                <small>Total:Rp{{getRupiah(transaksi.totalHarga)}}</small>
                <br>
                <small>Bayar:Rp{{getRupiah(transaksi.bayar)}}</small>                       
                <br>
                <small>Kembali:Rp{{getRupiah(Number(transaksi.bayar) - Number(transaksi.totalHarga))}}</small>   
                <br>
                <small>___________________________</small>
            </div>   
            <br>
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
            console.log(angka)
            let al = "";
            if(angka=="" || angka==null || angka=="null" || angka==undefined){
                al = "";
            } else {
                al = Math.abs(angka.replace(/[^,\d]/g, '').toString());
            }
            return al;
        }      ,                
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
    font-family: 'calibri';
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
    width: 30mm;
    max-width: 30mm;
}

td.quantity,
th.quantity {
    width: 30mm;
    max-width: 30mm;
    word-break: break-all;
}

/* td.price,
th.price {
    width: 30mm;
    max-width: 30mm;
    word-break: break-all;
} */

.centered {
    text-align: center;
    align-content: center;
}

.ticket {
    width: 30mm ;
    max-width: 30mm;
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
    size:30mm;
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
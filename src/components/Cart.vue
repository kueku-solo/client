<template>
<div class="page-container">
    <div class="header">
        <div>
            <h1>Nota</h1>
            <p>Tanggal: {{getDateFull}}</p>
        </div>
    </div>
    <b-table
      id="my-table"
      :items="items"
      :fields="fields"
      small
      hover
    >
        <template #cell(Item)="row">
            <span class="mr-auto">{{row.item.nama}}</span>            
        </template>      
        <template #cell(Qty)="row">
          <input type="number" min="0" v-model="row.item.qty"   @keyup.alt.enter="bayar()"/>
        </template>  
        <template #cell(Disc%)="row">
            <!-- <input type="number" min="0" max="100" v-model="row.item.disc"   @keyup.alt.enter="bayar()"/> -->
            <v-text-field
                        v-model="row.item.disc"
                        prefix="%"
                        @keyup.alt.enter="bayar()"
                    ></v-text-field>
        </template>  
        <template #cell(Harga)="row">
          <p>Rp {{ getRupiah(row.item.harga) }}</p>
        </template>      
        <template #cell(Total)="row">
          <p>Rp {{ getTotalHargaItem(row.item)}}</p>
        </template>             
        <template #cell(Delete)="row">
            <a @click="deleteItem(row.index)">
              <v-icon color="red" small>mdi-delete</v-icon>
            </a>                                
        </template>                                        
    </b-table>                
    <table>
        <tr>
            <td>QtyTotal : </td>
            <td>{{qtyTotal}}</td>
        </tr>
        <tr>
            <td>Subtotal : </td>
            <td>Rp {{getRupiah(subTotal) }}</td>
        </tr>
        <tr>
            <td>
                <div class="cell-with-input">
                    Discount :   
                </div>
            </td>
            <td>               
                    <v-text-field
                        v-model="diskon"
                        prefix="%"
                    ></v-text-field>
            </td>
        </tr>
        <tr>
            <td>
                <div class="cell-with-input">
                    Potongan Harga :   
                </div>
            </td>
            <td>               
                    <v-text-field
                        v-model="potHarga"
                        prefix="Rp"
                    ></v-text-field>
            </td>
        </tr>        
        <tr class="text-bold">
            <td>Grand Total : Rp {{ getRupiah(grandTotal) }}</td>
        </tr>
    </table>
    <v-btn
    color="blue darken-1"
    text
    @click="bayar()"
    >
    Bayar
    </v-btn>

    <v-btn
    color="green darken-1"
    text
    @click="tambahAntrian()"
    >
    Masuk Antrian
    </v-btn>

    <!-- form uang dibayar -->
    <v-dialog
    v-model="dialog"
    width="1000"
    >      
      <v-card >
        <v-card-title class="text-h5 grey lighten-2 mb-4" v-if="transaksi.pembayaran !== 'Bank'">
        Total:   Rp {{ getRupiah(grandTotal) }}
        </v-card-title>
        <v-card-title class="text-h5 grey lighten-2 mb-4" v-if="transaksi.pembayaran === 'Bank'">
        Total:   Rp {{ getRupiah(total) }}
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
                <v-col cols="12" md="6" v-if="transaksi.pembayaran !== 'Bank'">
                    <v-text-field
                    label="Uang"
                    v-model="uang"
                    prefix="Rp"
                    ></v-text-field>
                </v-col> 
                <v-col cols="12" md="6" v-if="transaksi.pembayaran === 'Bank'">   
                    <v-text-field
                    label="MDR"
                    v-model="charge"
                    prefix="%"
                    ></v-text-field>
                </v-col> 
                <v-col cols="12" md="6">                  
                    <v-select
                    :items="pembayaran"
                    v-model="transaksi.pembayaran"
                    label="Metode Pembayaran"
                    ></v-select>
                </v-col>                     
            </v-row>
            <v-row>
                <v-col cols="12" md="6" v-if="transaksi.pembayaran !== 'Bank'">
                    <h1>
                    Kembali:               
                    Rp {{getRupiah(kembalian)}}
                    </h1>
                </v-col>              
            </v-row>            
          </v-container>
          <small v-if="transaksi.pembayaran !== 'Bank'">*isi jumlah uang pembeli</small>
          <small v-if="transaksi.pembayaran === 'Bank'">*isi jumlah MDR Bank</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="batal()"
          >
            Batal
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click="inputPin()"
            v-on:keyup.alt.enter="inputPin()"
          >
            Bayar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>           
    <!-- form uang dibayar -->

    <!-- form input pin -->
    <v-dialog
    v-model="dialog2"
    width="500">
    <v-card>
        <v-card-title class="text-h5 grey lighten-2 mb-4">
        Input Barcode :
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row style="display: flex;justify-content: center;">
                <v-col cols="12" md="12" style="display: flex;justify-content: center;">   
                    <v-text-field
                        v-if="!getLoading"
                        solo
                        label="Scan Barcode"
                        v-on:keyup.enter="tambahTransaksi()"
                        class="mr-4 ml-4"
                        clearable
                        v-model="transaksi.pin"
                        type="password"
                    ></v-text-field>   
                    <v-progress-circular
                        v-if="getLoading"
                        color="primary"
                        indeterminate
                        size="64"
                    ></v-progress-circular> 
                </v-col>           
            </v-row>            
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog2 = false"
          >
            Batal
          </v-btn>
          <v-btn
            v-if="!getLoading"
            color="blue darken-1"
            text
            @click="tambahTransaksi()"
            v-on:keyup.alt.enter="tambahTransaksi()"
          >
            print
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- form input pin -->

</div>

</template>

<script>
    import { mapActions, mapGetters } from 'vuex'
    import Swal from 'sweetalert2'
    import PincodeInput from 'vue-pincode-input'

    export default {

        data(){
        return {
                fields:['Item','Qty','Disc%','Harga','Total','Delete'],
                discountRate: 0,
                dialog: false,
                pembayaran: ['Tunai', 'Bank'],
                uang: null,
                diskon:0,
                potHarga:0,
                transaksi:{
                    total: 0,
                    bayar: 0,
                    pembayaran: 'Tunai',
                    kembali: 0,
                    pin:""
                },
                charge:0,
                dialog2: false,
            }
        },
        components:{
            PincodeInput
        },
        methods: {
            ...mapActions({
                createTransaksi: 'transaksi/createTransaksi',
                addAntrian: 'transaksi/addAntrian',
            }),                
            batal(){
                this.dialog = false
            },
            inputPin(){
                this.dialog2 = true
                this.dialog = false
            },
            bayar(){                
                if(this.items.length > 0){
                let flag = true
                for(let i = 0; i < this.items.length; i++){
                    if(this.items[i].qty > this.items[i].stok){
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Ada item yang melebihi stok!',
                            }) 
                        flag = false
                        break
                    }
                }
                if(flag){
                    this.dialog = true
                    this.uang = `${this.grandTotal}`
                    this.total = this.grandTotal
                    this.charge = 0
                }                    
                }
            },
            tambahAntrian(){
                    this.transaksi.diskon = this.formatRupiahEsc(this.diskon)
                    this.transaksi.total = this.grandTotal
                    this.transaksi.listItem = this.items

                    this.addAntrian(this.transaksi)
            },
            tambahTransaksi(){       
                    if(this.transaksi.pembayaran === 'Tunai'){
                        this.transaksi.total = this.grandTotal
                        this.transaksi.bayar = this.formatRupiahEsc(this.uang)
                    }else if(this.transaksi.pembayaran === 'Bank'){
                        this.transaksi.total = this.total
                        this.transaksi.bayar = this.total
                    }        
                    this.transaksi.subTotal = this.subTotal
                    this.transaksi.diskon = this.formatRupiahEsc(this.diskon)
                    this.transaksi.listItem = this.items
                    if(this.transaksi.bayar < this.transaksi.total){
                            Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: 'Uang tidak cukup!',
                            })
                    }else{
                                this.transaksi.kasir = {username:this.userName,userId:this.userId}
                                this.transaksi.id = '-'
                                this.createTransaksi(this.transaksi)                                                                         
                    }
            },
            deleteItem: function(index) {
                this.items.splice(index, 1)
            },
            printInvoice: function() {
                window.print();
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
            getTotalHargaItem(item){
                let tempTotal = item.harga * item.qty

                let rumus = tempTotal - (tempTotal*item.disc/100)

                return this.getRupiah(rumus)
            }                 
        },
        computed: {
            userName(){
            return this.$store.state.user
            },       
            userId(){
            return this.$store.state.userId
            },                 
            ...mapGetters({
                items: 'transaksi/getListItem',
                getLoading: 'transaksi/getLoading'
            }),                 
            getDateFull: function(){
                var newDate = new Date()
                var date= newDate.getDate()
                var month = newDate.getMonth()
                var year = newDate.getFullYear()
                return `${date}/${month+1}/${year}`
            },          
            subTotal: function() {
                var total = this.items.reduce(function(accumulator, item) {
                    let tempTotal = item.harga * item.qty

                    let rumus = tempTotal - (tempTotal*item.disc/100)

                        return accumulator + rumus;                    
                }, 0)
                return total;
            },
            qtyTotal: function() {
                var total = this.items.reduce(function(accumulator, item) {
                        return Number(accumulator) + Number(item.qty);                    
                }, 0)
                return total;
            },
            discountTotal: function() {                
                var total = this.subTotal * (Number(this.diskon)/100)                
                return total;
            },
            grandTotal: function() {
                var total = this.subTotal - this.discountTotal - this.formatRupiahEsc(this.potHarga)
                return total;
            },
            kembalian: function(){
                let temp = this.formatRupiahEsc(this.uang) - this.grandTotal
                this.transaksi.kembali = temp
                return temp
            }
        },
        watch: {
            uang: function(){
                if(this.uang){
                    var number_string = this.uang.replace(/[^,\d]/g, '').toString()
                    var sisa 	= number_string.length % 3,
                        rupiah 	= number_string.substr(0, sisa),
                        ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                            
                    if (ribuan) {
                        this.uang = sisa ? '.' : '';
                        rupiah += this.uang + ribuan.join('.');
                    }            
        
                    this.uang = rupiah
                }
            },
            potHarga: function(){
                if(this.diskon){
                    var number_string = this.diskon.replace(/[^,\d]/g, '').toString()
                    var sisa 	= number_string.length % 3,
                        rupiah 	= number_string.substr(0, sisa),
                        ribuan 	= number_string.substr(sisa).match(/\d{3}/g);
                            
                    if (ribuan) {
                        this.diskon = sisa ? '.' : '';
                        rupiah += this.diskon + ribuan.join('.');
                    }            
                    

                    this.diskon = rupiah
                }
            },
            charge: function(){
                if(this.transaksi.pembayaran === 'Bank'){
                  this.total =  this.grandTotal + (this.grandTotal * this.charge/100)
                }
            }
        }
    }

</script>

<style scoped>

body {
    background: linear-gradient(to right, red, yellow);
}


#invoice-app {
    background-color: white;
    padding: 2rem;
    border-radius: 0.5rem;
}

.header {
    @media (min-width: 761px) {
        display: flex;
    }
}

.text-right {
    text-align: right;
}

.text-bold {
    font-weight: bold;
}
</style>
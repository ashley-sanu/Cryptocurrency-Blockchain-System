const {STARTING_BALANCE}=require('../config');
const{ec}=require('../utilities');
const Transaction=require('./transaction');
const cryptoHash = require('../utilities/crypto-hash');

class Wallet{
    constructor(){
        this.balance=STARTING_BALANCE;

        this.keyPair=ec.genKeyPair();
        this.publicKey=this.keyPair.getPublic().encode('hex');
    }
    sign(data){
        return this.keyPair.sign(cryptoHash(data));
    }

    createTransaction({amount,recipient}){
        if(amount>this.balance){
            throw new Error('Amount exceeds balance');
        }
        return new Transaction({senderWallet:this,recipient,amount});

    }
}

module.exports=Wallet;
const {v1:uuid}=require('uuid');
const verifySignature=require('../utilities');
const {REWARD_INPUT,MINING_REWARD}=require('../config')

class Transaction{
    constructor({senderWallet,recipient,amount,outputMap,input}){
        this.id=uuid();
        this.outputMap=outputMap || this.createOutputMap({senderWallet,recipient,amount});
        this.input=input || this.createInput({senderWallet,outputMap:this.outputMap});

    }
    createOutputMap({senderWallet,recipient,amount})
    {
        const outputMap={};
        outputMap[recipient]=amount; //amount recieved by the recipient
        outputMap[senderWallet.publicKey]=senderWallet.balance-amount;
        //balance in sender's wallet after transaction
        return outputMap;
    }

    createInput({senderWallet,outputMap}){
        return{
            timestamp:Date.now(),
            amount:senderWallet.balance,
            address:senderWallet.publicKey,
            signature:senderWallet.sign(outputMap)
        }
    }

    //if an object of a transaction between a sender and reciever is already created,
    // for recording another transaction, you can just update the amount and the balance in sender's wallet after transaction in outputMap
    //and replace the old input object with new
    update({senderWallet,recipient,amount}){
        if(amount>this.outputMap[senderWallet.publicKey]){
            throw new Error('Amount exceeds balance');
        }

        if(!this.outputMap[recipient]){
            this.outputMap[recipient]=amount;
        }
        else{
            this.outputMap[recipient]= this.outputMap[recipient]+amount;
        }
        this.outputMap[senderWallet.publicKey]=this.outputMap[senderWallet.publicKey]-amount;

        this.input=this.createInput({senderWallet,outputMap:this.outputMap});
    }

    static validTransaction(transaction){
        const {input,outputMap}=transaction;
        const {amount,signature,address}=input;

        const initialBalance=Object.values(outputMap).reduce((total,eachvalue)=>total+eachvalue);
        if(amount!=initialBalance)
        {
            return false;
        }
        if(!verifySignature({address,outputMap,signature}))
        return false;
        return true;
    }

    static rewardTransaction({minerWallet}){
        return new this({
            input:REWARD_INPUT,
            outputMap:{[minerWallet.publicKey]:MINING_REWARD}
        })
    }
}

module.exports=Transaction;
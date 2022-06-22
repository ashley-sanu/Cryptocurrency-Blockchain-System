const PubNub=require('pubnub');


const credentials={
    publishKey:'pub-c-211f8265-5c17-4725-9f79-bc38363c088b',
    subscribeKey:'sub-c-04b4fbd1-0279-421f-a70a-961837adc43b',
    secretKey:'sub-c-04b4fbd1-0279-421f-a70a-961837adc43b',
    uuid: 'myUniqueUUID',
}

const CHANNELS={
    TEST:'TEST',
    BLOCKCHAIN:'BLOCKCHAIN',
    TRANSACTION:'TRANSACTION'
}

class PubSub{
    constructor({blockchain,transactionPool,wallet}){
        this.wallet=wallet;
        this.blockchain=blockchain;
        this.transactionPool=transactionPool;

        this.pubnub= new PubNub(credentials);
        this.pubnub.subscribe({channels:Object.values(CHANNELS)});

        this.pubnub.addListener(this.listener());

    }

    broadcastChain()
    {
        this.publish({
            channel:CHANNELS.BLOCKCHAIN,
            message:JSON.stringify(this.blockchain.chain)
        })
    }


    broadcastTransaction(transaction){
        this.publish({
            channel:CHANNELS.TRANSACTION,
            message:JSON.stringify(transaction)
        })
    }

    handleMessage(channel,message){
        console.log(`Message recieved: ${message}. Channel: ${channel}`);
        const parsedmessage=JSON.parse(message);

        switch(channel){
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedmessage);
                break;
            case CHANNELS.TRANSACTION:
                if (!this.transactionPool.existingTransaction({
                    inputAddress: this.wallet.publicKey
                  })) {
                    this.transactionPool.addTransaction(parsedmessage);
                  }
                  break;
            default:
                return;

        }

    }

    listener(){
        return{
            message:messageObject=>{
                const{channel,message}=messageObject;
                console.log(`Message recieved. Channel : ${channel} Message: ${message}`);
            }
        }
    }

    publish({channel,message}){
        this.pubnub.publish({channel,message});
    }
}



module.exports=PubSub;
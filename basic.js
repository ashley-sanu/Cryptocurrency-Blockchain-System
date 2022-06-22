const createhash=(data)=>{
    return data+"*";
}
class Block{
    constructor(data,hash,prevhash){
        this.data=data;
        this.hash=hash;
        this.prevhash=prevhash;
    }
}
class Blockchain{
    constructor(){
        const genesis=new Block('gen-data','gen-hash','gen-prevhash');
        this.chain=[genesis];
    }
    addblock(data){
        const prevhash=this.chain[this.chain.length-1].hash;
        const hash=createhash(data+prevhash);
        const block=new Block(data,hash,prevhash);
        this.chain.push(block);
    }
}

const blockchain=new Blockchain();
blockchain.addblock("one");
blockchain.addblock("two");
blockchain.addblock("three");
console.log(blockchain);


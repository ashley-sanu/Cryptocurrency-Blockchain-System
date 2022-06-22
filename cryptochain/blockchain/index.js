const Block = require("./block");
const cryptoHash = require("../utilities/crypto-hash");

class Blockchain{
    constructor(){
        this.chain=[Block.genesis()];
    }
    addBlock({data}){
        let lastBlock=this.chain[this.chain.length-1];
        const newBlock=Block.mineBlock({lastBlock,data});
        this.chain.push(newBlock);


    }
    static isValid(chain){
        //validate genesis block
        if(JSON.stringify(chain[0])!==JSON.stringify(Block.genesis())){
           
            return false;
        }
        //validate whether all last hashes of blocks are correctly the hashes of prev blocks
        //validate whether hash of each block is correctly derived from its components
        for(let i=1;i<chain.length;i++)
        {
            const actualLastHash=chain[i-1].hash;
            const block=chain[i];
            const {timestamp,data,lastHash,hash,difficulty,nonce}=block;
            //timestamp of block i is copied to const timestamp
            if(lastHash!==actualLastHash) return false;


            let actualHash=cryptoHash(timestamp,lastHash,data,difficulty,nonce);
            if(actualHash!==hash) {return false;}

            const lastDifficulty=chain[i-1].difficulty;
            if(Math.abs(lastDifficulty-difficulty) > 1) {return false;}
        }
        return true;
    }

    replaceChain(chain){
        console.log('hey here');
        if(chain.length<=this.chain.length) {return;}
        if(!Blockchain.isValid(chain)) {return;}
        this.chain=chain;
    } 
}

module.exports=Blockchain;
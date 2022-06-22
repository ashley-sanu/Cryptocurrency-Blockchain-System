const hexToBinary = require('hex-to-binary');
const {GENESIS_DATA,MINE_RATE}=require('../config');
const cryptoHash = require('../utilities/crypto-hash');

class Block{
    constructor({timestamp,data,lastHash,hash,nonce,difficulty}){
        this.timestamp=timestamp;
        this.data=data;
        this.lastHash=lastHash;
        this.hash=hash;
        this.nonce=nonce;
        this.difficulty=difficulty;
    }
//difficulty is the number of leading 0's in a hash
//nonce is the number the miners has to guess inorder to add a new block
    static genesis(){
        return new Block(GENESIS_DATA);
    }
    static mineBlock({lastBlock,data}){
        const lastHash=lastBlock.hash;
        let timestamp,hash;
        let nonce=0;
        let {difficulty}=lastBlock;

        do{
            nonce++;
            timestamp=Date.now();
            difficulty=Block.adjustDifficulty({originalBlock: lastBlock,timestamp});
            hash=cryptoHash(timestamp,lastHash,data,difficulty,nonce);
            

        }while(hexToBinary(hash).substring(0,difficulty)!=='0'.repeat(difficulty))
        //check if the first 'difficulty' number of characters in the binary number of hash, if theyre all zeros,take that as the hash
        return new Block({
            timestamp,
            lastHash,
            data,
            hash,
            difficulty,nonce
        })
    }

    static adjustDifficulty({originalBlock,timestamp})
    {
        const {difficulty}=originalBlock;
        let difference=timestamp-originalBlock.timestamp;

        if(difficulty<1) return 1;
        //minerate is the time interval between two block addition .ie, if difficulty rate is 10minutes, a block is generated every 10 minutes
        //if current block is generated 10+minutes after the previous block, difficulty has to be decreased to maintain the mine rate
        //else, increase difficulty by 1 in each block creation
        if(difference>MINE_RATE){
            return difficulty-1;
        }
        
        return difficulty+1;
    }

}

module.exports=Block;
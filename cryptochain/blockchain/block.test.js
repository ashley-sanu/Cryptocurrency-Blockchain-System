const Block = require("./block");
const {GENESIS_DATA}=require("../config");
describe('Block',()=>{
    const timestamp='a-date';
    const data='a-data';
    const lastHash='a-lasthash';
    const hash='a-hash';
    const nonce=1;
    const difficulty=1;
    const block=new Block({timestamp,data,lastHash,hash,nonce,difficulty});

    it('has a timestamp,data,last hash and hash',()=>{
        expect(block.timestamp).toEqual(timestamp);
        expect(block.data).toEqual(data);
        expect(block.hash).toEqual(hash);
        expect(block.lastHash).toEqual(lastHash);
        expect(block.difficulty).toEqual(difficulty);
        expect(block.nonce).toEqual(nonce);
        
    })

    describe('genesis()',()=>{
        const genesisBlock=Block.genesis();
        it('returns a block instance',()=>{
            expect(genesisBlock instanceof Block).toBe(true);
        })
        it('returns the genesis data',()=>{
            expect(genesisBlock).toEqual(GENESIS_DATA);
        })
    })

    describe('mineBlock()',()=>{
        const lastBlock=Block.genesis();
        const data='mined data';
        
    })
})
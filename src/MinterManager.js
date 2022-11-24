const Web3 = require("web3");
const fs = require("fs/promises");
require("dotenv").config();

const web3 = new Web3(process.env.WEB3_RPC);

class MinterManager{

    endBlock  = 0;
    minterData = `./files/minter.json`;

    constructor(){
        (async ()=>{
            this.setEndBLock(await web3.eth.getBlockNumber());
            await this.writeMinterData();
        })();
    }

    setEndBLock(endBlock){
        this.endBlock = endBlock;
        console.log('end block at ->',this.endBlock)
    }

    async writeMinterData(){
        try{
            const data  = await this.getMinter();
            console.table(data);
            await fs.writeFile(this.minterData,JSON.stringify(data));
        }catch(error){
            console.error(`write file error! -->`,error.stack);
        }
    }

    async getMinter(){
        try{
            const latestBlock = this.endBlock;

            const param = [
                {type : "address" , name : "_owner"},
                {type : "uint256", name : "_nftID"}
            ]
            
            //MintNFT (address _owner, uint256 _nftID)
            const topics0 = "0x1f89f147a58d1673945cf416187db98efc8208408c011b91887acd59fd8523c3";

            const uri = `https://api.bscscan.com/api
                            ?module=logs
                            &action=getLogs
                            &fromBlock=0
                            &toBlock=${latestBlock}
                            &topic0=${topics0}
                            &address=${process.env.NFT_ADDR}
                            &apikey=${process.env.BSC_API_KEY}`.replaceAll(" ","").replaceAll("\n","");
                            
            const rawLogs = (await (await fetch(uri)).json()).result;  

            return (await Promise.all(rawLogs.map(async(item,i)=>{
                        
                    let event = web3.eth.abi.decodeParameters(param, item.data);
                    
                    event._block = parseInt(item.blockNumber,16);
                    event._timestamp = parseInt(item.timeStamp,16);
                    delete event. __length__ ;
                    delete event[`0`];
                    delete event[`1`];

                    return JSON.parse(JSON.stringify(event));
            })));  

        }catch(error){
            console.error(`get minter error -->`,error.stack);
        }
    }
}

new MinterManager();
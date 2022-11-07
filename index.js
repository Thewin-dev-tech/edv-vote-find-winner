// console.log(process.argv);
// return;
const VoteManager = require("./src/VoteManager");

(main=async ()=>{
    try{
        let deadlineBlock = null;
        let enterParam = false;

        process.argv.forEach((item)=>{
            
            const [key,value] = String(item).split("=");

            if(key.toLowerCase() == "block" || key.toLowerCase() == "b" ) {
                enterParam = true;
                return deadlineBlock = value;
            };

        });

        if(!deadlineBlock || !enterParam) throw new Error("Invalid Block Number!!!!");

        const vt = new VoteManager(deadlineBlock);
    }catch(error){
        return console.error(error.stack);
    }
})();
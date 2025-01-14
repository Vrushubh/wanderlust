const mongoose = require("mongoose");

const Listing = require("../models/listing.js")
const initdata = require("./data.js")

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("Connected to Database");
    })
    .catch((err)=>{
        console.log(err);
    })

async function main() {
    await mongoose.connect(mongo_url);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner : "6780ff84199e33ddf916591f",}));
    await Listing.insertMany(initdata.data);
    console.log("Data initialized");
}

initDB();
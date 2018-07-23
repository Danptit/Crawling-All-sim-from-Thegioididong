var Crawler = require("crawler");
Database = require('arangojs').Database;
db = new Database('http://10.11.11.182');
db.useBasicAuth('username', 'password');
db.useDatabase('DBname');
collection = db.collection('Vinaphone');


for(let i = 1; i <= 500; i ++){

     setTimeout(() => {
         returnJSON(i)
     }, 2000);
    //returnJSON(i);
}

function returnJSON (index){
    var c = new Crawler({
        rateLimit: 2000,
        // This will be called for each crawled page
        callback : function (error, res, done) {
            if(error){
                console.log(error);
            }else{
                var $ = res.$;
                let json1 = { DateCrawling: "", phoneNumber : "", price : ""}
                let  data = $('.listsim').children().first() ;
                for(i = 1; i <= 20; i ++){
                    setTimeout(returnEachRJSON, 1500)
                    function returnEachRJSON(){
                    var d = new Date();
                     json1.DateCrawling = d.getTime();
                     json1.phoneNumber = data.children().first().text();
                     json1.phoneNumber = json1.phoneNumber.replace(/\D/g,'');
                     json1.price = data.children().first().next().text();
                     json1.price = json1.price.replace(/\D/g,'');     
                     console.log(json1);
                     doc = {// đẩy data json1 lên db
                        _key: json1.phoneNumber + '', 
                        time : json1.DateCrawling,
                        phone : json1.phoneNumber,
                        price : json1.price
                        
                    };  
                    collection.save(doc).then(
                      meta =>{
                         // console.log('indexx while save data : ' + indexxx);
                         console.log('Document saved:', meta._rev);
        
                      },
                         err => console.error('Failed to save document:', err)
                    );
                     data = data.next();
                    }
                    
                     
                }
              
                
            }
            done();
        }
    });
    c.queue('https://www.thegioididong.com/sim-so-dep/vinaphone?t=57&trang=' + index);

}

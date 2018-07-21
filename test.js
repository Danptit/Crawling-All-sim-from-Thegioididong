var express = require('express');
var fs = require('fs');
var bodyParser = require("body-parser");
var rp = require('request-promise');
var cheerio = require('cheerio');
var app     = express();
Database = require('arangojs').Database;
db = new Database('http://127.0.0.1:8529');
db.useBasicAuth('user1', '123456789');
db.useDatabase('mydb');
collection = db.collection('dataCrawled');

var arr = [];
for(index = 1; index <= 5; index ++){
    arr.push(index);
}

indexxx  = 0;
returnJSON();

function returnJSON(){
    console.log('indexxx----ll--')
     link = 'https://www.thegioididong.com/sim-so-dep/viettel?t=34&trang=' + arr[indexxx];
     //link = link  + arr[indexxx].toString();
     console.log('link before option ' + link);
    var options = {
        
       // uri : 'https://www.thegioididong.com/sim-so-dep/viettel?t=34&c=clone&trang=5',
       // uri: 'https://www.thegioididong.com/sim-so-dep/viettel?t=34&trang=' + arr[indexxx],
       uri: link,
        transform: function (body) {
            console.log('okay option')
            return cheerio.load(body);

        }
        
        
    };
    
    rp(options)
        .then(function ($) {
            console.log('link in option ' + link);
            // Process html like you would with jQuery...
             var json1 = {class : '', DateCrawling: "", phoneNumber : "", price : ""},
             data = $('.listsim').children().first() ;
             //json1.class = $('.packagename').text() ;
             for(i = 1; i <= 3; i ++){
                 
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
                        
                        //setTimeout(returnJSON, 2000);

                     },
                    err => console.error('Failed to save document:', err)
                 );
      
                 data = data.next();
             }

             indexxx = indexxx + 1;
             if(indexxx <= arr[arr.length -1]){
                console.log('indexxx to run next  : ' + indexxx); 
                setTimeout(returnJSON, 2000);

             }
             
             
                   
             

        })
        .catch(function (err) {
            // Crawling failed or Cheerio choked...
            console.log('error----' + err)
        });
}







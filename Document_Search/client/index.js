import Web3 from 'web3';
import Document_Search from '../build/contracts/Document_Search.json';

let web3;
let crud;


const initWeb3 = () => {
  return new Promise((resolve, reject) => {
    if(typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum);
      window.ethereum.enable()
        .then(() => {
          resolve(
            new Web3(window.ethereum)
          );
        })
        .catch(e => {
          reject(e);
        });
      return;
    }
    if(typeof window.web3 !== 'undefined') {
      return resolve(
        new Web3(window.web3.currentProvider)
      );
    }
    resolve(new Web3('http://localhost:9545'));
  });
};

const initContract = () => {
    const deploymentKey = Object.keys(Document_Search.networks)[0];
  return new web3.eth.Contract(
    Document_Search.abi, 
    Document_Search
      .networks[deploymentKey]
      .address
  );
};



const initApp = () => {

    const $Insert_Dummy_Document_Details = document.getElementById('Insert_Dummy_Document_Details');
    const $Insert_Dummy_Document_DetailsResult = document.getElementById('Insert_Dummy_Document_Details-result');
    const $Insert_Document_Details = document.getElementById('Insert_Document_Details');
    const $Insert_Document_DetailsResult = document.getElementById('Insert_Document_Details-result');
    const $Search_Keyword = document.getElementById('Search_Keyword');
    const $Search_KeywordResult = document.getElementById('Search_Keyword-result');
    const $Encryption_Key = document.getElementById('Encryption_Key');
    const $Encryption_KeyResult = document.getElementById('Encryption_Key-result');
  let accounts = [];

  web3.eth.getAccounts()
  .then(_accounts => {
    accounts = _accounts;
  });

  $Insert_Dummy_Document_Details.addEventListener('submit', (e) => {
    e.preventDefault();

        const Docname= e.target.elements[0].value;
        const key= e.target.elements[1].value;
        const Salt= e.target.elements[2].value;
        const bloom= e.target.elements[3].value;

        const brr=[];
        var j=0;
        var start=0;
       for (var i = 0; i < bloom.length; i++) {
         if(bloom[i]==",")
          {
             brr[j]=bloom.substring(start, i);;
             j++;
            start=i+1;
          }
        }
        if(start< bloom.length)
        brr[j]=bloom.substring(start);

       const arr=[];
       for (var i = 0; i < brr.length && i<192; i++) {
         if(brr[i]=='1'){
            arr[i]=true;
         }
         else{
            arr[i]=false;
         }
          
        }

 

        web3.eth.sign(web3.utils.sha3('Hello world'), accounts[0]).then(result => {
          
})
        .catch(_e => {
           
            $Insert_Dummy_Document_DetailsResult.innerHTML = `Ooops... there was an error while trying to sign transaction for  Inserting Document details for ${Docname}`;

        });

        crud.methods.Insert_Dummy(Docname,key,Salt,arr).send({from: accounts[0]})
    .then(result => {
      $Insert_Dummy_Document_DetailsResult.innerHTML = `New Dummy Document ${Docname}  details stored  successfully `;
    })
    .catch(_e => {
      $Insert_Dummy_Document_DetailsResult.innerHTML = `Ooops... there was an error while trying to store Dummy Document deatils for ${Docname} , Maybe slot is full for Dummy Documents`;
    });
  });



  $Insert_Document_Details.addEventListener('submit', (e) => {
    e.preventDefault();

        const Docname= e.target.elements[0].value;
        const key= e.target.elements[1].value;
        const Salt= e.target.elements[2].value;
        const bloom= e.target.elements[3].value;

        const brr=[];
        var j=0;
        var start=0;
       for (var i = 0; i < bloom.length; i++) {
         if(bloom[i]==",")
          {
             brr[j]=bloom.substring(start, i);;
             j++;
            start=i+1;
          }
        }
        if(start< bloom.length)
        brr[j]=bloom.substring(start);

       const arr=[];
       for (var i = 0; i < brr.length && i<192; i++) {
         if(brr[i]=='1'){
           arr[i]=true;
         }
         else{
           arr[i]=false;
         }
         
        }

       
 const prefix = "\x19Ethereum signed message:\n" + "abcdef"

        web3.eth.sign(prefix, accounts[0]).then(result => {
          
})
        .catch(_e => {
            $Insert_Document_DetailsResult.innerHTML = `Ooops... there was an error while trying to sign transaction for  Inserting Document details for ${Docname}`;

        });

        crud.methods.Insert(Docname,key,Salt,arr).send({from: accounts[0]})
    .then(result => {
      $Insert_Document_DetailsResult.innerHTML = `New Document ${Docname}  details stored  successfully `;
    })
    .catch(_e => {
      $Insert_Document_DetailsResult.innerHTML = `Ooops... there was an error while trying to store deatils for ${Docname}`;
    });
  });

  $Encryption_Key.addEventListener('submit', (e) => {
    e.preventDefault();

        const Docname= e.target.elements[0].value;
       
        crud.methods.Key(Docname).call()
    .then(result => {
      $Encryption_KeyResult.innerHTML = `The Encryption key for Docname ${Docname} is ${result} `;
    })
    .catch(_e => {
      $Encryption_KeyResult.innerHTML = `Ooops... there was an error while trying to fetch Encryption key  for ${Docname}`;
    });
  });



 

    $Search_Keyword.addEventListener('submit', (e) => {
    e.preventDefault();

        const keyword1 = e.target.elements[0].value;

        var keyword="";
        for (var i = 0; i < keyword1.length; i++) {
          if(keyword1[i]!=","&&keyword1[i]!=" ")
           {
             keyword+=keyword1[i];
             //index++;  
           
           }
         }

        function calculate_trigram_decimal(text){
          var ans=0;
         var dec=[];
         dec[0]=text.charCodeAt(0);   // unicode to decimal
         dec[1]=text.charCodeAt(1);
         dec[2]=text.charCodeAt(2);
         ans=dec[0]+dec[1]*65536 +dec[2]*Math.pow(65536,2);
         return ans;
         }
         
         
         
            // hash 1
            function h1(s)
          {
              var hash = 0;
              hash=s%10000;
              
                  hash = hash % 192;
             
              return Math.floor(hash);
          }
             // hash 2
             function h2(s)
             {
              var hash = 0;
              var val1=0;
              var val2=0;
              val1=s%10000;
              s=s/10000;
              s=Math.floor(s);
              val2=s%10000;
              
                  hash = (val1+val2) % 192;
             
                  return Math.floor(hash);
             }
                //hash 3
             function h3(s)
             {
              var hash = 0;
              var val1=0;
              var val2=0;
              var val3=0;
              val1=s%10000;
              s=s/10000;
              s=Math.floor(s);
              val2=s%10000;
              s=s/10000;
              s=Math.floor(s);
              val3=s;
                  hash = (val1+val2+val3) % 192;
             
                  return Math.floor(hash);
             }
         
         function Create_Trigrams(a) {
           const str=[];
           var j=0;
           for (var i = 0; i+2 < a.length; i++) {
          
                 str[j]=a.substring(i, i+3);
                 j++;
            }
            if(a.length==1)
            {
              str[j]=a+a+a;
            }
            else{
             const  l=a.length;
              str[j]=a[l-2]+a[l-1]+a[0];
              str[j+1]=a[l-1]+a[0]+a[1];
            }
           return str;
            }
          
         
            function Create_Bloom(str) {
              const arr=[];
              var j=0;
              const letters = new Set();
              for (var i = 0; i < str.length; i++) {
                var trigram_decimal=calculate_trigram_decimal(str[i]);
               var a1=h1(trigram_decimal);
               if(letters.has(a1)==false)
               {
                 arr[j]=a1;
                j++;
                letters.add(a1);
               }
               var a2=h2(trigram_decimal);
               if(letters.has(a2)==false)
               {
                 arr[j]=a2;
                j++;
                letters.add(a2);
               }
               var a3=h3(trigram_decimal);
               if(letters.has(a3)==false)
               {
                 arr[j]=a3;
                j++;
                letters.add(a3);
               }
         
           }
           arr[384]=j;
           for(var i=j;i<384;i++){
             arr[i]=Math.floor((Math.random() * 100) );
           }
             for(var i=0;i<j;i++){
               
               //arr[i]=arr[i]+arr[i+192];
             }
          return arr;
            }
          
          
          //keyword="abcdef";
         const s=Create_Trigrams(keyword);
           // console.log(s);
         const arr=Create_Bloom(s);
           // console.log(arr);
         
           const x = Math.floor((Math.random() * 3) );
           const drr=[];
           var j1=0;
           for(j1=0;j1<x;j1++)
            {
              drr[j1]=Math.floor((Math.random() * 2) );
            }
             // console.log(drr);
  

        crud.methods.Search_Keyword(arr,drr).call()
    .then(result => {
 
      $Search_KeywordResult.innerHTML = `Note-> Salt apperas only if match probability is >=90 % along with salts of dummy documents. Document name , salt in order are ${result}`;
    })
    .catch(_e => {
      $Search_KeywordResult.innerHTML = `Ooops... there was an error while trying to fetch Salt for keyword ${keyword}`;
    });
  });

    
};


document.addEventListener('DOMContentLoaded', () => {
  initWeb3()
    .then(_web3 => {
      web3 = _web3;
      crud = initContract();
      initApp(); 
    })
        .catch(e => console.log(e.message));
   
});
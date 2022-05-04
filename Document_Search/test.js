const keyword1 = "purpose";

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
console.log(ans);
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
      console.log(a1);
      if(letters.has(a1)==false)
      {
        arr[j]=a1;
       j++;
       letters.add(a1);
      }
      var a2=h2(trigram_decimal);
      console.log(a2);
      if(letters.has(a2)==false)
      {
        arr[j]=a2;
       j++;
       letters.add(a2);
      }
      var a3=h3(trigram_decimal);
      console.log(a3 );
      if(letters.has(a3)==false)
      {
        arr[j]=a3;
       j++;
       letters.add(a3);
      }

  }
 // arr[384]=j;
 /* for(var i=j;i<384;i++){
    arr[i]=Math.floor((Math.random() * 100) );
  }
    for(var i=0;i<j;i++){
      
     // arr[i]=arr[i]+arr[i+192];
    }*/
 return arr;
   }
 
 
 //keyword="abcdef";
const s=Create_Trigrams(keyword);
  // console.log(s);
const crr=Create_Bloom(s);
crr.sort();
   console.log(crr);

  const x = Math.floor((Math.random() * 3) );
  const drr=[];
  var j1=0;
  for(j1=0;j1<x;j1++)
   {
     drr[j1]=Math.floor((Math.random() * 2) );
   }
    // console.log(drr);

    
   


     
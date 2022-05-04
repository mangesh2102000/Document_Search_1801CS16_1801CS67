 pragma solidity ^0.5.0;
     pragma experimental ABIEncoderV2;
contract Document_Search{
    
       mapping(string => Index_details) details;
       string[] public docs;
       string[2] public dummy;
       uint count=0;
       
    struct Index_details{

     string key;
     string salt;
     bool [192]Bloom;        //SIZE OF BLOOM FILTER IS 192 BYTES
    }

function Key(string memory docc_name)view public returns(string  memory){
        uint i=findd_id(docc_name);
             if(i==1){
                 return details[docc_name].key;
             }
             else{
               revert('This document name does not exist !');  
             }
}


 function Insert_Dummy(string memory doc_name,string memory Key,string memory Salt,bool [192] memory input) public{
        uint i=findd_id(doc_name);
             if(i==0){
              if(count<2){
              Index_details memory p;
              p.key=Key;
              p.salt=Salt;
              p.Bloom=input;
              details[doc_name]=p;
              //dummy.push(doc_name);
              dummy[count]=doc_name;
              
              count++;
              }
              else{
                    revert('Dummy document already exist !');  
              }
             }
            else{
                   revert('This document name already exist !');  
             }

         
            
         
    }
    
    function Insert(string memory doc_name,string memory Key,string memory Salt,bool [192] memory input) public{
        uint i=findd_id(doc_name);
              if(i==0){
        
              Index_details memory p;
              p.key=Key;
              p.salt=Salt;

            p.Bloom=input;
              details[doc_name]=p; 
               docs.push(doc_name);    
              }
              else{
                revert('This document name already exist !');  
              }   
         
    }
   
    function Search_Keyword(uint [385] memory input,uint [] memory dum)view public returns(string [] memory){
        uint len=10+2*dum.length;
        string [] memory result=new string[](len);
        uint counter=0;
      for(uint i=0;i<docs.length&&counter<10;i++){
              int numerator=0;
              int denominator=0;
             for(uint j=0;j<input[384];j++)
             {
                 if(details[docs[i]].Bloom[input[j]%192])
                 {
                     numerator++;
                 }
                 denominator++;
             }
             int val=(100*numerator)/denominator;
            if(val>90){
              result[counter]=docs[i];
              result[counter+1]=details[docs[i]].salt;
              counter=counter+2;
            }
              
      }
       for(uint i=0;i<dum.length&&counter<len;i++){
            result[counter]=dummy[dum[i]];
            result[counter+1]=details[dummy[dum[i]]].salt;
            counter=counter+2;
       }
       return result;
         
    }

  
    
    function findd_id(string memory docname)view internal returns(uint){
             uint k=0;
            for(uint i=0;i<docs.length;i++){
                if(keccak256(abi.encodePacked(docs[i]))== keccak256(abi.encodePacked(docname)))
                {
                     k=1;
                }
            }
            
                if(keccak256(abi.encodePacked(dummy[0]))== keccak256(abi.encodePacked(docname))
                ||keccak256(abi.encodePacked(dummy[1]))== keccak256(abi.encodePacked(docname)))
                {
                     k=1;
                }
            
            return k;
           
        }
 
}
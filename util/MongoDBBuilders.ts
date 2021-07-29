
//Convert a text based search into a MongoDB Query
//Returns an array of the following:
interface MongoDBTerm{
  field:string;
  operator?:string;
  value:string;
}
export const splitTerms = (str) => {
  let terms=[];
  let buildingObject:MongoDBTerm={
    field:null,
    value:null
  };

  //Parse the string
  for(let i=0;i<str.length;i++){

    //If we hit an open parentheses
    if(str[i]==='('){
      //Look for the closing one
      for(let j=i;j<str.length;j++){
        //If we find it
        if(str[j]===')'){
          terms.push(splitTerms(str.substring(i+1, j)))
          i=j+1;
        }
      }
    }

    //deal with OR and ||
    else if(str.substr(i,3).toLowerCase()==='or '){
      terms.splice(terms.length-1, 0 ,{field:'OR',value:'OR'})
      i+=3;
    } else if(str.substr(i,2).toLowerCase()==='||'){
      terms.splice(terms.length-1, 0 ,{field:'OR',value:'OR'})
      i+=2;
    }
    
    //Deal with a termed segment
    else if([':', '>', '<', '='].includes(str[i])){
      //Reach back and grab the field
      for(let j=i-1;j>=0;j--){
        //Look for a space
        if(str[j]===' '){
          buildingObject.field=str.substring(j,i).toLowerCase().replaceAll(' ','');
          break;
        }
        if(j===0 && buildingObject.field === null){
          buildingObject.field=str.substring(0,i).toLowerCase().replaceAll(' ','');
          break;
        }
      }

      //Reach forward and grab the operation second part
      //(For >= and <=)
      if(str[i+1]==='='){ buildingObject.operator=str.substr(i,2); i++; }
      else{ buildingObject.operator=str.substr(i,1) }

      //Deal with the value
      let quoteFound=false;
      for(let j=i+1;j<str.length;j++){
        //If we hit a quote
        if(str[j]==='"'){
          quoteFound=true;
          //Look for the second half
          for(let k=j+1;k<str.length;k++){
            if(str[k]==='"' || k==str.length-1){
              //Save the value
              buildingObject.value=str.substring(j+1, k+1).replaceAll('"','');
              i=k;
              break;
            }
          }
        } if(quoteFound){ break; }
        //Look for a space
        else if(str[j]===' ' && !quoteFound){
          buildingObject.value=str.substring(i+1, j);
          i=j;
          break;
        }
        else if(j===str.length-1 && buildingObject.value === null){
          buildingObject.value=str.substring(i+1, str.length);
          i=j;
          break;
        }
      }
    }

    //Deal with a non-termed segment
    else if(![':', '>', '<', '='].includes(str[i+1])){
      buildingObject.field='n'
      //Deal with the value
      let quoteFound=false;
      for(let j=i;j<str.length;j++){
        //If we hit a quote
        if(str[j]==='"'){
          //If we have already hit a quote, end the term
          if(quoteFound){
            buildingObject.value=str.substring(i+1, j);
            i=j;
            break;
          }
          //If we haven't found a quote yet, mark that we have
          if(!quoteFound) { quoteFound=true; }
        }
        //Look for a space
        else if(str[j]===' ' && !quoteFound){
          buildingObject.value=str.substring(i, j);
          i=j;
          break;
        }
        else if(j===str.length-1 && buildingObject.value === null){
          buildingObject.value=str.substring(i, str.length);
          i=j;
          break;
        }
      }
    }

    if(buildingObject.value!==null && buildingObject.value!=='') { terms.push(buildingObject); }
    buildingObject={field:null,value:null};
  }

  return terms;
}

// When building the actual query from the converted terms

// MongoDB will interpret {Name:"Hogger"}  as Name=Hogger
// MongoDB will interpret {Name:/Hogger/i} as Name:Hogger

//A map of the shorthand terms to their Database names
const termMapper={
  n:'Name',
  r:'Rarity',
  c:'Class',
  s:'Card Set',
  m:'Cost',
  a:'Attack',
  h:'Health',
  k:'Keywords',
  e:'Textbox'
}

//Constructs a single term
const buildSingleTerm = (terms, i) => {
  let value;
  if(terms[i].operator==='='){
    value=terms[i].value;
  }else{
    value={$regex:terms[i].value, $options:'gi'};
  }

  //If the term is type
  if(terms[i].field==='t'){
    return {
      $or:[
        {Type:value},
        {Subtype:value},
        {"Token Type":value}
      ]
    }
  }

  //The numerical terms
  else if(['m','a','h',].includes(terms[i].field)){
    let numericalTerm={};
    if(terms[i].operator==='='||terms[i].operator===':')
      numericalTerm={$eq:parseInt(terms[i].value, 10)}
    if(terms[i].operator==='>')
      numericalTerm={$gt:parseInt(terms[i].value, 10)}
    if(terms[i].operator==='<')
      numericalTerm={$lt:parseInt(terms[i].value, 10)}
    if(terms[i].operator==='>=')
      numericalTerm={$gte:parseInt(terms[i].value, 10)}
    if(terms[i].operator==='<=')
      numericalTerm={$lte:parseInt(terms[i].value, 10)}

    return { [termMapper[terms[i].field]]:numericalTerm }
  }
  //Other term
  else{
    return { [termMapper[terms[i].field]]:value }
  }
}

//A helper method to allow joinTerms to be an async promise
const joinTermsHelper = (terms, nested=false) => {
  //Disable any tokens by default
  let uncollectibleAllowed=false;
  let finalTerms={ $and:[] };
  
  for(let i=0;i<terms.length;i++){

    //If it's a nested array
    if(Array.isArray(terms[i])){
      finalTerms.$and.push(joinTermsHelper(terms[i], true))
    }

    //If the term is OR
    else if(terms[i].field==='OR'){
      let orTerm={$or:[]}
      orTerm.$or.push(buildSingleTerm(terms,i+1));
      orTerm.$or.push(buildSingleTerm(terms,i+2));
      i+=2;
      finalTerms.$and.push(orTerm);
    }

    //If the term is uncollectible
    else if(terms[i].field==='u'){
      uncollectibleAllowed=true;
    }

    //Build a standard term
    else{
      finalTerms.$and.push(buildSingleTerm(terms,i))
    }
  }
  if(!uncollectibleAllowed && !nested){
    finalTerms.$and.push({"Token Type":{ $exists:false }})
  }

  if(finalTerms.$and===[]){ delete finalTerms.$and }
  return finalTerms;
}

//Constructs all of the terms together, all the lifting is done by joinTermsHelper
export const joinTerms = async(terms) => {
  return new Promise((resolve,reject)=>{
    resolve(joinTermsHelper(terms))
  })
}

//TODO: Search SmallSearch not redirecting properly
//TODO: 0 results staying loading forever.
//TODO: Random pages
//TODO: Hook discover/query into database
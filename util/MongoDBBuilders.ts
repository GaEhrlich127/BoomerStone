
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
          console.log('entering parenthetical')
          terms.push(splitTerms(str.substring(i+1, j)))
          i=j+1;
        }
      }
    }

    //deal with OR and ||
    else if(str.substr(i,3).toLowerCase()==='or '){
      terms.push({field:'OR',value:'OR'})
      i+=3;
    } else if(str.substr(i,2).toLowerCase()==='||'){
      terms.push({field:'OR',value:'OR'})
      i+=2;
    }
    
    //Deal with a termed segment
    else if([':', '>', '<', '='].includes(str[i])){
      //Reach back and grab the field
      for(let j=i-1;j>=0;j--){
        //Look for a space
        if(str[j]===' '){
          buildingObject.field=str.substring(j,i);
          break;
        }
        if(j===0 && buildingObject.field === null){
          buildingObject.field=str.substring(0,i);
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
          //If we haven't found a quote yet, mark that we have
          if(!quoteFound) { quoteFound=true; }
          //If we have hit a quote, end the term
          if(quoteFound){
            buildingObject.value=str.substring(i+1, j);
            i=j;
            break;
          }
        }
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

// {field:OR, value:OR} will go between the options b/c of english
// term1 OR term2
// however mongoDB needs to parse as {$or:[{term1},{term2}]} 

// MongoDB will interpret {Name:"Hogger"} as Name=Hogger
// MongoDB will interpret {Name:/Hogger/} as Name:Hogger
var form = document.forms[0]; // Will contain acesss in the form. Use 'console.log(form)' To know the attributes of the form.
var add_button = document.querySelector('#add');
add_button.onclick = add; //
var  results = document.querySelectorAll('.results');
var rounding_rule = document.querySelector('#rounding-rule');

var x = {
    'oprnd' : '',
    'exp' : 0
}
 
var y = {
    'oprnd' : '',
    'exp' : 0
}
 
var final = {
    'oprnd' : '',
    'exp' : 0
}
 
function add() {
    var operands= [form.querySelector('#operand1').value, form.querySelector('#operand2').value];
    var signs = [0,0];
    var exp = [0,0];
    var operation = form.querySelector('#rounding_operation').value;
    var supported = parseInt(form.querySelector('#digit_support').value);
    var prompt = "";
    
    if(operation == "grs"){
        rounding_rule.innerHTML = "Rounding Rule: " +' G/R/S';
    }
    else if (operation == "rnd"){
        rounding_rule.innerHTML = "Rounding Rule: " + "Rounding";
    }

    if(operands[0].length != 0 && operands[1].length !=0){
    for (let i = 0; i < operands.length; ++i){
        if (operands[i][0] == '-'){
        signs[i] = 1;
        operands[i] = operands[i].substring(1, operands[i].length);
        }
        if (operands[i].lastIndexOf('-') > 0){
            
            for (let j = operands[i].lastIndexOf('-')+1; j < operands[i].length; ++j){
                exp[i]   = exp[i] * 10;
                exp[i]   = exp[i]  + parseInt(operands[i][j])
            }
            exp[i] = exp[i] * -1;
         }
        else{
            for (let j = operands[i].indexOf('^') + 1; j < operands[i].length; ++j){
                exp[i]   = exp[i]   * 10;
                exp[i]  = exp[i]   + parseInt(operands[i][j])
            }
        }
        operands[i] = operands[i].substring(0,operands[i].indexOf('x'));
      
    }
   
   if(signs[0])
    operands[0] = TwosComp(operands[0]);

   if(signs[1])
    operands[1] = TwosComp(operands[1]);


    let x =  normalize(operands[0]);
    let y = normalize(operands[1]);
    x['exp'] = x['exp'] + exp[0];
    y['exp'] = y['exp'] + exp[1];
 
    align(x, y,supported);
    results[0].innerHTML = x.oprnd + "x2^" +x.exp +" + " + y.oprnd + "x2^"+ y.exp;



    
        /* ADD OPERATION */
        let carry = 0;
        let sum = ['\0'];
        let result = [];
     
        let a = "";
        let b = "";
     
        for(var i = x.oprnd.length - 1; i >= 0; i--) {
            a = x.oprnd[i];
            b = y.oprnd[i];
     
            if(a == '0' && b == '0') {
                if(carry == 0) {
                    sum.push('0');
                }
     
                else{
                    sum.push('1');
                    carry = 0;
                }
            }
     
            else if(a == '1' && b == '1') {
                if(carry == 0) {
                    sum.push('0');
                    carry = 1;
                }
     
                else{
                    sum.push('1');
                    carry = 1;
     
                    // carry-out
                    if(i == 0 && ((signs[0] == 0 && signs[1] == 1) || (signs[0] == 1 && signs[1] == 0))) {
                        sum.push('1');
                    }
                }
            }
     
            else if((a == '0' && b == '1') || (a == '1' && b == '0')) {
                if(carry == 0) {
                    sum.push('1');
                }
     
                else{
                    sum.push('0');
                    carry = 1;
     
                    // carry-out
                    if(i == 0 && ((signs[0] == 0 && signs[1] == 1) || (signs[0] == 1 && signs[1] == 0))) {
                        sum.push('1');
                    }
                }
            }
     
            else if(a == '.') {
                sum.push('.');
            }
        }
     
        for(i = 0; i < sum.length; i++) {
            result[i] = sum[sum.length - i];
        }
     
        result = result.join('');
        final.oprnd = result;
        final.exp = x.exp;
        
        results[1].innerHTML = x.oprnd + "x2^" +x.exp +" + " + y.oprnd + "x2^"+ y.exp + " = "+final.oprnd+"x2^"+final.exp;
 
        let z = normalize(final.oprnd);
        results[2].innerHTML = final.oprnd + "x2^" + final.exp;
        final.exp = final.exp + z.exp
        final.oprnd = rounding(final.oprnd, supported);
        results[3].innerHTML = final.oprnd + "x2^" + final.exp;
        results[4].innerHTML = final.oprnd + "x2^" + final.exp;
    }
    else{
        alert('Fill up the missing text fields');
    }
}

function check() {
    var operands = [form.querySelector('#operand1').value, form.querySelector('#operand2').value];
    var support = form.querySelector('#digit_support').value;
    var rounding = document.getElementById("rounding_operation");
 
    if(operands[0].length != 0 && operands[1].length != 0 && support.length != 0) {
        if(support >= 1 && support <= 32) {
            if(rounding.value != "none") {
                return 1;
            }
 
            else {
                alert('Kindly select a rounding operation');
                return 0;
            }
        }
 
        else {
            alert('Number of Digits Supported is out of range');
            return 0;
        }
    }
 
    else{
        alert('Fill up the missing text fields');
        return 0;
    }
}

   
   


function normalize(operand){
// Normalizes and return an object containing the normalized binary as a string, and an exponent which contains the number of alignments made 
    var temp;
    var exp = 0;
    var x,y;
if(operand.indexOf('1') + 1 != operand.indexOf('.') && operand.length != 0){
    if(operand.indexOf('.') < 0){
        operand = operand + '.';
    }
    if (operand.length < 3)
        operand = operand + '0';
         
    if (operand.indexOf('.') > operand.indexOf('1')){
        exp = operand.indexOf('.')-( operand.indexOf('1')+1);
        x = "1." + operand.substring(operand.indexOf('1')+ 1, operand.indexOf('.'));
        if(operand.indexOf('.') +1 != operand.length){
            y = operand.substring(operand.indexOf('.') + 1, operand.length);
        operand =  x + y;
        }
        else
            operand = x;
        }
    else{
        exp = (operand.indexOf('.')) - operand.indexOf('1');
        x = '1.';
        if(operand.indexOf('1') + 1 == operand.length)
            operand = x + '0';
        else{
            operand = x + operand.substring(operand.indexOf('1') + 1, operand.length);
        }
    }
}
          
    return {'exp': exp, 'oprnd':operand};
}

function align(op1,op2, supported){
    // Guard round sticky implement only, not yet the 
 
     var op = "";
     var difference = 0;
     var beginning = "";
     var oprndHolder = "";
     var round = form.querySelector('#rounding_operation').value;
   // From Line 93 to Line 125, It will just align the operands based on which operand have a bigger exponent
     if(op1.exp > op2.exp)
     {
         op = op2;
    }
     else if(op1.exp < op2.exp)
     {
         op = op1;
     }
      
   
     if (op1.exp != op2.exp){
     if((op1.exp > 0 && op2.exp > 0) || (op1.exp < 0 && op2.exp <0))
         difference = Math.abs(Math.abs(op1.exp) - Math.abs(op2.exp));
     else
         difference = Math.abs(op1.exp) + Math.abs(op2.exp);
       for (let i = 0; i < difference-1; ++i)
         op['oprnd'] = '0' + op['oprnd'];
    
     op['oprnd']= "0."+ op['oprnd'].substring(0, op['oprnd'].indexOf('.')) + op['oprnd'].substring(op['oprnd'].indexOf('.')+1,op['oprnd'].length); 
    

     if(op1.exp > op2.exp)
     {
         op2 = op;
         op2.exp = op1.exp
          
     }
     else if (op1.exp < op2.exp)
     {
         op1 = op;
         op1.exp = op2.exp;
     }}
      
     
       
     if(round == "grs" &&( op1.oprnd.length-1 <= 29 || op2.oprnd.length -1 <= 29)) // Why 29 bits? Because GRS needs 3 bits, and we only support 32 bits. If number of bit support exceeds 29, no rounding will happen
     {
         
         let temp1 = "";
         let temp2 = "";
         let grs = "";
         let length = 0;
         let count = 0;
  
         if((op1.oprnd.length - 1 > supported) || (op2.oprnd.length-1 > supported)){
             
             if(op1.oprnd.length - 1 > supported){
                 temp1 = op1.oprnd.substring(0, supported + 1);
                 length = op1.oprnd.length;
                 count = supported + 1;
                  
                 for (let i = 0; (count + i < op1.oprnd.length) && i < 2; ++i){
                      grs = grs + op1.oprnd[count + i];
                 }
                  if(op1.oprnd.substring(temp1.length+grs.length+1,op1.oprnd.length).indexOf('1') >= 0){
                     grs = grs + "1";
                 }
 
                 while (grs.length < 3){
                     grs = grs + "0";
                 }
               
                 op1.oprnd = temp1 + grs;                  
             }
              
             grs = "";
             if (op2.oprnd.length - 1 > supported){
                 temp2 = op2.oprnd.substring(0, supported + 1);
                 length = op2.oprnd.length;
                 count = supported + 1;
                  
                 for (let i = 0; (count + i < op2.oprnd.length) && i < 2; ++i){
                      grs = grs + op2.oprnd[count + i];
                 }
 
                 if(op2.oprnd.substring(temp2.length+grs.length+1,op2.oprnd.length).indexOf('1') >= 0){
                     grs = grs + "1";
                 }
 
                 while (grs.length < 3){
                     grs = grs + "0";
                 }
               
                 op2.oprnd = temp2 + grs; 
              }
         }
         if((op1.oprnd.length < supported + 4 || op2.oprnd.length < supported + 4)){
              
             while(op1.oprnd.length < supported + 4)
                 op1.oprnd = op1.oprnd + '0';
             while(op2.oprnd.length < supported + 4)
                 op2.oprnd = op2.oprnd + '0';
         }
     
     
        }
      
    else if (round =='rnd'){
        console.log(supported);
        op1.oprnd = rounding(op1.oprnd,supported);
        op2.oprnd = rounding(op2.oprnd,supported);
     }
 
     else{
         alert('Choose Rounding Operation');
     }
 }


 function rounding (operand, supported){ //string and integer
    let length = operand.length;
    
    if (length - 1 < supported + 3 ){
        while (length-1 < supported + 3){
            operand = operand + '0';
            length = length + 1;
        }
    }

    if(operand.substring(supported +1, ((supported + length)/ 2)+ 1).indexOf('1') != -1){
        let i = supported;
        let carry = true;
     

        while (carry){
            if(operand[i] == '1'){
                operand = operand.replaceAt(i,'0');
            }
            else if (operand[i] == '0'){
                operand = operand.replaceAt(i, '1');
                carry = false;
            }
             
            
            if (i == 0){
                carry = false;
            }
            i = i - 1;
           
        }
        
        return operand.substring(0,supported+1)
    }
     
    console.log(operand.substring(0,supported+1));
    return operand.substring(0,supported+1);

}

function TwosComp(operand){
    let counter = 0;
    for(let i = operand.length-1; i >= 0; --i ){
        if(operand[i] == '1' && counter > 0){
            operand = operand.replaceAt(i, '0');
        }
        else if (operand[i] == '0' && counter > 0){
            operand = operand.replaceAt(i,'1');
        }
        else if (operand[i] == '1' && counter == 0){
            counter =1;
        }
    }
    return operand;
}

String.prototype.replaceAt = function(index, replacement) { 
    return this.substring(0, index) + replacement + this.substring(index + replacement.length);
}
function greet(user) {                                                            
    return `Hello ${user.name}!`;                                          
}                                                                                
                                                                                 
export { greet };                                                                
                                                                                 
const danbev = {                                                                  
    name: "Daniel",                                                              
    age: 46                                                                      
};                                                                               
                                                                                 
console.log(greet(danbev));




// let ex_y = 2022;
// let ex_m = 8;

const passport = "original passport and  scan of all nonempty pages of the passport with payment reciept";
const card = "Copy of the current migration card";
const registrationCard = "The current registration card"
const picture = "One 3 x 4 cm picture"

function visaNotifier(chat_id: number, ex_m: number,ex_y: number){
  const date = new Date()
  const year = date.getFullYear();
//   let day = date.getDate();
  const month = date.getMonth() + 1;
  const deadline = 2
  
  if(ex_y < year){
  console.log(ex_y - year)
  } else if ((ex_m < month) && (deadline === Math.abs(ex_m - month))){
  console.log(`Dear ${chat_id}, \n pls visit room ${319}\n ${passport} \n ${card} \n ${registrationCard} \n ${picture} `)
  }
  
}
export default visaNotifier

